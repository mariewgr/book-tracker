/* Mise à jour rapide de l'avancement + changement de statut rapide. */
import {fmt} from '../core/book-utils';
import {db,save} from '../core/state';
import {askConfirm,closeModals,confetti,uid} from '../core/utils';
import {render} from '../main';
import {editId,openEdit,saveBook} from './book-form';
import {openInfo} from './book-info';
import {syncFeedForBook} from './feed';

export let quickId=null;
export function openQuick(id){
  const b=db.books.find(x=>x.id===id);if(!b)return;
  quickId=id;
  document.getElementById('quickTitle').textContent=b.titre;
  const paper=fmt(b)==='papier';
  document.getElementById('quickPages').classList.toggle('hidden',!paper);
  document.getElementById('quickPct').classList.toggle('hidden',paper);
  if(paper){
    document.getElementById('q_page').value=b.pageActuelle||'';
    document.getElementById('q_pageHint').textContent=b.pages?'sur '+b.pages+' pages':'';
  }else{
    document.getElementById('q_prog').value=b.progression||0;
    document.getElementById('q_progNum').value=b.progression||'';
    document.getElementById('q_progVal').textContent=(b.progression||0)+' %';
  }
  document.getElementById('q_date').value=new Date().toISOString().slice(0,10);
  document.getElementById('quickModal').classList.add('open');
}
export function saveQuick(finish){
  const b=db.books.find(x=>x.id===quickId);if(!b)return;
  const paper=fmt(b)==='papier';
  const today=document.getElementById('q_date').value||new Date().toISOString().slice(0,10);
  const oldRead=paper?(b.pageActuelle||0):Math.round((b.progression||0)/100*(b.pages||0));
  if(!finish){
    if(paper){
      let p=Math.max(0,+document.getElementById('q_page').value||0);
      if(b.pages)p=Math.min(p,b.pages);
      b.pageActuelle=p;
      b.progression=b.pages?Math.round(p/b.pages*100):0;
      if(b.pages&&p>=b.pages)finish=true;
    }else{
      b.progression=+document.getElementById('q_prog').value;
      if(b.progression>=100)finish=true;
    }
  }
  if(finish){
    b.statut='done';b.progression=100;b.pageActuelle=b.pages||0;
    if(!b.dateFin)b.dateFin=today;
    confetti();
  }
  const newRead=b.statut==='done'?(b.pages||0):(paper?(b.pageActuelle||0):Math.round(b.progression/100*(b.pages||0)));
  if(newRead-oldRead>0)logSession(b.id,b.titre,newRead-oldRead,today);
  save();closeModals();render();
  syncFeedForBook(b);
  if(finish&&b.statut==='done')setTimeout(()=>openEdit(b.id),150); /* pour noter + laisser un avis */
}
export function logSession(bookId,titre,pages,date){
  const s=db.sessions.find(x=>x.date===date&&x.bookId===bookId);
  if(s)s.pages+=pages;else db.sessions.push({id:uid(),date,bookId,titre,pages});
}
/* Changer le statut directement depuis la fiche du livre (pas besoin d'ouvrir Modifier).
   Reprend les mêmes effets de bord que saveQuick()/saveBook() pour rester cohérent : date de
   fin par défaut, confettis à la première fois « Terminé », page/progression remises à zéro en
   repassant « À lire », journal des pages lues mis à jour selon la différence. */
export function quickSetStatut(id,statut){
  const b=db.books.find(x=>x.id===id);if(!b)return;
  if(b.statut===statut)return;
  const today=new Date().toISOString().slice(0,10);
  const paper=fmt(b)==='papier';
  const readOf=x=>x.statut==='done'?(x.pages||0):(paper?(x.pageActuelle||0):Math.round((x.progression||0)/100*(x.pages||0)));
  const oldRead=readOf(b);
  const wasDone=b.statut==='done';
  b.statut=statut;
  if(statut==='done'){
    b.progression=100;b.pageActuelle=b.pages||0;
    if(!b.dateFin)b.dateFin=today;
    if(!wasDone)confetti();
  }else if(statut==='dnf'){
    if(!b.dateFin)b.dateFin=today;
  }else if(statut==='tbr'){
    b.progression=0;b.pageActuelle=0;
  }
  const newRead=readOf(b);
  if(newRead-oldRead>0)logSession(b.id,b.titre,newRead-oldRead,today);
  save();openInfo(id);
  syncFeedForBook(b);
}
export function deleteBook(){
  askConfirm('Supprimer ce livre ?',()=>{
    const delId=editId;
    db.books=db.books.filter(x=>x.id!==delId);
    db.shelves.forEach(s=>s.items=s.items.filter(it=>it.bookId!==delId));
    db.ranking=db.ranking.filter(r=>!(r.type==='book'&&r.id===delId));
    save();closeModals();render();
    syncFeedForBook({id:delId,statut:'deleted'});
  },'Supprimer');
}

