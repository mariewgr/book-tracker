/* Lecture en tandem : un guide = liste ordonnée d'étapes (« Livre – Chapitre ») qui alterne entre
   deux livres (ou plus), à suivre dans l'ordre. `db.tandems=[{id,titre,names,steps,pos}]` :
   `steps[i]={k:index dans names, l:libellé}`, `pos` = nombre d'étapes déjà lues (la progression
   est une position dans la liste, donc cocher une ligne coche aussi toutes les précédentes). */
import {t} from '../core/i18n';
import {fmt} from '../core/book-utils';
import {coverEl,icSvg} from '../core/icons';
import {db,save} from '../core/state';
import {askConfirm,closeModals,confetti,esc,toast,uid} from '../core/utils';
import {render} from '../main';
import {syncFeedForBook} from './feed';
import {gemKey,gemVision} from './isbn-scan';
import {logSession} from './quick-update';

const COLORS=['var(--txt)','var(--green)','var(--accent2)','var(--gold)'];
const colOf=k=>COLORS[k%COLORS.length];
export let openId=null,editId=null;

/* « Empire of Storms – CH1 » → {nom,label} (un tiret long ou un tiret entouré d'espaces sépare) */
export function parseSteps(text){
  const names=[],steps=[];
  text.split('\n').forEach(raw=>{
    const line=raw.replace(/^[\s☐□▢☑✓✔•*-]+/,'').trim();
    if(!line)return;
    const m=line.match(/\s*[–—]\s*|\s+-\s+/);
    const nom=m?line.slice(0,m.index).trim():'';
    const l=m?line.slice(m.index+m[0].length).trim():line;
    let k=names.indexOf(nom);
    if(k<0){names.push(nom);k=names.length-1;}
    steps.push({k,l});
  });
  return {names,steps};
}
const stepText=(g,s)=>(g.names[s.k]?g.names[s.k]+' – ':'')+s.l;
/* Livre de la bibliothèque correspondant au nom d'un livre du guide (titre identique, sinon contenu) */
function bookFor(nom){
  const n=nom.toLowerCase();if(!n)return null;
  return db.books.find(b=>b.titre.toLowerCase()===n)||db.books.find(b=>{const x=b.titre.toLowerCase();return Math.min(x.length,n.length)>=4&&(x.includes(n)||n.includes(x));})||null;
}
const pctOf=g=>g.steps.length?Math.round(g.pos/g.steps.length*100):0;
const today=()=>new Date().toISOString().slice(0,10);
/* % lu d'un livre du guide si `pos` étapes sont cochées : étapes cochées de ce livre / étapes totales de ce livre */
function bookPct(g,k,pos){
  const all=g.steps.filter(s=>s.k===k).length;
  return all?Math.round(g.steps.slice(0,pos).filter(s=>s.k===k).length/all*100):0;
}
/* Livres de la bibliothèque liés à un guide, par index de livre du guide */
/* Livre choisi dans le guide (`g.links[k]`, '' = aucun) ; à défaut (vieux guide), rapprochement par titre */
const linkedBook=(g,k)=>{
  const id=(g.links||[])[k];
  if(id)return db.books.find(b=>b.id===id)||null;
  return id===''?null:bookFor(g.names[k]);
};
const linked=g=>g.names.map((nom,k)=>linkedBook(g,k));
/* Livres des guides en cours : affichés dans la carte du guide plutôt qu'en doublon sur l'accueil */
export function tandemActiveBookIds(){
  const ids=new Set();
  db.tandems.filter(g=>g.pos<g.steps.length).forEach(g=>linked(g).forEach(b=>{if(b)ids.add(b.id);}));
  return ids;
}
/* Applique un % (et éventuellement la page exacte, en papier) à un livre : passe « À lire » en « En cours »,
   « Terminé » à 100 %, et ajoute au journal les pages lues en plus. */
