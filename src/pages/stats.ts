/* Statistiques + récap annuel. */
import {FMT,fmt,isUpcoming,thickness} from '../core/book-utils';
import {t} from '../core/i18n';
import {db} from '../core/state';
import {esc,toast} from '../core/utils';

export function statCard(title,variants,idx){
  idx=idx||0;
  if(variants.length===1)return `<div class="stat"><div class="n">${variants[0].n}</div><div class="l">${esc(title)}</div></div>`;
  const dots=`<div class="dots">${variants.map((_,i)=>`<span class="${i===idx?'on':''}"></span>`).join('')}</div>`;
  return `<div class="stat cyclable" data-title="${esc(title)}" data-variants="${esc(JSON.stringify(variants))}" data-idx="${idx}" onclick="cycleStat(this)">
    <div class="n">${variants[idx].n}</div><div class="l">${esc(title)}</div><div class="sub">${esc(variants[idx].sub)}</div>${dots}</div>`;
}
export function cycleStat(el){
  const variants=JSON.parse(el.dataset.variants);
  const idx=(+el.dataset.idx+1)%variants.length;
  el.dataset.idx=idx;
  el.querySelector('.n').textContent=variants[idx].n;
  el.querySelector('.sub').textContent=variants[idx].sub;
  el.querySelectorAll('.dots span').forEach((d,i)=>d.classList.toggle('on',i===idx));
}
export function bars(counts,total){
  const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if(!entries.length)return '<div style="color:var(--txt2);font-size:.85rem;padding:4px 2px">Pas encore de données.</div>';
  return entries.map(([k,v])=>`<div class="barrow">
    <div class="lbl"><b>${esc(k)}</b><span>${v}</span></div>
    <div class="track"><div class="fill" style="width:${v/total*100}%"></div></div></div>`).join('');
}
export function renderStats(){
  const done=db.books.filter(b=>b.statut==='done');
  const pages=done.reduce((s,b)=>s+(b.pages||0),0);
  const noted=done.filter(b=>b.note>0);
  const avg=noted.length?(noted.reduce((s,b)=>s+b.note,0)/noted.length).toFixed(1):'—';
  const y=new Date().getFullYear();
  document.getElementById('statCards').innerHTML=`
    <div class="stat"><div class="n">${done.length}</div><div class="l">Livres terminés (total)</div></div>
    <div class="stat"><div class="n">${pages.toLocaleString('fr-FR')}</div><div class="l">Pages des livres terminés</div></div>
    <div class="stat"><div class="n">${db.books.filter(b=>b.statut==='tbr'&&!isUpcoming(b)).length}</div><div class="l">À lire (PAL)</div></div>
    <div class="stat"><div class="n">${avg} ★</div><div class="l">Note moyenne donnée</div></div>`;
  /* Stats pages : moyennes par livre et par période de lecture */
  const doneYear=done.filter(b=>b.dateFin&&b.dateFin.startsWith(String(y)));
  const avgPagesYear=doneYear.length?Math.round(doneYear.reduce((s,b)=>s+(b.pages||0),0)/doneYear.length):0;
  const allWithPages=db.books.filter(b=>b.pages>0);
  const avgPagesAll=allWithPages.length?Math.round(allWithPages.reduce((s,b)=>s+b.pages,0)/allWithPages.length):0;
  const totalSessPages=db.sessions.reduce((s,x)=>s+(x.pages||0),0);
  const sessDays=new Set(db.sessions.map(s=>s.date));
  const sessMonths=new Set(db.sessions.map(s=>s.date.slice(0,7)));
  const sessYears=new Set(db.sessions.map(s=>s.date.slice(0,4)));
  const avgPagesDay=sessDays.size?Math.round(totalSessPages/sessDays.size):0;
  const avgPagesMonth=sessMonths.size?Math.round(totalSessPages/sessMonths.size):0;
  const avgPagesYr=sessYears.size?Math.round(totalSessPages/sessYears.size):0;
  document.getElementById('pageStats').innerHTML=
    statCard('Pages loguées dans le journal',[{n:totalSessPages.toLocaleString('fr-FR'),sub:''}])+
    statCard('Moyenne de pages par livre',[
      {n:avgPagesYear||'—',sub:'en '+y},
      {n:avgPagesAll||'—',sub:'toutes années'}
    ])+
    statCard('Rythme de lecture (moyenne)',[
      {n:avgPagesDay||'—',sub:'pages / jour'},
      {n:avgPagesMonth||'—',sub:'pages / mois'},
      {n:avgPagesYr||'—',sub:'pages / année'}
    ]);
  const count=(arr,fn)=>arr.reduce((o,b)=>{const k=fn(b);if(k)o[k]=(o[k]||0)+1;return o;},{});
  document.getElementById('langBars').innerHTML=bars(count(done,b=>b.langue||'?'),done.length||1);
  document.getElementById('fmtBars').innerHTML=bars(count(done,b=>FMT[fmt(b)]||'Papier'),done.length||1);
  document.getElementById('ficBars').innerHTML=bars(count(done,b=>b.fiction===false?'Non-fiction':'Fiction'),done.length||1);
  /* rythme + graphique cumulé année vs année précédente */
  const cut=new Date(Date.now()-30*864e5).toISOString().slice(0,10);
  const p30=db.sessions.filter(s=>s.date>=cut).reduce((t,s)=>t+s.pages,0);
  const cum=yr=>{
    const m=Array(12).fill(0);
    db.books.forEach(b=>{if(b.statut==='done'&&b.dateFin&&+b.dateFin.slice(0,4)===yr)m[+b.dateFin.slice(5,7)-1]++;});
    let c=0;return m.map(v=>c+=v);
  };
  const a=cum(y),pr=cum(y-1);
  const mx=Math.max(1,...a,...pr);
  const pts=arr=>arr.map((v,i)=>(12+i*25.1)+','+(112-v/mx*95)).join(' ');
  document.getElementById('cumChart').innerHTML=
    `<div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:6px">
      <span><span style="color:var(--accent);font-weight:700">━ ${y}</span> · <span style="color:var(--txt2)">━ ${y-1}</span></span>
      <span style="color:var(--txt2)">${Math.round(p30/30)} p./jour (30 j)</span></div>
    <svg viewBox="0 0 300 120" style="width:100%">
      <line x1="12" y1="112" x2="288" y2="112" stroke="var(--line)" stroke-width="1"/>
      <polyline points="${pts(pr)}" fill="none" stroke="var(--txt2)" stroke-width="2" opacity=".55"/>
      <polyline points="${pts(a)}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
}
/* Récap annuel partageable (image) */
export function genRecap(){
  const y=new Date().getFullYear();
  const done=db.books.filter(b=>b.statut==='done'&&b.dateFin&&b.dateFin.startsWith(String(y)));
  if(!done.length){toast('Aucun livre terminé en '+y+' pour l\'instant 😉');return;}
  const pages=done.reduce((t,b)=>t+(b.pages||0),0);
  const top=(fn)=>{const c={};done.forEach(b=>{const k=fn(b);if(k)c[k]=(c[k]||0)+1;});return Object.entries(c).sort((a,b)=>b[1]-a[1])[0];};
  const tg=top(b=>b.genre),ta=top(b=>b.auteur);
  const best=[...done].sort((a,b)=>(b.note||0)-(a.note||0))[0];
  const cv=document.createElement('canvas');cv.width=1080;cv.height=1350;
  const x=cv.getContext('2d');
  const grad=x.createLinearGradient(0,0,0,1350);
  grad.addColorStop(0,'#1e1330');grad.addColorStop(1,'#0f0a18');
  x.fillStyle=grad;x.fillRect(0,0,1080,1350);
  x.fillStyle='#c9a2ff';x.font='800 92px -apple-system,sans-serif';x.textAlign='center';
  x.fillText('Ma Bibli · '+y,540,170);
  x.fillStyle='#f0eaf7';x.font='800 190px -apple-system,sans-serif';
  x.fillText(String(done.length),540,430);
  x.fillStyle='#a89bc0';x.font='600 56px -apple-system,sans-serif';
  x.fillText('livres terminés',540,510);
  x.fillStyle='#f5c86e';x.font='800 100px -apple-system,sans-serif';
  x.fillText(pages.toLocaleString('fr-FR')+' pages',540,680);
  x.fillStyle='#f0eaf7';x.font='600 52px -apple-system,sans-serif';
  if(tg)x.fillText('Genre favori : '+tg[0],540,820);
  if(ta)x.fillText('Auteur·ice de l\'année : '+ta[0],540,910);
  if(best&&best.note)x.fillText('Coup de cœur : '+best.titre.slice(0,30)+' '+'★'.repeat(best.note),540,1000);
  const h=+done.reduce((s,b)=>s+thickness(b),0).toFixed(0);
  x.fillStyle='#8b5cf6';x.font='800 72px -apple-system,sans-serif';
  x.fillText('Pile de '+h+' cm 📚',540,1140);
  x.fillStyle='#6f6390';x.font='500 38px -apple-system,sans-serif';
  x.fillText('fait avec Ma Bibli',540,1270);
  cv.toBlob(blob=>{
    if(!blob){toast('Impossible de générer l\'image 😕');return;}
    recapBlob=blob;recapYear=y;
    document.getElementById('recapImg').src=URL.createObjectURL(blob);
    document.getElementById('recapModal').classList.add('open');
  },'image/png');
}
export let recapBlob=null,recapYear=null;
export function downloadRecap(){
  if(!recapBlob)return;
  const a2=document.createElement('a');
  a2.href=URL.createObjectURL(recapBlob);
  a2.download='ma-bibli-recap-'+recapYear+'.png';
  a2.click();
  toast('Récap téléchargé 🎉');
}
export async function shareRecap(){
  if(!recapBlob)return;
  const file=new File([recapBlob],'ma-bibli-recap-'+recapYear+'.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:'Mon récap Ma Bibli '+recapYear});}
    catch(e){/* annulé par l'utilisateur·ice — rien à faire */}
  }else{
    toast('Partage non pris en charge sur cet appareil — utilise Télécharger 👇');
  }
}

/* ---------- Images : upload / photo ---------- */
/* Supprime l'ancien fichier storage quand une image est remplacée (nouvelle photo, re-rognage,
   changement de couverture/tranche/avatar) — sinon chaque remplacement laisse l'ancienne copie
   orpheline dans le bucket pour toujours, ce qui finit par remplir le quota de stockage.
   Best-effort : ignore silencieusement si l'ancienne image n'était pas sur notre storage, ou
   en cas d'erreur (jamais bloquant pour l'utilisateur·ice). */
