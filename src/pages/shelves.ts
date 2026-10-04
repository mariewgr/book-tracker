/* Étagères virtuelles. */
import {isUpcoming,spineColor,spineW} from '../core/book-utils';
import {t} from '../core/i18n';
import {coverEl,icSvg} from '../core/icons';
import {db,save} from '../core/state';
import {askConfirm,askText,closeModals,esc,makeSortable,toast,uid} from '../core/utils';
import {render} from '../main';
import {openInfo} from './book-info';
import {bookMatch,fillFilterSelects,pickerMatch} from './library';
import {DECO_KINDS,libItemsW} from './library-shelf-editor';
import {bookDataAttr,openBookPreview} from './profile-visitor';
import {sagaBooks,sagaNames} from './sagas';

export function standEl(b,mode){
  if(mode==='cover'){
    if(b.couverture)return `<img class="standcover" src="${esc(b.couverture)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'spinefake',style:'background:${spineColor(b.id)};width:90px',textContent:'${esc(b.titre).replace(/'/g,'’')}'}))">`;
    return `<div class="spinefake" style="background:${spineColor(b.id)};width:90px">${esc(b.titre)}</div>`;
  }
  const w=spineW(b);
  if(b.spine)return `<img class="spinebook" src="${esc(b.spine)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'spinefake',style:'background:${spineColor(b.id)};width:${w}px',textContent:'${esc(b.titre).replace(/'/g,'’')}'}))">`;
  return `<div class="spinefake" style="background:${spineColor(b.id)};width:${w}px">${esc(b.titre)}</div>`;
}
export function pileEl(b){
  if(b.spine)return `<div class="pilebook"><img src="${esc(b.spine)}" loading="lazy"></div>`;
  return `<div class="pilefake" style="background:${spineColor(b.id)}">${esc(b.titre)}</div>`;
}
export function shelfVisual(s,preview){
  const groups=[];let pile=null;
  shelfEffItems(s).forEach(it=>{
    if(it.divider){pile=null;groups.push({divider:true,w:26,row:it.row||null});return;}
    if(it.deco){pile=null;groups.push({deco:true,kind:it.kind,w:110,row:it.row||null});return;}
    const b=db.books.find(x=>x.id===it.bookId);if(!b)return;
    if(it.mode==='pile'){
      if(!pile){pile={pile:true,books:[],w:118,row:it.row||null};groups.push(pile);}
      pile.books.push(b);
    }else{pile=null;groups.push({pile:false,b,mode:it.mode,w:(it.mode==='cover'?96:spineW(b)+5),row:it.row||null});}
  });
  if(!groups.length)
    return `<div class="shelfviz"><div class="shelfinner">
      <div class="shelfrow"><div style="color:var(--txt2);font-size:.85rem;align-self:center;padding:0 10px">Étagère vide — appuie sur Modifier pour y ranger des livres.</div></div>
      <div class="board"></div></div></div>`;
  /* placement : étage imposé si précisé, sinon à la suite avec passage
     à l'étage suivant quand il n'y a plus de place */
  const nRows=Math.max(1,Math.min(8,s.rows||1));
  const holder=document.getElementById('shelfList')||document.getElementById('libShelfMode');
  const cap=Math.max(240,((holder&&holder.clientWidth)||window.innerWidth-32)-44);
  const rows=Array.from({length:nRows},()=>({w:0,els:[]}));
  groups.forEach(g=>{
    if(g.row){
      const r=rows[Math.min(nRows,Math.max(1,g.row))-1];
      r.els.push(g);r.w+=g.w;
    }
  });
  let cur=0;
  groups.forEach(g=>{
    if(g.row)return;
    while(cur<nRows-1&&rows[cur].w+g.w>cap)cur++;
    rows[cur].els.push(g);rows[cur].w+=g.w;
  });
  const click=(b,html)=>preview
    ?`<div style="cursor:pointer" data-book="${bookDataAttr(b)}" onclick="openBookPreview(JSON.parse(this.dataset.book))">${html}</div>`
    :`<div style="cursor:pointer" onclick="openInfo('${b.id}')">${html}</div>`;
  const rowsHtml=rows.map(row=>{
    const inner=row.els.map(g=>{
      if(g.divider)return `<div class="libDivider"></div>`;
      if(g.deco)return `<div class="libDecoWrap"><img class="libDeco" src="${DECO_KINDS[g.kind]}" alt=""></div>`;
      return g.pile
        ?`<div class="pilestack">${g.books.map(b=>click(b,pileEl(b))).join('')}</div>`
        :click(g.b,standEl(g.b,g.mode));
    }).join('');
    return `<div class="shelfrow">${inner}</div><div class="board"></div>`;
  }).join('');
  return `<div class="shelfviz"><div class="shelfinner">${rowsHtml}</div></div>`;
}
export function renderShelves(){
  const el=document.getElementById('shelfList');
  /* Étagère de base : la PAL (automatique, toujours à jour) */
  const tbr=db.books.filter(b=>b.statut==='tbr'&&!isUpcoming(b));
  const pal={nom:'Ma PAL',rows:1,items:tbr.map(b=>({bookId:b.id,mode:'spine'}))};
  let html=`<div class="shelfcard">
    <div class="shelfhead"><h3>${icSvg('pile')} Ma PAL (${tbr.length})</h3>
    <span style="font-size:.72rem;color:var(--txt2)">automatique</span></div>
    ${shelfVisual(pal)}</div>`;
  html+=db.shelves.map((s,i)=>`<div class="shelfcard" data-i="${i}">
    <div class="shelfhead"><div style="display:flex;align-items:center;gap:4px;min-width:0"><span class="drag">⠿</span><h3 style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(s.nom)} <span style="font-size:.68rem;color:${s.source&&s.source.length?'var(--accent)':'var(--txt2)'};font-weight:700;display:inline-flex;align-items:center;gap:2px">${s.source&&s.source.length?icSvg('lock')+' auto':icSvg('unlock')+' libre'}</span></h3></div>
    <button class="smallbtn" style="flex:none" onclick="openShelfEdit('${s.id}')">${icSvg('pencil')} Modifier</button></div>
    ${shelfVisual(s)}</div>`).join('');
  if(!db.shelves.length)
    html+=`<div class="empty">Crée tes propres étagères avec <b>+</b>, ou depuis tes sagas avec le bouton ci-dessus.</div>`;
  el.innerHTML=html;
  if(db.shelves.length>1)makeSortable(el,order=>{
    db.shelves=order.map(i=>db.shelves[i]).filter(Boolean);
    save();renderShelves();
  },'.shelfcard[data-i]');
}
/* Étagère liée (sagas et/ou parutions à venir, mise à jour automatique) */
export function upcomingBooks(){
  return db.books.filter(isUpcoming).sort((a,b)=>a.dateParution<b.dateParution?-1:1);
}
export function shelfEffItems(s){
  if(!s.source||!s.source.length)return s.items||[];
  const ids=[],seen=new Set();
  s.source.forEach(src=>{
    const list=src.type==='saga'
      ?sagaBooks(src.id).map(b=>b.id)
      :upcomingBooks().map(b=>b.id);
    list.forEach(id=>{
      if(!seen.has(id)&&db.books.some(b=>b.id===id)){seen.add(id);ids.push(id);}
    });
  });
  const ov=s.overrides||{};
  return ids.map(id=>({bookId:id,mode:(ov[id]&&ov[id].mode)||'spine',row:(ov[id]&&ov[id].row)||null}));
}
export function shelfSourceLabel(s){
  return (s.source||[]).map(x=>x.type==='saga'?x.id:'À paraître').join(' + ');
}
export let sfcSel=new Set();
export function openShelfFromCols(){
  if(!sagaNames().length&&!upcomingBooks().length){toast('Renseigne des sagas, ou ajoute une date de parution à un livre 🗂');return;}
  sfcSel=new Set();
  renderSfc();
  document.getElementById('shelfColsModal').classList.add('open');
}
export function sfcToggle(k){sfcSel.has(k)?sfcSel.delete(k):sfcSel.add(k);renderSfc();}
export function renderSfc(){
  const up=upcomingBooks();
  document.getElementById('sfcPick').innerHTML=
    (up.length?`<div class="chip ${sfcSel.has('upcoming|upcoming')?'active':''}" onclick="sfcToggle(this.dataset.k)" data-k="upcoming|upcoming">${icSvg('soon')} Livres à paraître (${up.length})</div>`:'')+
    sagaNames().map(n=>{
      const k='saga|'+n;
      return `<div class="chip ${sfcSel.has(k)?'active':''}" onclick="sfcToggle(this.dataset.k)" data-k="${esc(k)}">${esc(n)} (${sagaBooks(n).length} t.)</div>`;
    }).join('');
}
export function createShelfFromCols(){
  if(!sfcSel.size){toast('Choisis au moins une saga');return;}
  const source=[...sfcSel].map(k=>{
    const i=k.indexOf('|');
    return {type:k.slice(0,i),id:k.slice(i+1)};
  });
  const s={id:uid(),nom:shelfSourceLabel({source}),rows:1,items:[],source,overrides:{}};
  db.shelves.push(s);save();
  closeModals();render();
  openShelfEdit(s.id);
}
/* Éditeur */
export let shelfId=null,shelfItemsW=[],shelfSourcesW=[];
export function newShelf(){
  askText("Nom de l'étagère",'',nom=>{
    if(!nom)return;
    const s={id:uid(),nom,items:[]};
    db.shelves.push(s);save();renderShelves();
    openShelfEdit(s.id);
  });
}
export function openShelfEdit(id){
  const s=db.shelves.find(x=>x.id===id);if(!s)return;
  shelfId=id;
  const linked=!!(s.source&&s.source.length);
  document.getElementById('s_nom').value=s.nom;
  document.getElementById('s_rows').value=s.rows||1;
  shelfSourcesW=linked?s.source.map(x=>({...x})):[];
  shelfItemsW=shelfEffItems(s).map(x=>({...x}));
  document.getElementById('shelfSearch').value='';
  ['shelfAddStatus','shelfAddGenre','shelfAddSaga'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('shelfLinkMsg').innerHTML=linked
    ?icSvg('lock')+' Liée à des sagas — les livres se mettent à jour automatiquement (mode et étage restent réglables)':'';
  document.getElementById('shelfUnlinkBtn').classList.toggle('hidden',!linked);
  document.getElementById('shelfSourcesWrap').classList.toggle('hidden',!linked);
  document.getElementById('shelfAddWrap').classList.toggle('hidden',linked);
  if(linked)renderShelfSources();
  /* Le modal doit être ouvert (donc mis en page) AVANT renderShelfEditViz(), qui mesure
     clientWidth pour la largeur disponible — sinon la mesure vaut 0 (display:none). */
  document.getElementById('shelfModal').classList.add('open');
  renderShelfEditViz();renderShelfAdd();
}
export function shelfSourceLabel2(src){
  return src.type==='saga'?src.id+' ('+sagaBooks(src.id).length+' t.)':'🔜 Livres à paraître ('+upcomingBooks().length+')';
}
export function shelfSourcesEffItems(sources){
  const ids=[],seen=new Set();
  sources.forEach(src=>{
    const list=src.type==='saga'?sagaBooks(src.id).map(b=>b.id):upcomingBooks().map(b=>b.id);
    list.forEach(id=>{if(!seen.has(id)&&db.books.some(b=>b.id===id)){seen.add(id);ids.push(id);}});
  });
  return ids;
}
export function refreshLinkedShelfItems(){
  const ids=shelfSourcesEffItems(shelfSourcesW);
  const prev={};shelfItemsW.forEach(it=>{prev[it.bookId]={mode:it.mode,row:it.row};});
  shelfItemsW=ids.map(id=>({bookId:id,mode:(prev[id]&&prev[id].mode)||'spine',row:(prev[id]&&prev[id].row)||null}));
  renderShelfEditViz();
}
export function renderShelfSources(){
  const wrap=document.getElementById('shelfSourcesEl');
  wrap.innerHTML=shelfSourcesW.map((src,i)=>
    `<div class="sitem" data-i="${i}"><span class="drag">⠿</span>
      <span class="nm">${esc(shelfSourceLabel2(src))}</span>
      <button style="color:var(--red)" onclick="shelfSourceRemove(${i})">✕</button></div>`
  ).join('')||'<div class="isbnmsg">Aucune saga liée.</div>';
  makeSortable(wrap,order=>{
    shelfSourcesW=order.map(i=>shelfSourcesW[i]).filter(Boolean);
    renderShelfSources();refreshLinkedShelfItems();
  });
  renderShelfSourceAdd();
}
export function renderShelfSourceAdd(){
  const wrap=document.getElementById('shelfSourceAddEl');
  const usedKeys=new Set(shelfSourcesW.map(s=>s.type+'|'+s.id));
  const up=upcomingBooks();
  const options=[];
  if(up.length&&!usedKeys.has('upcoming|upcoming'))options.push({k:'upcoming|upcoming',label:'🔜 Livres à paraître ('+up.length+')'});
  sagaNames().forEach(n=>{
    const k='saga|'+n;
    if(!usedKeys.has(k))options.push({k,label:n+' ('+sagaBooks(n).length+' t.)'});
  });
  wrap.innerHTML=options.length?options.map(o=>
    `<div class="chip" onclick="shelfSourceAdd(this.dataset.k)" data-k="${esc(o.k)}">${esc(o.label)}</div>`
  ).join(''):'<div class="isbnmsg">Toutes les sagas disponibles sont déjà liées.</div>';
}
export function shelfSourceAdd(k){
  const i=k.indexOf('|');
  shelfSourcesW.push({type:k.slice(0,i),id:k.slice(i+1)});
  renderShelfSources();refreshLinkedShelfItems();
}
export function shelfSourceRemove(i){
  if(shelfSourcesW.length<=1){toast('Il faut garder au moins une saga liée — utilise « Délier » pour détacher complètement.');return;}
  shelfSourcesW.splice(i,1);
  renderShelfSources();refreshLinkedShelfItems();
}
/* Éditeur visuel : mêmes rendus (tranche/couverture/pile) que l'étagère affichée, mais chaque
   livre est tapable (change de mode) et glissable (change de position / étage) au lieu d'ouvrir
   sa fiche. Regroupe les items 'pile' consécutifs en pile, comme shelfVisual(). */
export function shelfEditGroups(){
  const groups=[];let pile=null;
  shelfItemsW.forEach((it,i)=>{
    const b=db.books.find(x=>x.id===it.bookId);if(!b)return;
    if(it.mode==='pile'){
      if(!pile){pile={pile:true,entries:[],w:118,row:it.row||null};groups.push(pile);}
      pile.entries.push({b,i});
    }else{
      pile=null;
      groups.push({pile:false,b,i,mode:it.mode,w:(it.mode==='cover'?96:spineW(b)+5),row:it.row||null});
    }
  });
  return groups;
}
export function layoutShelfRows(groups,nRows,cap){
  const rows=Array.from({length:nRows},()=>({w:0,els:[]}));
  groups.forEach(g=>{
    if(g.row){const r=rows[Math.min(nRows,Math.max(1,g.row))-1];r.els.push(g);r.w+=g.w;}
  });
  let cur=0;
  groups.forEach(g=>{
    if(g.row)return;
    while(cur<nRows-1&&rows[cur].w+g.w>cap)cur++;
    rows[cur].els.push(g);rows[cur].w+=g.w;
  });
  return rows;
}
export function renderShelfEditViz(dragBookId){
  const wrap=document.getElementById('shelfEditViz');
  if(!wrap)return;
  const s=db.shelves.find(x=>x.id===shelfId);
  const linked=!!(s&&s.source&&s.source.length);
  const groups=shelfEditGroups();
  if(!groups.length){
    wrap.innerHTML='<div class="shelfviz"><div class="shelfinner"><div class="shelfrow"><div style="color:var(--txt2);font-size:.85rem;align-self:center;padding:0 10px">Aucun livre pour l\'instant — ajoute-en un ci-dessous.</div></div><div class="board"></div></div></div>';
    return;
  }
  const nRows=Math.max(1,Math.min(8,+document.getElementById('s_rows').value||1));
  const cap=Math.max(240,(wrap.clientWidth||window.innerWidth-32)-44);
  const rows=layoutShelfRows(groups,nRows,cap);
  const delBadge=i=>linked?'':`<button class="slotDel" onclick="event.stopPropagation();shelfRemove(${i})">✕</button>`;
  /* Pendant un glisser, le livre déplacé s'affiche comme un espace vide à sa position
     actuelle (le livre lui-même suit le doigt via le "ghost" flottant) — pour voir en direct
     où il atterrirait et le trou qu'il laisse, sans attendre de lâcher. */
  const slot=(i,html,w,h)=>{
    if(dragBookId&&shelfItemsW[i]&&shelfItemsW[i].bookId===dragBookId){
      const dim=(w?`width:${w}px;`:'')+(h?`height:${h}px;`:'');
      return `<div class="shelfSlot shelfPlaceholder" data-i="${i}" style="${dim}"></div>`;
    }
    return `<div class="shelfSlot" data-i="${i}" onclick="shelfSlotTap(${i})">${html}${delBadge(i)}</div>`;
  };
  const rowsHtml=rows.map((row,rIdx)=>{
    const inner=row.els.map(g=>g.pile
      ?`<div class="pilestack">${g.entries.map(e=>slot(e.i,pileEl(e.b),112,24)).join('')}</div>`
      :slot(g.i,standEl(g.b,g.mode),g.w,138)).join('');
    return `<div class="shelfrow" data-row="${rIdx+1}">${inner}</div><div class="board"></div>`;
  }).join('');
  wrap.innerHTML=`<div class="shelfviz"><div class="shelfinner">${rowsHtml}</div></div>`;
}
export function shelfSlotTap(i){
  const modes=['spine','cover','pile'];
  shelfItemsW[i].mode=modes[(modes.indexOf(shelfItemsW[i].mode)+1)%3];
  renderShelfEditViz();
}
export function shelfRemove(i){shelfItemsW.splice(i,1);renderShelfEditViz();renderShelfAdd();}
/* Glisser un livre : shelfItemsW est réordonné EN DIRECT pendant le glisser (pas seulement au
   lâcher), avec un espace vide à la position actuelle du livre déplacé — le livre lui-même
   continue de suivre le doigt via le "ghost" flottant. Lâché hors de la zone d'étagère →
   annulé, on restaure l'ordre d'avant le glisser (pas de suppression accidentelle, on garde ça
   pour le bouton ✕ explicite). Un simple tap (peu de mouvement) reste géré par le onclick du slot. */
(function(){
  let dragging=null,movedFar=false,ghostEl=null,origSnapshot=null,lastKey=null;
  const THRESH=8;
  function wrap(){return document.getElementById('shelfEditViz');}
  function startGhost(slot,clientX,clientY){
    const r=slot.getBoundingClientRect();
    ghostEl=slot.cloneNode(true);
    const del=ghostEl.querySelector('.slotDel');if(del)del.remove();
    ghostEl.classList.add('shelfGhost');
    ghostEl.style.width=r.width+'px';ghostEl.style.height=r.height+'px';
    ghostEl.dataset.offX=clientX-r.left;ghostEl.dataset.offY=clientY-r.top;
    ghostEl.style.left=r.left+'px';ghostEl.style.top=r.top+'px';
    document.body.appendChild(ghostEl);
  }
  function moveGhost(clientX,clientY){
    if(!ghostEl)return;
    ghostEl.style.left=(clientX-ghostEl.dataset.offX)+'px';
    ghostEl.style.top=(clientY-ghostEl.dataset.offY)+'px';
  }
  function removeGhost(){if(ghostEl){ghostEl.remove();ghostEl=null;}}
  document.addEventListener('pointerdown',e=>{
    const w=wrap();if(!w||!w.contains(e.target))return;
    const slot=e.target.closest('.shelfSlot');
    if(!slot||e.target.closest('.slotDel'))return;
    const i=+slot.dataset.i;
    dragging={bookId:shelfItemsW[i].bookId,startX:e.clientX,startY:e.clientY,el:slot,dropRow:null};
    movedFar=false;
  });
  document.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const dx=e.clientX-dragging.startX,dy=e.clientY-dragging.startY;
    if(!movedFar){
      if(Math.hypot(dx,dy)<THRESH)return;
      movedFar=true;
      origSnapshot=shelfItemsW.map(it=>({...it}));
      startGhost(dragging.el,e.clientX,e.clientY);
      renderShelfEditViz(dragging.bookId);
    }
    e.preventDefault();
    moveGhost(e.clientX,e.clientY);
    const overEl=document.elementFromPoint(e.clientX,e.clientY);
    const overSlot=overEl&&overEl.closest('.shelfSlot');
    if(overSlot){
      const r=overSlot.getBoundingClientRect();
      const before=e.clientX<r.left+r.width/2;
      const rowEl=overSlot.closest('.shelfrow');
      dragging.dropRow=rowEl?+rowEl.dataset.row:null;
      const targetIdx=+overSlot.dataset.i;
      const key=targetIdx+':'+(before?'b':'a');
      if(key!==lastKey){
        lastKey=key;
        const curIdx=shelfItemsW.findIndex(it=>it.bookId===dragging.bookId);
        if(curIdx!==-1&&curIdx!==targetIdx){
          const item=shelfItemsW[curIdx];
          shelfItemsW.splice(curIdx,1);
          let insertAt=targetIdx;
          if(targetIdx>curIdx)insertAt--;
          insertAt=before?insertAt:insertAt+1;
          shelfItemsW.splice(insertAt,0,item);
          renderShelfEditViz(dragging.bookId);
        }
      }
    }else{
      const rowEl=overEl&&overEl.closest&&overEl.closest('.shelfrow');
      dragging.dropRow=rowEl?+rowEl.dataset.row:null;
      lastKey=null;
    }
  });
  function finish(e){
    if(!dragging)return;
    removeGhost();
    if(movedFar){
      const w=wrap();
      const r=w&&w.getBoundingClientRect();
      const inside=r&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
      if(inside)finalizeShelfDrag(dragging.bookId,dragging.dropRow);
      else{shelfItemsW=origSnapshot;renderShelfEditViz();} /* lâché hors zone : annule, on restaure l'ordre d'avant */
    }
    dragging=null;movedFar=false;origSnapshot=null;lastKey=null;
  }
  document.addEventListener('pointerup',finish);
  document.addEventListener('pointercancel',finish);
})();
export function finalizeShelfDrag(bookId,dropRow){
  const item=shelfItemsW.find(it=>it.bookId===bookId);
  const targetRow=dropRow||null;
  if(item)item.row=targetRow;
  /* Un livre à étage fixé se place toujours avant les livres à "Auto" dans sa rangée (voir
     layoutShelfRows) : sans ça, déposer un livre "après" un autre dans une rangée encore en
     mode auto le ferait sauter en tête de rangée au lieu de rester où on l'a lâché. On fixe
     donc explicitement l'étage de TOUS les livres de la rangée cible, d'après l'agencement
     actuel — l'ordre visuel affiché pendant le glisser devient alors permanent. */
  if(targetRow){
    const wrap=document.getElementById('shelfEditViz');
    const nRows=Math.max(1,Math.min(8,+document.getElementById('s_rows').value||1));
    const cap=Math.max(240,((wrap&&wrap.clientWidth)||window.innerWidth-32)-44);
    const rows=layoutShelfRows(shelfEditGroups(),nRows,cap);
    const rowOfIndex=new Map();
    rows.forEach((row,rIdx)=>row.els.forEach(g=>{
      if(g.pile)g.entries.forEach(e=>rowOfIndex.set(e.i,rIdx+1));
      else rowOfIndex.set(g.i,rIdx+1);
    }));
    shelfItemsW.forEach((it,i)=>{if(rowOfIndex.has(i))it.row=rowOfIndex.get(i);});
  }
  renderShelfEditViz();
}
export function renderShelfAdd(){
  fillFilterSelects('shelfAddStatus','shelfAddGenre','shelfAddSaga');
  const q=document.getElementById('shelfSearch').value.toLowerCase().trim();
  const used=new Set(shelfItemsW.map(x=>x.bookId));
  const list=db.books.filter(b=>!used.has(b.id)&&(!q||bookMatch(b,q))&&pickerMatch(b,'shelfAddStatus','shelfAddGenre','shelfAddSaga')).slice(0,12);
  document.getElementById('shelfAddEl').innerHTML=list.map(b=>
    `<div class="sitem">${coverEl(b.couverture,'sm')}<span class="nm">${esc(b.titre)}</span>
     <button style="color:var(--green)" onclick="shelfAddBook('${b.id}')">＋ Ajouter</button></div>`).join('')
    ||'<div class="isbnmsg">Aucun résultat.</div>';
}
export function shelfAddBook(id){shelfItemsW.push({bookId:id,mode:'spine'});renderShelfEditViz();renderShelfAdd();}
export function saveShelf(){
  const s=db.shelves.find(x=>x.id===shelfId);if(!s)return;
  const nom=document.getElementById('s_nom').value.trim();
  if(nom)s.nom=nom;
  s.rows=Math.max(1,Math.min(8,+document.getElementById('s_rows').value||1));
  if(s.source&&s.source.length){
    s.source=shelfSourcesW;
    s.overrides={};
    shelfItemsW.forEach(it=>{
      if(it.mode!=='spine'||it.row)s.overrides[it.bookId]={mode:it.mode,row:it.row||null};
    });
  }else{
    s.items=shelfItemsW;
  }
  save();closeModals();render();
}
export function shelfUnlink(){
  const s=db.shelves.find(x=>x.id===shelfId);if(!s)return;
  s.items=shelfEffItems(s);
  delete s.source;delete s.overrides;
  save();
  toast('Étagère déliée — la liste est figée et modifiable librement');
  openShelfEdit(s.id);
}
export function deleteShelf(){
  const s=db.shelves.find(x=>x.id===shelfId);if(!s)return;
  askConfirm('Supprimer l\'étagère « '+s.nom+' » ? Les livres ne seront pas supprimés.',()=>{
    db.shelves=db.shelves.filter(x=>x.id!==shelfId);
    save();closeModals();render();
  },'Supprimer');
}

/* ---------- Édition de la Bibliothèque (Bibli → vue Bibliothèque) ----------
   Même principe visuel que l'éditeur d'étagère (glisser pour repositionner/changer d'étage,
   taper pour changer tranche/couverture/pile), mais sur libItemsW au lieu de shelfItemsW : pas
   d'ajout/retrait de livre (la bibliothèque contient toujours tous les livres), et on peut en
   plus insérer des séparations en bois (repérées par un id propre, pas par bookId). */