export function setBookProgress(b,pct,page,date){
  pct=Math.max(0,Math.min(100,Math.round(+pct)||0));
  const paper=fmt(b)==='papier';
  const readOf=x=>x.statut==='done'?(x.pages||0):(paper?(x.pageActuelle||0):Math.round((x.progression||0)/100*(x.pages||0)));
  const oldRead=readOf(b),oldStatut=b.statut;
  if(pct>=100){
    b.statut='done';b.progression=100;b.pageActuelle=b.pages||0;
    if(!b.dateFin)b.dateFin=date;
    if(oldStatut!=='done')confetti();
  }else{
    if(b.statut==='done'){b.dateFin='';}
    if(b.statut!=='reading'&&(pct>0||b.statut==='done'))b.statut='reading';
    b.progression=pct;
    if(paper)b.pageActuelle=page!=null?Math.min(Math.max(0,+page||0),b.pages||Infinity):Math.round(pct/100*(b.pages||0));
  }
  const delta=readOf(b)-oldRead;
  if(delta>0)logSession(b.id,b.titre,delta,date);
  if(b.statut!==oldStatut)syncFeedForBook(b);
}
/* Chapitres lus → % de chaque livre lié */
function syncBooksFromGuide(g){
  linked(g).forEach((b,k)=>{if(b)setBookProgress(b,bookPct(g,k,g.pos),null,today());});
}

