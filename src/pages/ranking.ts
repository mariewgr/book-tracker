/* Classement (livres + sagas confondus). */
import {coverEl,icSvg} from '../core/icons';
import {db,save} from '../core/state';
import {esc,makeSortable} from '../core/utils';
import {openInfo} from './book-info';
import {bookMatch} from './library';
import {sagaBooks,sagaMatch,sagaNames} from './sagas';

export function rankItems(){
  return db.ranking.map(r=>{
    if(r.type==='book'){const b=db.books.find(x=>x.id===r.id);return b?{...r,b}:null;}
    if(r.type==='saga'){const bs=sagaBooks(r.id);return bs.length?{...r,bs}:null;}
    return null;
  }).filter(Boolean);
}
export function renderRank(){
  const el=document.getElementById('rankList');
  db.ranking=db.ranking.filter(r=>r.type==='book'?db.books.some(x=>x.id===r.id):(r.type==='saga'&&sagaBooks(r.id).length));
  const items=rankItems();
  if(!items.length){
    el.innerHTML=`<div class="empty"><span class="big">${icSvg('trophy')}</span>Ton classement est vide.<br>Cherche ci-dessous un livre ou une saga à classer !</div>`;
    renderRankAdd();return;
  }
  el.innerHTML=items.map((it,i)=>{
    const isBook=it.type==='book';
    const name=isBook?it.b.titre:it.id;
    const sub=isBook?(it.b.auteur||''):('saga · '+it.bs.length+' tome'+(it.bs.length>1?'s':''));
    const vis=isBook?coverEl(it.b.couverture,'sm'):coverEl(it.bs[0]&&it.bs[0].couverture,'sm','book-open');
    return `<div class="sitem" data-i="${i}"${isBook?` onclick="openInfo('${it.b.id}')" style="cursor:pointer"`:''}>
      <span class="drag" onclick="event.stopPropagation()">⠿</span>
      <b style="min-width:26px;color:var(--accent)">${i+1}.</b>${vis}
      <span class="nm">${esc(name)}${sub?` <span style="color:var(--txt2)">· ${esc(sub)}</span>`:''}</span>
      <button onclick="event.stopPropagation();rankMove(${i},-1)">↑</button>
      <button onclick="event.stopPropagation();rankMove(${i},1)">↓</button>
      <button style="color:var(--red)" onclick="event.stopPropagation();rankRemove(${i})">✕</button></div>`;
  }).join('');
  makeSortable(el,order=>{
    db.ranking=order.map(i=>db.ranking[i]).filter(Boolean);
    save();renderRank();
  });
  renderRankAdd();
}
export function rankMove(i,d){
  const j=i+d;if(j<0||j>=db.ranking.length)return;
  [db.ranking[i],db.ranking[j]]=[db.ranking[j],db.ranking[i]];
  save();renderRank();
}
export function rankRemove(i){db.ranking.splice(i,1);save();renderRank();}
export function rankAdd(type,id){
  if(db.ranking.some(r=>r.type===type&&r.id===id))return;
  db.ranking.push({type,id});save();renderRank();
}
export function renderRankAdd(){
  const q=(document.getElementById('rankSearch').value||'').toLowerCase().trim();
  const inRank=new Set(db.ranking.map(r=>r.type+'|'+r.id));
  const sagas=sagaNames().filter(n=>!inRank.has('saga|'+n)&&(!q||sagaMatch(n,q))).slice(0,6);
  const books=db.books.filter(b=>!inRank.has('book|'+b.id)&&(!q||bookMatch(b,q))).slice(0,8);
  document.getElementById('rankAddEl').innerHTML=
    sagas.map(n=>{
      const bs=sagaBooks(n);
      return `<div class="sitem">${coverEl(bs[0]&&bs[0].couverture,'sm','book-open')}
      <span class="nm">${esc(n)} <span style="color:var(--txt2)">· saga (${bs.length} tome${bs.length>1?'s':''})</span></span>
      <button style="color:var(--green)" onclick="rankAdd('saga','${esc(n).replace(/'/g,'&#39;')}')">＋</button></div>`;
    }).join('')+
    books.map(b=>`<div class="sitem">${coverEl(b.couverture,'sm')}
      <span class="nm">${esc(b.titre)}</span>
      <button style="color:var(--green)" onclick="rankAdd('book','${b.id}')">＋</button></div>`).join('')
    ||'<div class="isbnmsg">Aucun résultat.</div>';
}

