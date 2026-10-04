/* Journal (calendrier). */
import {coverEl,icSvg} from '../core/icons';
import {db,save} from '../core/state';
import {askConfirm,esc} from '../core/utils';
import {openInfo} from './book-info';

export const MOIS_FULL=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
export let calRef=new Date(),calSel=null;
export function calMove(d){calRef=new Date(calRef.getFullYear(),calRef.getMonth()+d,1);calSel=null;renderCal();}
export function selectCalDay(iso){calSel=iso;renderCal();}
export function renderCal(){
  const y=calRef.getFullYear(),m=calRef.getMonth();
  document.getElementById('calTitle').textContent=MOIS_FULL[m]+' '+y;
  const off=(new Date(y,m,1).getDay()+6)%7;
  const nb=new Date(y,m+1,0).getDate();
  const today=new Date().toISOString().slice(0,10);
  const pagesBy={},finBy={};
  db.sessions.forEach(s=>{pagesBy[s.date]=(pagesBy[s.date]||0)+s.pages;});
  db.books.forEach(b=>{if(b.statut==='done'&&b.dateFin)(finBy[b.dateFin]=finBy[b.dateFin]||[]).push(b);});
  let html='<div class="calgrid">'+['L','M','M','J','V','S','D'].map(d=>`<div class="calwd">${d}</div>`).join('');
  for(let i=0;i<off;i++)html+='<div></div>';
  for(let d=1;d<=nb;d++){
    const iso=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const pg=pagesBy[iso],fin=finBy[iso];
    const cover=fin&&fin[0]&&fin[0].couverture;
    html+=`<div class="calday ${iso===today?'today':''} ${calSel===iso?'sel':''} ${cover?'hascover':''}"
      ${cover?`style="background-image:url('${esc(cover)}')"`:''}
      onclick="selectCalDay('${iso}')">
      <div class="dnum">${d}</div>
      ${fin&&!cover?`<div class="fin">${icSvg('book')}</div>`:''}
      ${fin&&fin.length>1?`<div class="calmore">+${fin.length-1}</div>`:''}
      ${pg?`<div class="pg">${pg} p.</div>`:'<div></div>'}
    </div>`;
  }
  document.getElementById('calGrid').innerHTML=html+'</div>';
  const det=document.getElementById('dayDetail');
  if(!calSel){det.innerHTML='<div class="empty" style="padding:24px 10px">Touche un jour pour voir le détail.<br>couverture = livre terminé ce jour-là · p. = pages lues</div>';return;}
  const fin=finBy[calSel]||[],ses=db.sessions.filter(s=>s.date===calSel);
  const dstr=new Date(calSel+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  let out=`<h2>${dstr}</h2>`;
  if(!fin.length&&!ses.length)out+=`<div class="empty" style="padding:14px">${icSvg('empty')} Rien noté ce jour-là</div>`;
  fin.forEach(b=>out+=`<div class="mile" style="cursor:pointer" onclick="openInfo('${b.id}')">${coverEl(b.couverture,'sm')}<span class="name">Terminé : ${esc(b.titre)}</span>${b.note?`<span class="h stars">${'★'.repeat(b.note)}</span>`:''}</div>`);
  ses.forEach(s=>{
    const bk=db.books.find(b=>b.id===s.bookId);
    out+=`<div class="swipeRow">
      <div class="swipeAction" onclick="deleteSession('${s.id}')">Supprimer</div>
      <div class="swipeContent mile">
        <div style="display:flex;align-items:center;gap:12px;min-width:0${bk?';cursor:pointer':''}"${bk?` onclick="openInfo('${bk.id}')"`:''}>${coverEl(bk&&bk.couverture,'sm','book-open')}<span class="name">${esc(s.titre)}</span></div>
        <span class="h">+${s.pages} p.</span>
      </div>
    </div>`;
  });
  det.innerHTML=out;
}
export function deleteSession(id){
  askConfirm('Supprimer cette entrée du journal ? Les pages lues ce jour-là seront retirées.',()=>{
    db.sessions=db.sessions.filter(s=>s.id!==id);
    save();renderCal();
  });
}
/* Glisser une ligne du journal vers la gauche révèle le bouton "Supprimer" derrière —
   délégation sur #dayDetail puisque les lignes sont reconstruites à chaque renderCal(). */
(function(){
  const MAXR=90,THRESH=70;
  let active=null,startX=0,startY=0,curX=0,dragging=false,axis=null;
  function closeOthers(except){
    document.querySelectorAll('#dayDetail .swipeRow.open').forEach(r=>{
      if(r!==except){r.classList.remove('open');r.querySelector('.swipeContent').style.transform='';}
    });
  }
  function onDown(e){
    const row=e.target.closest('.swipeRow');
    if(!row)return;
    closeOthers(row);
    active=row;startX=e.clientX;startY=e.clientY;curX=row.classList.contains('open')?-MAXR:0;
    dragging=false;axis=null;
  }
  function onMove(e){
    if(!active)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    if(axis===null){
      if(Math.abs(dx)<6&&Math.abs(dy)<6)return;
      axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
      if(axis==='y'){active=null;return;} /* laisse le scroll vertical normal */
    }
    if(axis!=='x')return;
    dragging=true;
    e.preventDefault();
    const base=active.classList.contains('open')?-MAXR:0;
    curX=Math.max(-MAXR,Math.min(0,base+dx));
    active.querySelector('.swipeContent').style.transform='translateX('+curX+'px)';
  }
  function onUp(){
    if(!active)return;
    if(dragging){
      const openNow=curX<-THRESH;
      active.classList.toggle('open',openNow);
      active.querySelector('.swipeContent').style.transform=openNow?'translateX(-'+MAXR+'px)':'';
    }
    active=null;dragging=false;axis=null;
  }
  const el=document.getElementById('dayDetail');
  el.addEventListener('pointerdown',onDown);
  el.addEventListener('pointermove',onMove,{passive:false});
  el.addEventListener('pointerup',onUp);
  el.addEventListener('pointercancel',onUp);
})();

/* ---------- Réglages / sauvegarde ---------- */
/* Récupère les résumés éditeur manquants pour toute la bibliothèque */
