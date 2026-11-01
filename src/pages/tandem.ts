/* Lecture en tandem : un guide = liste ordonnée d'étapes (« Livre – Chapitre ») qui alterne entre
   deux livres (ou plus), à suivre dans l'ordre. `db.tandems=[{id,titre,names,steps,pos}]` :
   `steps[i]={k:index dans names, l:libellé}`, `pos` = nombre d'étapes déjà lues (la progression
   est une position dans la liste, donc cocher une ligne coche aussi toutes les précédentes). */
import {t} from '../core/i18n';
import {icSvg} from '../core/icons';
import {db,save} from '../core/state';
import {askConfirm,closeModals,confetti,esc,toast,uid} from '../core/utils';
import {gemKey,gemVision} from './isbn-scan';

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
  return db.books.find(b=>b.titre.toLowerCase()===n)||db.books.find(b=>{const x=b.titre.toLowerCase();return x.includes(n)||n.includes(x);})||null;
}
const pctOf=g=>g.steps.length?Math.round(g.pos/g.steps.length*100):0;

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
    const b=bookFor(nom);
    return `<div class="inforow" style="align-items:center"><span style="color:${colOf(k)};font-weight:700;${b?'cursor:pointer':''}"${b?` onclick="openInfo('${b.id}')"`:''}>${esc(nom||'—')}</span><b>${done}/${all}</b></div>`;
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
  document.getElementById('tg_del').classList.toggle('hidden',!g);
  document.getElementById('tandemModal').classList.add('open');
}
export function saveTandem(){
  const titre=document.getElementById('tg_titre').value.trim();
  const {names,steps}=parseSteps(document.getElementById('tg_text').value);
  if(!steps.length){toast('Ajoute au moins une étape 🙂');return;}
  const old=editId?db.tandems.find(x=>x.id===editId):null;
  const g={id:old?old.id:uid(),titre:titre||names.filter(Boolean).join(' & ')||'Tandem',names,steps,pos:Math.min(old?old.pos:0,steps.length)};
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
    const maxH=2400,sc=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(img.src);
    const b64=c.toDataURL('image/jpeg',0.85).split(',')[1];
    try{
      const txt=await gemVision('Cette image est un guide de lecture en tandem : une liste de cases à cocher répartie sur plusieurs colonnes. Transcris chaque ligne, dans l\'ordre de lecture (colonne de gauche de haut en bas, puis colonne suivante, etc.), une ligne par étape, au format « Titre du livre – Chapitre », sans rien ajouter ni numéroter.',b64,false);
      const ta=document.getElementById('tg_text');
      ta.value=(ta.value.trim()?ta.value.trim()+'\n':'')+txt.replace(/```/g,'').trim();
      const {steps}=parseSteps(ta.value);
      msg.textContent='✅ '+steps.length+' étapes lues — vérifie la liste avant d\'enregistrer.';
    }catch(e){msg.textContent='⚠️ Lecture impossible — réessaie avec une photo plus nette.';}
  };
  img.src=URL.createObjectURL(f);
}
/* Carte de l'accueil : prochaine étape des guides en cours */
export function tandemHomeHTML(){
  const gs=db.tandems.filter(g=>g.pos<g.steps.length);
  if(!gs.length)return '';
  return `<h2>👯 Lectures en tandem</h2>`+gs.map(g=>{
    const nx=g.steps[g.pos];
    return `<div class="book" style="cursor:pointer" onclick="openTandem('${g.id}')">
      <div style="display:flex;justify-content:space-between;gap:8px"><h3 style="margin:0">${esc(g.titre)}</h3><span style="color:var(--accent);font-weight:700">${pctOf(g)} %</span></div>
      <div class="pbar"><div style="width:${pctOf(g)}%"></div></div>
      <div style="font-size:.85rem;margin-top:6px">${t('Prochaine étape')} : <b style="color:${colOf(nx.k)}">${esc(stepText(g,nx))}</b></div>
    </div>`;
  }).join('');
}
