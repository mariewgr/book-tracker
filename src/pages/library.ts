/* Page Bibliothèque (liste/recherche + vue « grande bibliothèque »). */
import {FMT,FMT_IC,STATUT,fmt,fmtDateFr,isUpcoming} from '../core/book-utils';
import {coverEl,icSvg} from '../core/icons';
import {db,save} from '../core/state';
import {esc} from '../core/utils';
import {render} from '../main';
import {openInfo} from './book-info';
import {openLibEdit} from './library-shelf-editor';
import {openQuick} from './quick-update';
import {renderGenreFilter,sagaNames} from './sagas';
import {shelfVisual} from './shelves';

export let filter='all';
export const FILTERS=[['all','Tous'],['reading','En cours'],['tbr','À lire'],['done','Terminés'],['dnf','DNF'],['upcoming','🔜 À paraître']];
export function renderChips(){
  document.getElementById('filterChips').innerHTML=FILTERS.map(([v,l])=>{
    const n=v==='all'?db.books.length:(v==='upcoming'?db.books.filter(isUpcoming).length:db.books.filter(b=>b.statut===v).length);
    return `<div class="chip ${filter===v?'active':''}" onclick="setLibFilter('${v}')">${l} (${n})</div>`;
  }).join('');
}
export function setLibFilter(v){filter=v;renderLib();}
/* Recherche unifiée : titre, auteur ou saga */
export function bookMatch(b,q){
  return (b.titre+' '+(b.auteur||'')+' '+(b.saga||'')).toLowerCase().includes(q);
}

