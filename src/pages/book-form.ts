/* Formulaire d'ajout/modification d'un livre. */
import {fmt,fmtDateFr} from '../core/book-utils';
import {cacheExternalImage,cleanupOldImage,formImgs,resetFormImgs} from '../core/images';
import {tab} from '../core/navigation';
import {db,save} from '../core/state';
import {closeModals,confetti,esc,toast,uid} from '../core/utils';
import {render} from '../main';
import {syncFeedForBook} from './feed';
import {isbnClean,isbnMsg,searchMsg} from './isbn-scan';
import {logSession} from './quick-update';
import {sagaNames} from './sagas';
import {newShelf} from './shelves';

export let editId=null,starVal=0;
export function segPick(btn){[...btn.parentNode.children].forEach(b=>b.classList.remove('on'));btn.classList.add('on');}
export function segVal(id){return document.querySelector('#'+id+' button.on').dataset.val;}
export function segSet(id,val){[...document.querySelectorAll('#'+id+' button')].forEach(b=>b.classList.toggle('on',b.dataset.val===val));}
export function toggleStatutFields(){
  const s=segVal('segStatut'),f=segVal('segFormat');
  document.getElementById('progWrap').classList.toggle('hidden',s!=='reading'&&s!=='dnf');
  document.getElementById('doneWrap').classList.toggle('hidden',s!=='done'&&s!=='dnf');
  /* papier : suivi par page ; numérique & audio : suivi par % */
  document.getElementById('progPages').classList.toggle('hidden',f!=='papier');
  document.getElementById('progPct').classList.toggle('hidden',f==='papier');
}
/* Progression en % (numérique/audio) : slider + saisie directe + raccourcis, tous synchronisés
   sur les mêmes trois éléments (glisser reste possible, mais taper ou taper un raccourci est
   plus rapide/précis, surtout sur mobile). */
export function setProg(sliderId,numId,valId,val){
  val=Math.max(0,Math.min(100,Math.round(+val)||0));
  document.getElementById(sliderId).value=val;
  document.getElementById(numId).value=val;
  document.getElementById(valId).textContent=val+' %';
}
export function renderStars(){
  document.getElementById('starPick').innerHTML=[1,2,3,4,5].map(i=>
    `<span class="${i<=starVal?'on':''}" onclick="setStarVal(${i})">★</span>`).join('');
}
export function setStarVal(n){starVal=n;renderStars();}
/* Notes détaillées (fiche de lecture) */
export const SUBCATS=[['ecriture','Qualité de l\'écriture'],['histoire','Qualité de l\'histoire'],
  ['personnages','Personnages'],['tension','Tension'],['tristesse','Tristesse'],
  ['romance','Romance'],['drole','Drôle'],['facile','Facile à lire'],['fin','Fin']];
