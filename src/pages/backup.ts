/* Export/import de sauvegarde (JSON natif + conversion Book Nova). */
import {t} from '../core/i18n';
import {uploadFile} from '../core/images';
import {db,normalizeDb,save,setDb} from '../core/state';
import {sbUser} from '../core/supabase';
import {closeModals,openDlg,toast,uid} from '../core/utils';
import {render} from '../main';
import {FEEDBACK_EMAIL,sendFeedback} from './feedback';
import {cacheAllCoversQuiet} from './settings';

export function exportData(){
  const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='mabibli-sauvegarde-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
}
/* Conversion depuis une sauvegarde Book Nova */
export const NV_LANG={fr:'Français',en:'Anglais',es:'Espagnol',de:'Allemand',it:'Italien',pt:'Portugais',nl:'Néerlandais',ja:'Japonais'};
export const NV_GENRE={'science-fiction':'Science-fiction',fantasy:'Fantasy',romance:'Romance',contemporary:'Contemporain','non-fiction':'Non-fiction',thriller:'Thriller',mystery:'Policier',horror:'Horreur',classics:'Classique',historical:'Historique','young-adult':'Young adult',poetry:'Poésie',biography:'Biographie'};
export function nvDate(t){return t?new Date(t).toISOString().slice(0,10):'';}
export function fromBookNova(d){
  const books=(d.books||[]).map(b=>{
    const pages=+b.pageCount||0;
    const done=!!(b.completedAt||b.finishReadingDate||b.completionType||(pages>0&&(b.currentPage||0)>=pages));
    const reading=!done&&(!!b.startReadingDate||(b.currentPage||0)>0);
    const statut=done?'done':(reading?'reading':'tbr');
    const g=(b.genres||[])[0]||'';
    const NV_FMT={paper:'papier',ebook:'numerique',audio:'audio',audiobook:'audio'};
    return {
      id:b.id||uid(),
      titre:b.title||'Sans titre',
      synopsis:b.description||'',
      isbn:b.isbn||'',
      couverture:(b.imageUrl&&/^https?:/.test(b.imageUrl))?b.imageUrl:(b.isbn?'https://covers.openlibrary.org/b/isbn/'+b.isbn+'-M.jpg?default=false':''),
      format:NV_FMT[b.format]||'papier',
      pageActuelle:statut==='reading'?(b.currentPage||0):0,
      auteur:(b.authors||[]).join(', '),
      genre:NV_GENRE[g]||(g?g.charAt(0).toUpperCase()+g.slice(1):''),
      langue:NV_LANG[b.language]||b.language||'',
      pages,
      epaisseur:b.thickness>0?+(b.thickness*100).toFixed(1):0,
      fiction:(b.category||'fiction')!=='non-fiction',
      statut,
      progression:done?100:(pages?Math.min(100,Math.round((b.currentPage||0)/pages*100)):0),
      note:b.rating?Math.min(5,Math.round(b.rating)):0,
      avis:'',
      dateFin:done?nvDate(b.finishReadingDate||b.completedAt):'',
      dateAjout:b.createdAt||Date.now(),
    };
  });
  const nvLoan=(l,type)=>({
    id:l.id||uid(),
    titre:l.bookTitle||l.title||'?',
    personne:l.personName||l.person||l.borrowerName||l.lenderName||l.name||'?',
    type,date:nvDate(l.loanDate||l.date||l.borrowedDate||l.createdAt),
    note:l.notes||l.note||'',
    rendu:!!(l.returned||l.returnedAt||l.isReturned),
    dateAjout:l.createdAt||Date.now(),
  });
  const loans=[...(d.bookLoans||[]).map(l=>nvLoan(l,'prete')),
               ...(d.borrowedBooks||[]).map(l=>nvLoan(l,'emprunte'))];
  const sessions=[];
  (d.books||[]).forEach(b=>(b.readingSessions||[]).forEach(s=>{
    if(s.pages>0&&s.timestamp)sessions.push({id:uid(),date:nvDate(s.timestamp),bookId:b.id,titre:b.title||'',pages:s.pages});
  }));
  return {books,loans,sessions,settings:{...db.settings}};
}
export function importData(input){
  const f=input.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=JSON.parse(r.result);
      if(!Array.isArray(d.books))throw 0;
      /* Book Nova ou format natif ? */
      const isNative=!d.books.length||d.books[0].titre!==undefined;
      const inc=isNative?{books:d.books,loans:d.loans||[],sessions:d.sessions||[],shelves:d.shelves||[],ranking:d.ranking||[],settings:d.settings||db.settings}:fromBookNova(d);
      const apply=merge=>{
        let addedCount=inc.books.length;
        if(merge){
          const ids=new Set(db.books.map(b=>b.id));
          const newBooks=inc.books.filter(b=>!ids.has(b.id));
          addedCount=newBooks.length;
          db.books.push(...newBooks);
          const lids=new Set(db.loans.map(l=>l.id));
          db.loans.push(...(inc.loans||[]).filter(l=>!lids.has(l.id)));
          const skey=s=>s.date+'|'+s.bookId;
          const sids=new Set(db.sessions.map(skey));
          db.sessions.push(...(inc.sessions||[]).filter(s=>!sids.has(skey(s))));
          const shids=new Set(db.shelves.map(s=>s.id));
          db.shelves.push(...(inc.shelves||[]).filter(s=>!shids.has(s.id)));
          const rids=new Set(db.ranking.map(r=>r.type+'|'+r.id));
          db.ranking.push(...(inc.ranking||[]).filter(r=>!rids.has(r.type+'|'+r.id)));
        }else{
          setDb(normalizeDb({books:inc.books,loans:inc.loans||[],sessions:inc.sessions||[],shelves:inc.shelves||[],ranking:inc.ranking||[],settings:inc.settings||db.settings}));
        }
        save();closeModals();render();
        /* Convertit en arrière-plan toute couverture encore en base64 (import hors ligne, vieille
           sauvegarde…) vers notre storage — sinon la sync peut échouer silencieusement si le total
           dépasse la taille de requête acceptée par Supabase (gros fichiers d'import notamment). */
        cacheAllCoversQuiet();
        toast(merge
          ?'Import réussi ✅ '+addedCount+' nouveau'+(addedCount>1?'x':'')+' livre'+(addedCount>1?'s':'')+' ajouté'+(addedCount>1?'s':'')+' ('+db.books.length+' au total)'+(isNative?'':' — Book Nova')
          :'Import réussi ✅ '+addedCount+' livre'+(addedCount>1?'s':'')+' ('+db.books.length+' au total)'+(isNative?'':' — Book Nova'));
      };
      if(db.books.length)
        openDlg('Ta bibliothèque contient déjà '+db.books.length+' livres. Que faire de l\'import ('+inc.books.length+' livres) ?',null,[
          {label:'Fusionner (ajouter)',fn:()=>apply(true)},
          {label:'Tout remplacer',danger:true,fn:()=>apply(false)},
          {label:'Annuler',ghost:true}
        ]);
      else apply(false);
    }catch(e){offerImportFailureReport(f);}
  };
  r.readAsText(f);input.value='';
}
/* Format non reconnu : propose d'envoyer le fichier (avec le nom de l'appli d'origine) pour
   qu'on puisse ajouter la prise en charge de ce format, sur le même principe que sendFeedback
   (mailto + fichier hébergé, mailto n'acceptant pas de pièce jointe). */
export async function sendImportFailureReport(file,appName){
  toast('Préparation…');
  const url=sbUser?await uploadFile(file,'import-fail',file.type||'application/json'):null;
  const fileNote=url?'\n\nFichier : '+url:'\n\n(Fichier non joint — connecte-toi pour pouvoir l\'envoyer)';
  const body='Fichier d\'import non reconnu, venant de : '+(appName||'(non précisé)')+fileNote+'\n\n— Envoyé depuis Ma Bibli';
  const mailto='mailto:'+FEEDBACK_EMAIL+'?subject='+encodeURIComponent('Ma Bibli — Format d\'import non reconnu')+'&body='+encodeURIComponent(body);
  window.location.href=mailto;
  toast('Ton appli mail va s\'ouvrir avec le fichier prêt 📧');
}
export function offerImportFailureReport(file){
  openDlg('Fichier non reconnu 😕 De quelle application vient-il ? On peut t\'aider à l\'importer si tu nous l\'envoies.','',[
    {label:'Envoyer',fn:v=>sendImportFailureReport(file,(v||'').trim())},
    {label:'Annuler',ghost:true}
  ]);
}