export function openTandem(id){
  openId=id;
  if(document.getElementById('view-tandem').classList.contains('hidden'))window.switchTab('tandem');else renderTandem();
  const nx=document.getElementById('tandemNext');if(nx)nx.scrollIntoView({block:'center'});
}
export function closeTandem(){openId=null;renderTandem();}
export function renderTandem(){
  const el=document.getElementById('tandemWrap');if(!el)return;
  const g=db.tandems.find(x=>x.id===openId);
  if(!g){openId=null;el.innerHTML=listHTML();return;}
  el.innerHTML=detailHTML(g);
}
function listHTML(){
  let out=`<button class="btn" onclick="openTandemForm(null)">＋ Nouveau guide en tandem</button>`;
  if(!db.tandems.length)return out+`<div class="empty">${icSvg('empty')} Aucun guide pour l'instant<br>Un guide en tandem alterne les chapitres de deux livres (ex. Empire of Storms &amp; Tower of Dawn).<br>Colle la liste ou importe-la depuis une photo !</div>`;
  db.tandems.forEach(g=>{
    const nx=g.steps[g.pos];
    out+=`<div class="book" style="cursor:pointer;margin-top:10px" onclick="openTandem('${g.id}')">
      <div style="display:flex;justify-content:space-between;gap:8px"><h3 style="margin:0">${esc(g.titre)}</h3>
        <span style="color:var(--accent);font-weight:700;white-space:nowrap">${pctOf(g)} %</span></div>
      <div class="pbar"><div style="width:${pctOf(g)}%"></div></div>
      <div style="font-size:.8rem;color:var(--txt2);margin-top:6px">${nx?'Prochaine étape : <b style="color:'+colOf(nx.k)+'">'+esc(stepText(g,nx))+'</b>':'🎉 Guide terminé !'}</div>
    </div>`;
  });
  return out;
}
function detailHTML(g){
  const nx=g.steps[g.pos];
  const perBook=g.names.map((nom,k)=>{
    const all=g.steps.filter(s=>s.k===k).length,done=g.steps.slice(0,g.pos).filter(s=>s.k===k).length;
    const b=linkedBook(g,k);
    return `<div class="inforow" style="align-items:center"><span style="color:${colOf(k)};font-weight:700;${b?'cursor:pointer':''}"${b?` onclick="openInfo('${b.id}')"`:''}>${esc(nom||'—')}${nom&&!b?' <small style="color:var(--txt2);font-weight:400">(aucun livre associé)</small>':''}</span><b>${done}/${all}${b?' · '+(b.progression||0)+' %':''}</b></div>`;
  }).join('');
  return `<button class="smallbtn" onclick="closeTandem()">← Tous les guides</button>
    <h2 style="margin:10px 0 4px">${esc(g.titre)}</h2>
    <div style="display:flex;justify-content:space-between;font-size:.85rem;font-weight:700"><span>${g.pos}/${g.steps.length} étapes</span><span style="color:var(--accent)">${pctOf(g)} %</span></div>
    <div class="pbar" style="height:9px;margin-bottom:10px"><div style="width:${pctOf(g)}%"></div></div>
    ${perBook}
    ${nx?`<div class="book" id="tandemNext" style="margin-top:12px;border-color:${colOf(nx.k)}">
      <div style="font-size:.75rem;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px;font-weight:700">Prochaine étape</div>
      <div style="font-size:1.1rem;font-weight:700;color:${colOf(nx.k)};margin:4px 0 8px">${esc(stepText(g,nx))}</div>
      <button class="btn" onclick="tandemTick('${g.id}',${g.pos})">✔ C'est lu</button>
      <button class="btn ghost" onclick="openTandemQuick('${g.id}')">Mettre à jour mon avancement</button>
    </div>`:`<div class="empty">🎉 Guide terminé !</div>`}
    <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="smallbtn" onclick="openTandemForm('${g.id}')">✎ Modifier le guide</button></div>
    <div style="margin-top:12px">${g.steps.map((s,i)=>`<div class="mile" style="cursor:pointer;gap:10px;${i<g.pos?'opacity:.5':''}" onclick="tandemTick('${g.id}',${i})">
      <span style="font-size:1.1rem">${i<g.pos?'☑':'☐'}</span>
      <span class="name" style="color:${colOf(s.k)};${i<g.pos?'text-decoration:line-through':''}">${esc(stepText(g,s))}</span></div>`).join('')}</div>`;
}
/* Toucher une étape : non lue → elle et toutes les précédentes sont lues ; déjà lue → on revient avant elle */
export function tandemTick(id,i){
  const g=db.tandems.find(x=>x.id===id);if(!g)return;
  const was=g.pos;
  g.pos=i<g.pos?i:i+1;
  syncBooksFromGuide(g);
  save();
  renderTandem();
  if(g.pos===g.steps.length&&was<g.pos){confetti();toast('Guide terminé 🎉');}
}
/* ---------- Création / modification ---------- */
export function openTandemForm(id){
  editId=id;
  const g=id?db.tandems.find(x=>x.id===id):null;
  document.getElementById('tandemFormTitle').textContent=g?'Modifier le guide':'Nouveau guide en tandem';
  document.getElementById('tg_titre').value=g?g.titre:'';
  document.getElementById('tg_text').value=g?g.steps.map(s=>stepText(g,s)).join('\n'):'';
  document.getElementById('tg_msg').textContent='';
  /* choix des livres déjà faits pour ce guide (nom dans le guide → id du livre de la bibliothèque) */
  formLinks={};
  if(g)g.names.forEach((nom,k)=>{const b=linkedBook(g,k);formLinks[nom]=b?b.id:'';});
  formAutoTitle='';formNames='\0';document.getElementById('tg_links').innerHTML='';
  tandemLinksRefresh();
  document.getElementById('tg_del').classList.toggle('hidden',!g);
  document.getElementById('tandemModal').classList.add('open');
}
/* Un menu par livre du guide : on associe chacun à un livre de la bibliothèque (le % lu y sera écrit) */
export let formLinks={},formNames='';
/* Titre proposé : les titres des livres choisis, reliés par « & » */
export let formAutoTitle='';
function autoTitle(){
  const {names}=parseSteps(document.getElementById('tg_text').value);
  return names.map(n=>db.books.find(b=>b.id===formLinks[n])).filter(Boolean).map(b=>b.titre).join(' & ');
}
/* Le titre suit les livres choisis tant qu'il est vide ou n'a pas été modifié à la main */
function syncTitle(){
  const el=document.getElementById('tg_titre'),auto=autoTitle();
  if(el.value===''||el.value===formAutoTitle)el.value=auto;
  formAutoTitle=auto;
}
const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
/* Un bloc par livre du guide : le livre choisi + une barre de recherche dans la bibliothèque */
function renderLinks(){
  const {names}=parseSteps(document.getElementById('tg_text').value);
  document.getElementById('tg_links').innerHTML=names.map((nom,k)=>{
    const b=db.books.find(x=>x.id===formLinks[nom]);
    return `<label style="color:${colOf(k)}">Livre de ta bibliothèque pour « ${esc(nom||'—')} »</label>
      ${b?`<div class="mile" style="gap:10px;padding:8px 10px">${coverEl(b.couverture,'sm')}<span class="name">${esc(b.titre)}</span><button type="button" class="smallbtn" title="Retirer" onclick="setTandemLink(${k},'')">✕</button></div>`:''}
      <input class="search" id="tg_s${k}" autocomplete="off" placeholder="${b?'🔍 Changer de livre…':'🔍 Chercher un livre de ma bibliothèque…'}" oninput="tandemSearch(${k},this.value)" style="margin-top:6px">
      <div id="tg_r${k}"></div>`;
  }).join('');
}
export function tandemSearch(k,q){
  const el=document.getElementById('tg_r'+k);if(!el)return;
  const n=norm(q).trim();
  if(!n){el.innerHTML='';return;}
  const res=db.books.filter(b=>norm(b.titre+' '+(b.auteur||'')+' '+(b.saga||'')).includes(n)).slice(0,8);
  el.innerHTML=res.length?res.map(b=>`<div class="mile" style="cursor:pointer;gap:10px;padding:8px 10px" onclick="setTandemLink(${k},'${b.id}')">${coverEl(b.couverture,'sm')}<span class="name">${esc(b.titre)}${b.auteur?' <small style="color:var(--txt2)">— '+esc(b.auteur)+'</small>':''}</span></div>`).join(''):'<div class="isbnmsg">Aucun livre trouvé dans ta bibliothèque.</div>';
}
export function tandemLinksRefresh(){
  const {names}=parseSteps(document.getElementById('tg_text').value);
  if(names.join('|')===formNames)return;
  formNames=names.join('|');
  names.forEach(n=>{if(formLinks[n]===undefined){const b=bookFor(n);formLinks[n]=b?b.id:'';}});
  renderLinks();
  syncTitle();
}
export function setTandemLink(k,id){
  const nom=parseSteps(document.getElementById('tg_text').value).names[k];
  if(nom!==undefined)formLinks[nom]=id;
  renderLinks();
  syncTitle();
}
export function saveTandem(){
  const titre=document.getElementById('tg_titre').value.trim();
  const {names,steps}=parseSteps(document.getElementById('tg_text').value);
  if(!steps.length){toast('Ajoute au moins une étape 🙂');return;}
  const old=editId?db.tandems.find(x=>x.id===editId):null;
  const g={id:old?old.id:uid(),titre:titre||autoTitle()||names.filter(Boolean).join(' & ')||'Tandem',names,steps,links:names.map(n=>formLinks[n]||''),pos:Math.min(old?old.pos:0,steps.length)};
  if(old)db.tandems=db.tandems.map(x=>x.id===old.id?g:x);else db.tandems.push(g);
  save();closeModals();
  openTandem(g.id);
}
export function deleteTandem(){
  askConfirm('Supprimer ce guide ?',()=>{
    db.tandems=db.tandems.filter(x=>x.id!==editId);
    save();closeModals();openId=null;renderTandem();
  },'Supprimer');
}
/* Import depuis la photo d'un guide imprimé (OCR Gemini, comme pour les citations) */
export function pickTandemPhoto(){
  if(!gemKey){toast('Ajoute ta clé Gemini dans ⚙️ pour importer une photo');return;}
  document.getElementById('tandemPick').click();
}
export function onTandemPicked(inp){
  const f=inp.files[0];inp.value='';
  if(!f)return;
  const msg=document.getElementById('tg_msg');
  msg.textContent='⏳ Lecture du guide…';
  const img=new Image();
  img.onload=async()=>{
    const maxH=1800,sc=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(img.src);
    const b64=c.toDataURL('image/jpeg',0.75).split(',')[1];
    /* Un guide fait ~150 lignes sur plusieurs colonnes : une seule réponse serait longue à générer.
       On lit donc chaque colonne dans un appel séparé, en parallèle, puis on recolle dans l'ordre. */
    const COLS=3,t0=Date.now(),state=[...Array(COLS)].map(()=>'envoi…');
    const show=()=>{msg.textContent='⏳ Lecture du guide… '+Math.round((Date.now()-t0)/1000)+' s — '+state.map((s,i)=>'col. '+(i+1)+' : '+s).join(' · ');};
    const tick=setInterval(show,1000);show();
    const col=i=>gemVision('Cette image est un guide de lecture en tandem : une liste de cases à cocher répartie sur '+COLS+' colonnes. Transcris UNIQUEMENT la colonne n°'+(i+1)+' en partant de la gauche, de haut en bas, une ligne par étape, au format « Titre du livre – Chapitre », sans rien ajouter ni numéroter. Si cette colonne n\'existe pas, réponds exactement : VIDE',b64,false,true,
      model=>{state[i]=model.replace('models/','');show();})
      .then(r=>{state[i]='✓';show();return r;});
    try{
      const parts=await Promise.all([...Array(COLS).keys()].map(col));
      const txt=parts.map(p=>p.replace(/```/g,'').trim()).filter(p=>p&&p!=='VIDE').join('\n');
      const ta=document.getElementById('tg_text');
      ta.value=(ta.value.trim()?ta.value.trim()+'\n':'')+txt;
      const {steps}=parseSteps(ta.value);
      tandemLinksRefresh();
      msg.textContent='✅ '+steps.length+' étapes lues en '+Math.round((Date.now()-t0)/1000)+' s — vérifie la liste avant d\'enregistrer.';
    }catch(e){msg.textContent='⚠️ Lecture impossible : '+(e.message||'erreur inconnue');}
    finally{clearInterval(tick);}
  };
  img.src=URL.createObjectURL(f);
}
/* ---------- Carte « en cours » de l'accueil + mise à jour de l'avancement ---------- */
export const hasTandemReading=()=>db.tandems.some(g=>g.pos<g.steps.length);
export function tandemReadingHTML(){
  return db.tandems.filter(g=>g.pos<g.steps.length).map(g=>{
    const nx=g.steps[g.pos],bs=linked(g);
    const rows=g.names.map((nom,k)=>{
      const b=bs[k],pct=b?(b.progression||0):bookPct(g,k,g.pos);
      return `<div style="display:flex;justify-content:space-between;font-size:.82rem;font-weight:700;margin-top:6px;color:${colOf(k)}"><span>${esc(nom||'—')}</span><span>${b&&fmt(b)==='papier'&&b.pages?'p. '+(b.pageActuelle||0)+'/'+b.pages:pct+' %'}</span></div>
        <div class="pbar" style="margin-top:3px"><div style="width:${pct}%"></div></div>`;
    }).join('');
    return `<div class="book" onclick="openTandem('${g.id}')">
      <div class="top"><div style="display:flex;gap:4px">${bs.filter(Boolean).slice(0,2).map(b=>coverEl(b.couverture,'')).join('')}</div>
        <div class="tinfo"><h3>👯 ${esc(g.titre)}</h3>
        <div class="auth">${g.pos}/${g.steps.length} étapes · ${pctOf(g)} %</div></div></div>
      ${rows}
      <div style="font-size:.8rem;color:var(--txt2);margin-top:8px">${t('Prochaine étape')} : <b style="color:${colOf(nx.k)}">${esc(stepText(g,nx))}</b></div>
      <button class="quickbtn" onclick="event.stopPropagation();openTandemQuick('${g.id}')">${icSvg('book-open')} Mettre à jour mon avancement</button>
    </div>`;
  }).join('');
}
export let quickGid=null,quickPos=0;
const tqUnit=(b)=>fmt(b)==='papier'&&b.pages>0;
/* Valeur du champ d'un livre pour un % donné : page en papier, % sinon */
const tqVal=(b,pct)=>tqUnit(b)?Math.round(pct/100*b.pages):pct;
export function openTandemQuick(id){
  const g=db.tandems.find(x=>x.id===id);if(!g)return;
  quickGid=id;quickPos=g.pos;
  document.getElementById('tq_title').textContent='👯 '+g.titre;
  document.getElementById('tq_books').innerHTML=g.names.map((nom,k)=>{
    const b=linkedBook(g,k);
    if(!b)return `<div class="isbnmsg">${esc(nom||'—')} : aucun livre associé — choisis-le dans « Modifier le guide » pour suivre son avancement.</div>`;
    const u=tqUnit(b);
    return `<label style="color:${colOf(k)}">${esc(b.titre)} — ${u?'page actuelle':'progression (%)'}</label>
      <input id="tq_f${k}" type="number" inputmode="numeric" min="0" max="${u?b.pages:100}" value="${tqVal(b,b.progression||0)||''}" placeholder="0">
      <div class="isbnmsg">${u?'sur '+b.pages+' pages':(b.pages?'':'⚠️ sans nombre de pages, rien n\'ira au journal')}</div>`;
  }).join('');
  document.getElementById('tq_date').value=today();
  tqRefresh(false);
  document.getElementById('tandemQuickModal').classList.add('open');
  const box=document.getElementById('tq_list'),row=document.getElementById('tq_cur');
  if(box&&row)box.scrollTop=row.offsetTop-box.clientHeight/2;
}
/* Redessine résumé + liste des chapitres ; `fill` recalcule les champs % / page à partir des chapitres cochés */
function tqRefresh(fill){
  const g=db.tandems.find(x=>x.id===quickGid);if(!g)return;
  const nx=g.steps[quickPos];
  document.getElementById('tq_sum').innerHTML=`<div style="display:flex;justify-content:space-between;font-weight:700;font-size:.9rem"><span>${quickPos}/${g.steps.length} étapes</span><span style="color:var(--accent)">${g.steps.length?Math.round(quickPos/g.steps.length*100):0} %</span></div>
    ${nx?`<button class="btn" style="margin-top:8px" onclick="tandemQuickTick(${quickPos})">✔ ${esc(stepText(g,nx))} — lu</button>`:'<div class="empty" style="padding:8px">🎉 Guide terminé !</div>'}`;
  const box=document.getElementById('tq_list'),top=box.scrollTop;
  box.innerHTML=g.steps.map((s,i)=>`<div ${i===quickPos?'id="tq_cur" ':''}class="mile" style="cursor:pointer;gap:10px;padding:8px 10px;${i<quickPos?'opacity:.5':''}${i===quickPos?';border-color:'+colOf(s.k):''}" onclick="tandemQuickTick(${i})">
    <span>${i<quickPos?'☑':'☐'}</span><span class="name" style="color:${colOf(s.k)};${i<quickPos?'text-decoration:line-through':''}">${esc(stepText(g,s))}</span></div>`).join('');
  box.scrollTop=top;
  if(fill)linked(g).forEach((b,k)=>{
    const f=document.getElementById('tq_f'+k);
    if(b&&f)f.value=tqVal(b,bookPct(g,k,quickPos))||'';
  });
}
/* Même règle que sur la page du guide : toucher une étape coche aussi les précédentes */
export function tandemQuickTick(i){
  quickPos=i<quickPos?i:i+1;
  tqRefresh(true);
}
export function saveTandemQuick(){
  const g=db.tandems.find(x=>x.id===quickGid);if(!g)return;
  const date=document.getElementById('tq_date').value||today();
  g.pos=quickPos;
  linked(g).forEach((b,k)=>{
    const f=document.getElementById('tq_f'+k);if(!b||!f)return;
    const v=Math.max(0,+f.value||0);
    if(tqUnit(b))setBookProgress(b,v/b.pages*100,v,date);else setBookProgress(b,v,null,date);
  });
  save();closeModals();render();
  if(g.pos===g.steps.length)toast('Guide terminé 🎉');
}