export let subVals={},smutVal=0;
export function renderSubRatings(){
  document.getElementById('subRatings').innerHTML=SUBCATS.map(([k,l])=>
    `<div class="subrow"><span>${l}</span><span class="substars">${[1,2,3,4,5].map(i=>
      `<span class="${(subVals[k]||0)>=i?'on':''}" onclick="setSub('${k}',${i})">★</span>`).join('')}</span></div>`).join('');
}
export function setSub(k,i){subVals[k]=subVals[k]===i?0:i;renderSubRatings();}
export function renderSmut(){
  document.getElementById('smutPick').innerHTML=[1,2,3,4,5].map(i=>
    `<span class="pep ${smutVal>=i?'on':''}" onclick="setSmut(${i})">🌶</span>`).join('');
}
export function setSmut(i){smutVal=smutVal===i?0:i;renderSmut();}
/* Date de parution : livre pas encore sorti */
export function updateParutionMsg(){
  const el=document.getElementById('parutionMsg');if(!el)return;
  const v=document.getElementById('f_dateParution').value;
  if(!v){el.textContent='';return;}
  const today=new Date().toISOString().slice(0,10);
  el.textContent=v>today?'🔜 Pas encore sorti — sortie prévue le '+fmtDateFr(v):'';
}
export function sagaSuggest(){
  const v=document.getElementById('f_saga').value.toLowerCase().trim();
  const names=sagaNames().filter(n=>n.toLowerCase()!==v&&(!v||n.toLowerCase().includes(v))).slice(0,8);
  document.getElementById('sagaSug').innerHTML=names.map(n=>
    `<div class="chip" onclick="pickSaga(this.dataset.n)" data-n="${esc(n)}">${esc(n)}</div>`).join('');
}
export function pickSaga(n){
  document.getElementById('f_saga').value=n;
  document.getElementById('sagaSug').innerHTML='';
}
export function fillDatalists(){
  const g=[...new Set(db.books.map(b=>b.genre).filter(Boolean))];
  const l=[...new Set(db.books.map(b=>b.langue).filter(Boolean))];
  const s=[...new Set(db.books.map(b=>b.saga).filter(Boolean))];
  document.getElementById('genreList').innerHTML=g.map(x=>`<option value="${esc(x)}">`).join('');
  document.getElementById('langList').innerHTML=l.map(x=>`<option value="${esc(x)}">`).join('');
  document.getElementById('sagaList').innerHTML=s.map(x=>`<option value="${esc(x)}">`).join('');
}
export function openAdd(){
  if(tab==='shelf'){newShelf();return;}
  editId=null;starVal=0;subVals={};smutVal=0;
  ['f_fmc','f_mmc','f_tropes','f_resume','f_finNote'].forEach(i=>document.getElementById(i).value='');
  segSet('segRec','');renderSubRatings();renderSmut();
  document.getElementById('bookModalTitle').textContent='Ajouter un livre';
  ['f_titre','f_auteur','f_genre','f_pages','f_avis','f_isbn','f_couverture','f_spine','f_saga','f_tome','f_synopsis','f_dateParution'].forEach(i=>document.getElementById(i).value='');
  isbnMsg('');updateParutionMsg();
  document.getElementById('f_langue').value='Français';
  document.getElementById('f_dateFin').value=new Date().toISOString().slice(0,10);
  document.getElementById('f_noDate').checked=false;
  document.getElementById('f_dateFin').disabled=false;
  document.getElementById('f_prog').value=0;document.getElementById('f_progNum').value='';document.getElementById('progVal').textContent='0 %';
  document.getElementById('f_page').value='';
  segSet('segFic','fiction');segSet('segStatut','tbr');segSet('segFormat','papier');
  document.getElementById('delBookBtn').classList.add('hidden');
  resetFormImgs();
  document.getElementById('f_search').value='';
  document.getElementById('searchResults').innerHTML='';searchMsg('');
  document.getElementById('sagaSug').innerHTML='';
  toggleStatutFields();renderStars();fillDatalists();
  document.getElementById('bookModal').classList.add('open');
}
export function openEdit(id){
  const b=db.books.find(x=>x.id===id);if(!b)return;
  editId=id;starVal=b.note||0;
  subVals={...(b.sousNotes||{})};smutVal=b.smut||0;
  document.getElementById('f_fmc').value=b.fmc||'';
  document.getElementById('f_mmc').value=b.mmc||'';
  document.getElementById('f_tropes').value=b.tropes||'';
  document.getElementById('f_resume').value=b.resume||'';
  document.getElementById('f_finNote').value=b.finNote||'';
  segSet('segRec',b.recommande===true?'oui':(b.recommande===false?'non':''));
  renderSubRatings();renderSmut();
  document.getElementById('bookModalTitle').textContent='Modifier le livre';
  document.getElementById('f_titre').value=b.titre;
  document.getElementById('f_isbn').value=b.isbn||'';isbnMsg('');
  document.getElementById('f_couverture').value=b.couverture||'';
  document.getElementById('f_spine').value=b.spine||'';
  document.getElementById('f_auteur').value=b.auteur||'';
  document.getElementById('f_genre').value=b.genre||'';
  document.getElementById('f_langue').value=b.langue||'';
  document.getElementById('f_saga').value=b.saga||'';
  document.getElementById('f_tome').value=b.tome||'';
  document.getElementById('f_synopsis').value=b.synopsis||'';
  document.getElementById('f_pages').value=b.pages||'';
  document.getElementById('f_dateParution').value=b.dateParution||'';updateParutionMsg();
  document.getElementById('f_avis').value=b.avis||'';
  document.getElementById('f_dateFin').value=b.dateFin||new Date().toISOString().slice(0,10);
  const noD=b.statut==='done'&&!b.dateFin;
  document.getElementById('f_noDate').checked=noD;
  document.getElementById('f_dateFin').disabled=noD;
  document.getElementById('f_prog').value=b.progression||0;
  document.getElementById('f_progNum').value=b.progression||'';
  document.getElementById('progVal').textContent=(b.progression||0)+' %';
  document.getElementById('f_page').value=b.pageActuelle||'';
  segSet('segFic',b.fiction===false?'nonfiction':'fiction');
  segSet('segStatut',b.statut);segSet('segFormat',fmt(b));
  document.getElementById('delBookBtn').classList.remove('hidden');
  resetFormImgs();
  document.getElementById('f_search').value='';
  document.getElementById('searchResults').innerHTML='';searchMsg('');
  document.getElementById('sagaSug').innerHTML='';
  toggleStatutFields();renderStars();fillDatalists();
  document.getElementById('bookModal').classList.add('open');
}
export function saveBook(){
  const titre=document.getElementById('f_titre').value.trim();
  if(!titre){toast('Le titre est obligatoire 🙂');return;}
  const statut=segVal('segStatut'),format=segVal('segFormat');
  const pages=+document.getElementById('f_pages').value||0;
  let progression=statut==='done'?100:0,pageActuelle=0;
  if(statut==='reading'||statut==='dnf'){
    if(format==='papier'){
      pageActuelle=Math.max(0,+document.getElementById('f_page').value||0);
      if(pages)pageActuelle=Math.min(pageActuelle,pages);
      progression=pages?Math.round(pageActuelle/pages*100):0;
    }else progression=+document.getElementById('f_prog').value;
  }
  const prev=editId?db.books.find(x=>x.id===editId):null;
  const b={
    id:editId||uid(),titre,
    saga:document.getElementById('f_saga').value.trim(),
    tome:+document.getElementById('f_tome').value||0,
    synopsis:document.getElementById('f_synopsis').value.trim(),
    citations:(prev&&prev.citations)||[],
    relectures:(prev&&prev.relectures)||0,
    isbn:isbnClean(document.getElementById('f_isbn').value),
    couverture:formImgs.couverture||document.getElementById('f_couverture').value.trim(),
    spine:formImgs.spine||document.getElementById('f_spine').value.trim(),
    auteur:document.getElementById('f_auteur').value.trim(),
    genre:document.getElementById('f_genre').value.trim(),
    langue:document.getElementById('f_langue').value.trim(),
    dateParution:document.getElementById('f_dateParution').value||'',
    pages,
    fiction:segVal('segFic')==='fiction',
    format,statut,progression,pageActuelle,
    note:(statut==='done'||statut==='dnf')?starVal:0,
    avis:(statut==='done'||statut==='dnf')?document.getElementById('f_avis').value.trim():'',
    fmc:document.getElementById('f_fmc').value.trim(),
    mmc:document.getElementById('f_mmc').value.trim(),
    tropes:document.getElementById('f_tropes').value.trim(),
    resume:document.getElementById('f_resume').value.trim(),
    finNote:document.getElementById('f_finNote').value.trim(),
    sousNotes:{...subVals},
    smut:smutVal,
    recommande:segVal('segRec')==='oui'?true:(segVal('segRec')==='non'?false:null),
    dateFin:((statut==='done'||statut==='dnf')&&!document.getElementById('f_noDate').checked)?document.getElementById('f_dateFin').value:'',
    dateAjout:editId?(db.books.find(x=>x.id===editId)||{}).dateAjout||Date.now():Date.now(),
  };
  /* Journal : pages lues aujourd'hui = différence avec l'état précédent */
  const old=editId?db.books.find(x=>x.id===editId):null;
  const readOf=x=>!x?0:(x.statut==='done'?(x.pages||0):(fmt(x)==='papier'?(x.pageActuelle||0):Math.round((x.progression||0)/100*(x.pages||0))));
  const newRead=statut==='done'?pages:(format==='papier'?pageActuelle:Math.round(progression/100*pages));
  const today=new Date().toISOString().slice(0,10);
  let delta=0;
  if(old)delta=newRead-readOf(old);
  else if(statut==='reading')delta=newRead;
  else if(statut==='done'&&b.dateFin===today)delta=pages;
  if(delta>0)logSession(b.id,titre,delta,today);
  if(statut==='done'&&(!prev||prev.statut!=='done'))confetti();
  if(editId)db.books=db.books.map(x=>x.id===editId?b:x);else db.books.push(b);
  save();closeModals();render();
  if(prev){cleanupOldImage(prev.couverture,b.couverture);cleanupOldImage(prev.spine,b.spine);}
  cacheExternalImage(b.id,'couverture');
  cacheExternalImage(b.id,'spine');
  syncFeedForBook(b);
}
/* ---------- Avancement rapide ---------- */

export function setFormNotes(star,subs,smut){starVal=star;subVals=subs;smutVal=smut;}
