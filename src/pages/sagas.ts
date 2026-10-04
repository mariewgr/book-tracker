/* Page Sagas. */
import {coverEl,icSvg} from '../core/icons';
import {db} from '../core/state';
import {esc} from '../core/utils';
import {openInfo} from './book-info';
import {bookMatch,fillFilterSelects,filtersActive,pickerMatch} from './library';

export const sagaNames=()=>[...new Set(db.books.map(b=>b.saga).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
export const sagaBooks=n=>db.books.filter(b=>b.saga===n).sort((a,b)=>(a.tome||99)-(b.tome||99));
export function sagaMatch(n,q){
  return n.toLowerCase().includes(q)||sagaBooks(n).some(b=>bookMatch(b,q));
}
export function renderSagas(){
  const el=document.getElementById('sagaList');if(!el)return;
  fillFilterSelects('sagaListStatus','sagaListGenre',null);
  const active=filtersActive('sagaListStatus','sagaListGenre',null);
  const q=(document.getElementById('sagaSearch').value||'').toLowerCase().trim();
  const completion=document.getElementById('sagaCompletion').value;
  const sort=document.getElementById('sagaSort').value;
  let names=sagaNames();
  if(active)names=names.filter(n=>sagaBooks(n).some(b=>pickerMatch(b,'sagaListStatus','sagaListGenre',null)));
  if(q)names=names.filter(n=>sagaMatch(n,q));
  let sagas=names.map(n=>{
    const bs=sagaBooks(n);
    const lus=bs.filter(b=>b.statut==='done').length;
    const pct=bs.length?Math.round(lus/bs.length*100):0;
    return{n,bs,lus,pct};
  });
  if(completion==='done')sagas=sagas.filter(s=>s.pct===100);
  else if(completion==='progress')sagas=sagas.filter(s=>s.pct<100);
  if(sort==='pctDesc')sagas.sort((a,b)=>b.pct-a.pct||a.n.localeCompare(b.n,'fr'));
  else if(sort==='pctAsc')sagas.sort((a,b)=>a.pct-b.pct||a.n.localeCompare(b.n,'fr'));
  if(!sagas.length){
    el.innerHTML=`<div class="empty"><span class="big">${icSvg('saga')}</span>${sagaNames().length?'Aucune saga ne correspond.':'Aucune saga.<br>Renseigne le champ « Saga » dans la fiche de tes livres !'}</div>`;
    return;
  }
  el.innerHTML=sagas.map(({n,bs,lus,pct})=>{
    const covers=bs.map(b=>
      `<div style="flex:none;cursor:pointer" onclick="openInfo('${b.id}')">${coverEl(b.couverture,'sm')}</div>`).join('');
    return `<div class="book" style="cursor:default">
      <div class="top"><div class="tinfo"><h3>${esc(n)}</h3>
        <div class="auth">${lus}/${bs.length} tome${bs.length>1?'s':''} lu${lus>1?'s':''}</div></div>
        <span class="badge ${lus===bs.length?'b-done':'b-reading'}">${pct} %</span></div>
      <div style="display:flex;gap:5px;margin-top:10px;overflow-x:auto">${covers}</div>
      <div class="pbar"><div style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
}

export function renderGenreFilter(){
  fillFilterSelects(null,'genreFilter','sagaFilter');
}
