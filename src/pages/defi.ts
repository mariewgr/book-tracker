/* Défi de la pile. */
import {thickness} from '../core/book-utils';
import {icSvg} from '../core/icons';
import {db,save} from '../core/state';
import {closeModals,esc} from '../core/utils';
import {render} from '../main';

export const MILESTONES=[
  [icSvg('cat'),'Chat',25],[icSvg('dog'),'Beagle',40],[icSvg('panda'),'Panda assis',90],
  [icSvg('human'),'Ta taille !',null],[icSvg('flamingo'),'Autruche',250],[icSvg('giraffe'),'Girafe',500],
];
export function toggleDefiScope(){
  db.settings.defiScope=(db.settings.defiScope==='year')?'all':'year';
  save();render();
}
export const PILE_AVATARS=['avatar-explorer.png','avatar-explorer-female.png','avatar-scholar.png','avatar-scholar-female.png','avatar-warrior.png','avatar-warrior-female.png'];
export function openPileAvatarPicker(){
  document.getElementById('pileAvatarGrid').innerHTML=PILE_AVATARS.map(a=>
    `<img src="${a}" onclick="choosePileAvatar('${a}')" style="width:80px;cursor:pointer;border-radius:8px;border:2px solid ${(db.settings.pileAvatar||'human.png')===a?'var(--accent)':'transparent'}">`
  ).join('');
  document.getElementById('pileAvatarModal').classList.add('open');
}
export function choosePileAvatar(path){
  db.settings.pileAvatar=path;
  save();closeModals();render();
}
export function defiCardHTML(){
  const taille=db.settings.taille||165;
  const scope=db.settings.defiScope||'all';
  const y=new Date().getFullYear();
  const allDone=db.books.filter(b=>b.statut==='done');
  const done=scope==='year'?allDone.filter(b=>b.dateFin&&b.dateFin.startsWith(String(y))):allDone;
  const h=+done.reduce((s,b)=>s+thickness(b),0).toFixed(1);
  const scale=180/taille;
  const SPINE_COLORS=['#a5433c','#2e5d8a','#3e6b4f','#c99a3c','#7a3b5e','#37747c','#8a5a3b','#5a4a7a','#94323f','#4a6d3b'];
  const stack=done.slice(-40).map(b=>{
    const hash=[...(b.id||'x')].reduce((s,c)=>s+c.charCodeAt(0),0);
    const col=SPINE_COLORS[hash%SPINE_COLORS.length];
    const dx=(hash%15)-7;
    const rot=(((hash>>3)%5)-2)*0.5;
    return `<div class="sbook r" style="height:${Math.max(4,thickness(b)*scale)}px;--c:${col};transform:translateX(${dx}px) rotate(${rot}deg)" title="${esc(b.titre)}"></div>`;
  }).join('')||`<div style="color:var(--txt2);font-size:.8rem">${icSvg('empty')} Pas encore de pile</div>`;
  const fallback="this.replaceWith(Object.assign(document.createElement('div'),{innerHTML:'<svg viewBox=\\'0 0 60 180\\' style=\\'height:176px\\'><g fill=\\'#8b5cf6\\'><circle cx=\\'30\\' cy=\\'11\\' r=\\'9\\'/><path d=\\'M30 21c-10 0-14 9-15 21l-5 35c7 5 33 5 40 0l-5-35c-1-12-5-21-15-21z\\'/><rect x=\\'21\\' y=\\'75\\' width=\\'7.5\\' height=\\'99\\' rx=\\'3.5\\'/><rect x=\\'31.5\\' y=\\'75\\' width=\\'7.5\\' height=\\'99\\' rx=\\'3.5\\'/></g></svg>'}))";
  return `<div class="challenge-card" onclick="toggleDefiScope()" style="cursor:pointer">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div style="font-size:.8rem;color:var(--txt2);font-weight:700;text-transform:uppercase;letter-spacing:.6px">Défi de la pile</div>
      <div class="chip" style="pointer-events:none;margin:0">${scope==='year'?icSvg('calendar')+' '+y:icSvg('pile')+' Tous les livres'}</div>
    </div>
    <div class="bignum">${h} cm</div>
    <div style="font-size:1rem;font-weight:800;color:var(--accent)">${Math.round(h/taille*100)} % de ta taille</div>
    <div style="font-size:.85rem;color:var(--txt2);margin-top:2px">Objectif : ta taille (${taille} cm) — ${done.length} livre${done.length>1?'s':''} terminé${done.length>1?'s':''}${scope==='year'?' en '+y:''}</div>
    <div class="stackwrap">
      <div class="stack">${stack}</div>
      <div class="human" style="cursor:pointer" onclick="event.stopPropagation();openPileAvatarPicker()">
        <img src="${db.settings.pileAvatar||'human.png'}" style="height:176px;display:block" alt="" onerror="${fallback}">
        <small>${taille} cm</small>
      </div>
    </div>
    <div class="pbar" style="height:10px"><div style="width:${Math.min(100,h/taille*100)}%"></div></div>
    <div style="font-size:.78rem;color:var(--txt2);margin-top:8px">Chaque livre terminé${scope==='year'?' en '+y:''} ajoute son épaisseur à ta pile. <b>Appuie sur la carte</b> pour basculer tous les livres / cette année, <b>ou sur ton avatar</b> pour en changer.</div>
  </div>`;
}
export function renderDefi(){
  const taille=db.settings.taille||165;
  document.getElementById('defiCard').innerHTML=defiCardHTML();
  const scope=db.settings.defiScope||'all';
  const y=new Date().getFullYear();
  const allDone=db.books.filter(b=>b.statut==='done');
  const done=scope==='year'?allDone.filter(b=>b.dateFin&&b.dateFin.startsWith(String(y))):allDone;
  const h=+done.reduce((s,b)=>s+thickness(b),0).toFixed(1);
  const ms=MILESTONES.map(([e,n,v])=>[e,n,v===null?taille:v]).sort((a,b)=>a[2]-b[2]);
  document.getElementById('milestones').innerHTML=ms.map(([e,n,v])=>{
    const ok=h>=v;
    return `<div class="mile ${ok?'reached':''}"><span class="emo">${e}</span>
      <span class="name">${n}</span><span class="h">${v} cm</span>${ok?'<span class="check">✓</span>':''}</div>`;
  }).join('');
}

/* ---------- Stats ---------- */
/* Carte stat "cyclable" : un titre fixe et clair + une variante (période) qui change au clic, pour regrouper
   plusieurs déclinaisons de la même statistique (jour/mois/année, cette année/toujours...) sans dupliquer les cartes */
