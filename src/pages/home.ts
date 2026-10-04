/* Page Accueil. */
import {fmt,fmtDateFr,isUpcoming} from '../core/book-utils';
import {coverEl,icSvg} from '../core/icons';
import {switchTab} from '../core/navigation';
import {db,save} from '../core/state';
import {askText,esc} from '../core/utils';
import {render} from '../main';
import {openInfo} from './book-info';
import {defiCardHTML} from './defi';
import {setLibFilter} from './library';
import {openQuick} from './quick-update';

export function editObjectif(){
  const year=new Date().getFullYear();
  askText('Objectif de lecture '+year+' (nombre de livres)',db.settings.objectif||'',v=>{
    db.settings.objectif=Math.max(0,+v||0);
    save();render();
  });
}
export function calcStreak(){
  const ds=new Set(db.sessions.map(s=>s.date));
  const iso=x=>x.toISOString().slice(0,10);
  let n=0;const d=new Date();
  if(!ds.has(iso(d)))d.setDate(d.getDate()-1);
  while(ds.has(iso(d))){n++;d.setDate(d.getDate()-1);}
  return n;
}
export const PAL_HOME_MAX=12;
export function goPal(){setLibFilter('tbr');db.settings.libView='list';save();switchTab('lib');}
export function renderHome(){
  const el=document.getElementById('homeWrap');if(!el)return;
  const reading=db.books.filter(b=>b.statut==='reading').sort((a,b)=>(b.dateAjout||0)-(a.dateAjout||0));
  const year=String(new Date().getFullYear());
  const doneY=db.books.filter(b=>b.statut==='done'&&b.dateFin&&b.dateFin.startsWith(year)).length;
  const tbr=db.books.filter(b=>b.statut==='tbr'&&!isUpcoming(b)).sort((a,b)=>(a.dateAjout||0)-(b.dateAjout||0));
  const streak=calcStreak();
  const obj=db.settings.objectif||0;
  let out=`<div class="statgrid" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:6px">
    <div class="stat"><div class="n">${reading.length}</div><div class="l">En cours</div></div>
    <div class="stat"><div class="n">${doneY}</div><div class="l">Terminés en ${year}</div></div>
    <div class="stat"><div class="n">🔥 ${streak}</div><div class="l">Jour${streak>1?'s':''} d'affilée</div></div>
  </div>`;
  if(obj>0){
    const pct=Math.min(100,Math.round(doneY/obj*100));
    out+=`<div class="book" style="cursor:pointer;margin-top:10px" onclick="editObjectif()">
      <div style="display:flex;justify-content:space-between;font-size:.85rem;font-weight:700">
        <span>Objectif ${year}</span><span style="color:var(--accent)">${doneY}/${obj} · ${pct} %</span></div>
      <div class="pbar" style="height:9px"><div style="width:${pct}%"></div></div>
      ${doneY>=obj?'<div style="font-size:.8rem;color:var(--green);margin-top:6px;font-weight:700">🎉 Objectif atteint !</div>':'<div style="font-size:.75rem;color:var(--txt2);margin-top:6px">Appuie pour modifier l\'objectif</div>'}
    </div>`;
  }else{
    out+=`<div class="book" style="cursor:pointer;margin-top:10px" onclick="editObjectif()">
      <div style="font-size:.85rem;color:var(--txt2)">${icSvg('target')} Appuie pour définir un objectif de lecture ${year}</div>
    </div>`;
  }
  out+=`<h2>Mes lectures en cours</h2>`;
  if(!reading.length)
    out+=`<div class="empty">${icSvg('empty')} Aucune lecture en cours<br>Passe un livre « En cours » depuis la Bibli !</div>`;
  reading.forEach(b=>{
    out+=`<div class="book" onclick="openInfo('${b.id}')">
      <div class="top">${coverEl(b.couverture,'')}
        <div class="tinfo"><h3>${esc(b.titre)}</h3><div class="auth">${esc(b.auteur)||'—'}</div>
        <div class="meta"><span style="color:var(--accent);font-weight:700">${fmt(b)==='papier'&&b.pages?`p. ${b.pageActuelle||0}/${b.pages}`:(b.progression||0)+' %'}</span></div></div>
      </div>
      <div class="pbar"><div style="width:${b.progression||0}%"></div></div>
      <button class="quickbtn" onclick="event.stopPropagation();openQuick('${b.id}')">${icSvg('book-open')} Mettre à jour mon avancement</button>
    </div>`;
  });
  if(tbr.length){
    out+=`<div class="secthead"><h2>${icSvg('pile')} Ma PAL (${tbr.length})</h2><button class="smallbtn" onclick="goPal()">Voir tout →</button></div>
      <div class="hscroll">${tbr.slice(0,PAL_HOME_MAX).map(b=>`<div class="hcard" style="cursor:pointer" onclick="openInfo('${b.id}')">
        ${coverEl(b.couverture,'')}<span class="nm">${esc(b.titre)}</span><span class="sub">${esc(b.auteur)||''}</span>
      </div>`).join('')}</div>`;
  }
  const coups=db.books.filter(b=>b.statut==='done'&&b.note>=5);
  if(coups.length){
    out+=`<h2>${icSvg('heart')} Coups de cœur</h2>
      <div class="hscroll">${coups.map(b=>`<div class="hcard" style="cursor:pointer" onclick="openInfo('${b.id}')">
        ${coverEl(b.couverture,'')}<span class="nm">${esc(b.titre)}</span><span class="sub">${esc(b.auteur)||''}</span>
      </div>`).join('')}</div>`;
  }
  const upcoming=db.books.filter(b=>isUpcoming(b)).sort((a,b)=>a.dateParution<b.dateParution?-1:1);
  if(upcoming.length){
    out+=`<h2>📅 Parutions à venir</h2>`;
    upcoming.forEach(b=>{
      out+=`<div class="book" onclick="openInfo('${b.id}')">
        <div class="top">${coverEl(b.couverture,'')}
          <div class="tinfo"><h3>${esc(b.titre)}</h3><div class="auth">${esc(b.auteur)||'—'}</div></div>
          <span style="color:var(--accent2);font-weight:700;white-space:nowrap">${icSvg('soon')} ${fmtDateFr(b.dateParution)}</span>
        </div>
      </div>`;
    });
  }
  out+=`<h2>Défi de la pile</h2>${defiCardHTML()}`;
  el.innerHTML=out;
}