/* Filtres statut/genre/saga réutilisables : peuple des <select> (par id) et teste un livre */
export function fillFilterSelects(statusId,genreId,sagaId){
  if(statusId){
    const sel=document.getElementById(statusId);
    if(sel){
      const cur=sel.value;
      sel.innerHTML=FILTERS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('');
      sel.value=FILTERS.some(f=>f[0]===cur)?cur:'all';
      sel.classList.toggle('on',sel.value!=='all');
    }
  }
  if(genreId){
    const sel=document.getElementById(genreId);
    if(sel){
      const cur=sel.value;
      const genres=[...new Set(db.books.map(b=>b.genre).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
      sel.innerHTML='<option value="">Genre : tous</option>'+
        genres.map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join('');
      if(genres.includes(cur))sel.value=cur;
      sel.classList.toggle('on',!!sel.value);
    }
  }
  if(sagaId){
    const sel=document.getElementById(sagaId);
    if(sel){
      const cur=sel.value;
      const sagas=sagaNames();
      const nbSansSaga=db.books.filter(b=>!b.saga).length;
      sel.innerHTML='<option value="">Saga : toutes</option>'+
        (nbSansSaga?`<option value="__none__">Sans saga (${nbSansSaga})</option>`:'')+
        sagas.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
      if(sagas.includes(cur)||cur==='__none__')sel.value=cur;
      sel.classList.toggle('on',!!sel.value);
    }
  }
}
export function filtersActive(statusId,genreId,sagaId){
  if(statusId){const el=document.getElementById(statusId);if(el&&el.value&&el.value!=='all')return true;}
  if(genreId){const el=document.getElementById(genreId);if(el&&el.value)return true;}
  if(sagaId){const el=document.getElementById(sagaId);if(el&&el.value)return true;}
  return false;
}
export function pickerMatch(b,statusId,genreId,sagaId){
  if(statusId){const el=document.getElementById(statusId);if(el&&el.value&&el.value!=='all'){
    if(el.value==='upcoming'){if(!isUpcoming(b))return false;}
    else if(b.statut!==el.value)return false;
  }}
  if(genreId){const el=document.getElementById(genreId);if(el&&el.value&&b.genre!==el.value)return false;}
  if(sagaId){const el=document.getElementById(sagaId);if(el&&el.value){
    if(el.value==='__none__'){if(b.saga)return false;}
    else if(b.saga!==el.value)return false;
  }}
  return true;
}

/* ---------- Sagas ---------- */
export function setLibViewMode(mode){
  db.settings.libView=mode;
  save();render();
}
/* Livres non encore placés manuellement (nouveaux livres, ou tout premier affichage) : triés
   par saga (tomes dans l'ordre), puis titre — insérés à la suite de la disposition déjà
   personnalisée, qui elle reste inchangée tant qu'on n'y touche pas. */
export function libEffItems(){
  const saved=(db.settings.libLayout&&db.settings.libLayout.items)||[];
  const known=new Set(db.books.map(b=>b.id));
  const kept=saved.filter(it=>it.divider||it.deco||known.has(it.bookId));
  const placed=new Set(kept.filter(it=>!it.divider&&!it.deco).map(it=>it.bookId));
  const extra=db.books.filter(b=>!placed.has(b.id))
    .sort((a,b)=>(a.saga||a.titre).localeCompare(b.saga||b.titre)||(a.tome||0)-(b.tome||0)||a.titre.localeCompare(b.titre))
    .map(b=>({bookId:b.id,mode:'spine',row:null}));
  return[...kept,...extra];
}
export function renderLibShelf(){
  const el=document.getElementById('libShelfMode');
  if(!db.books.length){
    el.innerHTML=`<div class="empty"><span class="big">${icSvg('book')}</span>Ta bibliothèque est vide.<br>Appuie sur <b>+</b> pour ajouter ton premier livre !</div>`;
    return;
  }
  const rows=(db.settings.libLayout&&db.settings.libLayout.rows)||8;
  const shelf={nom:'',rows,items:libEffItems()};
  el.innerHTML=`<div style="display:flex;justify-content:flex-end;gap:8px;padding:0 10px 8px">
      <button class="smallbtn" onclick="openLibEdit()">${icSvg('pencil')} Modifier</button>
    </div>${shelfVisual(shelf)}`;
}
export function renderLib(){
  const mode=db.settings.libView||'list';
  document.getElementById('libListMode').classList.toggle('hidden',mode!=='list');
  document.getElementById('libShelfMode').classList.toggle('hidden',mode!=='shelf');
  [...document.querySelectorAll('#libViewSeg button')].forEach(b=>b.classList.toggle('on',b.dataset.val===mode));
  if(mode==='shelf'){renderLibShelf();return;}
  renderChips();renderGenreFilter();
  const q=document.getElementById('search').value.toLowerCase().trim();
  let list=filter==='upcoming'?db.books.filter(isUpcoming):db.books.filter(b=>filter==='all'||b.statut===filter);
  list=list.filter(b=>pickerMatch(b,null,'genreFilter','sagaFilter'));
  if(q)list=list.filter(b=>bookMatch(b,q));
  list.sort((a,b)=>(b.dateAjout||0)-(a.dateAjout||0));
  const el=document.getElementById('bookList');
  if(!list.length){
    el.innerHTML=`<div class="empty"><span class="big">${icSvg('book')}</span>${db.books.length?'Aucun résultat.':'Ta bibliothèque est vide.<br>Appuie sur <b>+</b> pour ajouter ton premier livre !'}</div>`;
    return;
  }
  el.innerHTML=list.map(b=>{
    const[sl,sc]=STATUT[b.statut];
    return `<div class="book" onclick="openInfo('${b.id}')">
      <div class="top">${coverEl(b.couverture,'')}<div class="tinfo"><h3>${esc(b.titre)}</h3><div class="auth">${esc(b.auteur)||'—'}</div></div>
      <span class="badge ${sc}">${sl}</span></div>
      <div class="meta">
        <span>${icSvg(FMT_IC[fmt(b)])} ${FMT[fmt(b)]}</span>
        ${b.genre?`<span>${icSvg('tag')} ${esc(b.genre)}</span>`:''}
        ${b.saga?`<span>${icSvg('saga')} ${esc(b.saga)}${b.tome?' T'+b.tome:''}</span>`:''}
        ${b.pages?`<span>${b.pages} p.</span>`:''}
        ${isUpcoming(b)?`<span style="color:var(--accent2);font-weight:700">${icSvg('soon')} Sortie le ${fmtDateFr(b.dateParution)}</span>`:''}
        ${(b.statut==='done'||b.statut==='dnf')&&b.note?`<span class="stars">${'★'.repeat(b.note)}${'☆'.repeat(5-b.note)}</span>`:''}
        ${b.statut==='reading'?`<span style="color:var(--accent);font-weight:700">${fmt(b)==='papier'&&b.pages?`p. ${b.pageActuelle||0}/${b.pages}`:(b.progression||0)+' %'}</span>`:''}
        ${b.statut==='dnf'&&b.progression?`<span style="color:var(--red);font-weight:700">arrêté à ${b.progression} %</span>`:''}
      </div>
      ${b.statut==='reading'?`<div class="pbar"><div style="width:${b.progression||0}%"></div></div>
      <button class="quickbtn" onclick="event.stopPropagation();openQuick('${b.id}')">${icSvg('book-open')} Mettre à jour mon avancement</button>`:''}
    </div>`;
  }).join('');
}

