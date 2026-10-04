/* Édition de la vue « grande bibliothèque » (glisser-déposer, séparations, décorations). */
import {spineW} from '../core/book-utils';
import {db,save} from '../core/state';
import {closeModals,esc,uid} from '../core/utils';
import {render} from '../main';
import {libEffItems} from './library';
import {layoutShelfRows,pileEl,standEl} from './shelves';

export let libItemsW=[];
export function openLibEdit(){
  libItemsW=libEffItems().map(x=>({...x}));
  document.getElementById('lib_rows').value=(db.settings.libLayout&&db.settings.libLayout.rows)||8;
  document.getElementById('libDecoPicker').innerHTML=Object.keys(DECO_KINDS).map(k=>
    `<button type="button" class="smallbtn" title="${esc(DECO_LABELS[k])}" onclick="addLibDeco('${k}')" style="padding:4px 8px">
      <img src="${DECO_KINDS[k]}" alt="" style="height:28px;width:auto;display:block;vertical-align:middle">
    </button>`
  ).join('');
  document.getElementById('libEditModal').classList.add('open');
  renderLibEditViz();
}
export const DECO_KINDS={plant:'plant.png',globe:'globe.png',candle:'candle.png',flowervase:'flowervase.png',
  owl:'owl.png',chest:'chest.png',compass:'compass.png',clock:'clock.png',crystalball:'crystalball.png'};
export const DECO_LABELS={plant:'Plante',globe:'Globe',candle:'Bougie',flowervase:'Vase de fleurs',
  owl:'Hibou',chest:'Coffre',compass:'Boussole',clock:'Horloge',crystalball:'Boule de cristal'};
export function libItemKey(it){return it.divider||it.deco?(it.divider?'d:':'c:')+it.id:'b:'+it.bookId;}
export function libEditGroups(){
  const groups=[];let pile=null;
  libItemsW.forEach((it,i)=>{
    if(it.divider){pile=null;groups.push({divider:true,i,w:26,row:it.row||null});return;}
    if(it.deco){pile=null;groups.push({deco:true,kind:it.kind,i,w:110,row:it.row||null});return;}
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
export function renderLibEditViz(dragKey){
  const wrap=document.getElementById('libEditViz');
  if(!wrap)return;
  const groups=libEditGroups();
  if(!groups.length){
    wrap.innerHTML='<div class="shelfviz"><div class="shelfinner"><div class="shelfrow"><div style="color:var(--txt2);font-size:.85rem;align-self:center;padding:0 10px">Aucun livre.</div></div><div class="board"></div></div></div>';
    return;
  }
  const nRows=Math.max(1,Math.min(8,+document.getElementById('lib_rows').value||1));
  const cap=Math.max(240,(wrap.clientWidth||window.innerWidth-32)-44);
  const rows=layoutShelfRows(groups,nRows,cap);
  const slot=(i,html,w,h,removable)=>{
    if(dragKey&&libItemsW[i]&&libItemKey(libItemsW[i])===dragKey){
      const dim=(w?`width:${w}px;`:'')+(h?`height:${h}px;`:'');
      return `<div class="shelfSlot shelfPlaceholder" data-li="${i}" style="${dim}"></div>`;
    }
    const del=removable?`<button class="slotDel" onclick="event.stopPropagation();libRemoveAt(${i})">✕</button>`:'';
    return `<div class="shelfSlot" data-li="${i}" onclick="libSlotTap(${i})">${html}${del}</div>`;
  };
  const rowsHtml=rows.map((row,rIdx)=>{
    const inner=row.els.map(g=>{
      if(g.divider)return slot(g.i,'<div class="libDivider"></div>',26,138,true);
      if(g.deco)return slot(g.i,`<div class="libDecoWrap"><img class="libDeco" src="${DECO_KINDS[g.kind]}" alt=""></div>`,110,138,true);
      return g.pile
        ?`<div class="pilestack">${g.entries.map(e=>slot(e.i,pileEl(e.b),112,24,false)).join('')}</div>`
        :slot(g.i,standEl(g.b,g.mode),g.w,138,false);
    }).join('');
    return `<div class="shelfrow" data-row="${rIdx+1}">${inner}</div><div class="board"></div>`;
  }).join('');
  wrap.innerHTML=`<div class="shelfviz"><div class="shelfinner">${rowsHtml}</div></div>`;
}
export function libSlotTap(i){
  if(libItemsW[i].divider||libItemsW[i].deco)return;
  const modes=['spine','cover','pile'];
  libItemsW[i].mode=modes[(modes.indexOf(libItemsW[i].mode)+1)%3];
  renderLibEditViz();
}
export function libRemoveAt(i){libItemsW.splice(i,1);renderLibEditViz();}
/* Étage 1 = étage du haut (voir layoutShelfRows) : sans le fixer, un élément ajouté en fin de
   liste hérite du curseur de remplissage automatique à ce stade (déjà avancé par tous les
   livres précédents) et atterrit en bas au lieu d'en haut. */
export function addLibDivider(){libItemsW.push({divider:true,id:uid(),row:1});renderLibEditViz();}
export function addLibDeco(kind){libItemsW.push({deco:true,kind,id:uid(),row:1});renderLibEditViz();}
(function(){
  let dragging=null,movedFar=false,ghostEl=null,origSnapshot=null,lastKey=null;
  const THRESH=8;
  function wrap(){return document.getElementById('libEditViz');}
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
    const i=+slot.dataset.li;
    dragging={key:libItemKey(libItemsW[i]),startX:e.clientX,startY:e.clientY,el:slot,dropRow:null};
    movedFar=false;
  });
  document.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const dx=e.clientX-dragging.startX,dy=e.clientY-dragging.startY;
    if(!movedFar){
      if(Math.hypot(dx,dy)<THRESH)return;
      movedFar=true;
      origSnapshot=libItemsW.map(it=>({...it}));
      startGhost(dragging.el,e.clientX,e.clientY);
      renderLibEditViz(dragging.key);
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
      const targetIdx=+overSlot.dataset.li;
      const key=targetIdx+':'+(before?'b':'a');
      if(key!==lastKey){
        lastKey=key;
        const curIdx=libItemsW.findIndex(it=>libItemKey(it)===dragging.key);
        if(curIdx!==-1&&curIdx!==targetIdx){
          const item=libItemsW[curIdx];
          libItemsW.splice(curIdx,1);
          let insertAt=targetIdx;
          if(targetIdx>curIdx)insertAt--;
          insertAt=before?insertAt:insertAt+1;
          libItemsW.splice(insertAt,0,item);
          renderLibEditViz(dragging.key);
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
      if(inside)finalizeLibDrag(dragging.key,dragging.dropRow);
      else{libItemsW=origSnapshot;renderLibEditViz();}
    }
    dragging=null;movedFar=false;origSnapshot=null;lastKey=null;
  }
  document.addEventListener('pointerup',finish);
  document.addEventListener('pointercancel',finish);
})();
export function finalizeLibDrag(key,dropRow){
  const item=libItemsW.find(it=>libItemKey(it)===key);
  const targetRow=dropRow||null;
  if(item)item.row=targetRow;
  if(targetRow){
    const wrap=document.getElementById('libEditViz');
    const nRows=Math.max(1,Math.min(8,+document.getElementById('lib_rows').value||1));
    const cap=Math.max(240,((wrap&&wrap.clientWidth)||window.innerWidth-32)-44);
    const rows=layoutShelfRows(libEditGroups(),nRows,cap);
    const rowOfIndex=new Map();
    rows.forEach((row,rIdx)=>row.els.forEach(g=>{
      if(g.pile)g.entries.forEach(e=>rowOfIndex.set(e.i,rIdx+1));
      else rowOfIndex.set(g.i,rIdx+1);
    }));
    libItemsW.forEach((it,i)=>{if(rowOfIndex.has(i))it.row=rowOfIndex.get(i);});
  }
  renderLibEditViz();
}
export function saveLibLayout(){
  db.settings.libLayout={rows:Math.max(1,Math.min(8,+document.getElementById('lib_rows').value||1)),items:libItemsW};
  save();closeModals();render();
}

