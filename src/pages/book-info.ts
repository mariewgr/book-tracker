/* Fiche détaillée d'un livre. */
import {FMT,fmt,fmtDateFr,isUpcoming,spineColor} from '../core/book-utils';
import {t} from '../core/i18n';
import {coverEl,icSvg,imgFallback} from '../core/icons';
import {pickImage,reRognerBookImage} from '../core/images';
import {db,save} from '../core/state';
import {askConfirm,askText,closeModals,confetti,esc,toast} from '../core/utils';
import {SUBCATS,openEdit} from './book-form';
import {gemKey,gemVision} from './isbn-scan';
import {quickSetStatut} from './quick-update';
import {openSpineFind} from './spine-tools';

export function openInfo(id){
  const b=db.books.find(x=>x.id===id);if(!b)return;
  const rows=[
    ['Format',FMT[fmt(b)]],
    ['Genre',b.genre],
    ['Langue',b.langue],
    ['Pages',b.pages?b.pages+' p.':''],
    ['Date de parution',b.dateParution?fmtDateFr(b.dateParution)+(isUpcoming(b)?' — 🔜 pas encore sorti':''):''],
    ['ISBN',b.isbn],
    ['Saga',b.saga?b.saga+(b.tome?' — Tome '+b.tome:''):''],
    ['Lu',b.statut==='done'&&b.relectures?(1+b.relectures)+' fois':''],
    ['FMC',b.fmc],
    ['MMC',b.mmc],
    ['Tropes',b.tropes],
    [b.statut==='reading'?'Avancement':'',b.statut==='reading'?(fmt(b)==='papier'&&b.pages?'p. '+(b.pageActuelle||0)+'/'+b.pages+' ('+(b.progression||0)+' %)':(b.progression||0)+' %'):''],
    [b.statut==='dnf'?'Abandonné le':'Terminé le',b.dateFin?new Date(b.dateFin+'T12:00:00').toLocaleDateString('fr-FR'):((b.statut==='done'||b.statut==='dnf')?'Il y a longtemps 🕰':'')],
    ['Arrêté à',b.statut==='dnf'&&b.progression?b.progression+' %':''],
    ['Recommander ?',b.recommande===true?'👍 Oui':(b.recommande===false?'👎 Non':'')],
    ['Smut',b.smut?'🌶'.repeat(b.smut):''],
  ].filter(([l,v])=>l&&v);
  const sn=b.sousNotes||{};
  const subHtml=SUBCATS.filter(([k])=>sn[k]>0).map(([k,l])=>
    `<div class="inforow"><span>${l}</span><b class="stars">${'★'.repeat(sn[k])}${'☆'.repeat(5-sn[k])}</b></div>`).join('');
  const spineImg=b.spine
    ?`<img class="spineimg" src="${esc(b.spine)}" onerror="imgFallback(this,'spineimg ph','book')">`
    :`<div class="spinefake" style="background:${spineColor(b.id)};width:30px;height:118px;margin:0 auto">${esc(b.titre)}</div>`;
  document.getElementById('infoBody').innerHTML=`
    <div style="margin-bottom:12px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div class="imgcol">
          ${coverEl(b.couverture,'lg')}
          <div class="btns">
            <button class="smallbtn" title="Depuis l'appareil" onclick="pickImage('${id}','couverture',false)">${icSvg('image')}</button>
            <button class="smallbtn" title="Prendre une photo" onclick="pickImage('${id}','couverture',true)">${icSvg('camera')}</button>
            ${b.couverture?`<button class="smallbtn" title="Rogner à nouveau" onclick="reRognerBookImage('${id}','couverture')">${icSvg('rogner')}</button>`:''}
          </div>
          <div class="lbl">Couverture</div>
        </div>
        <div class="imgcol">
          ${spineImg}
          <div class="btns">
            <button class="smallbtn" title="Depuis l'appareil" onclick="pickImage('${id}','spine',false)">${icSvg('image')}</button>
            <button class="smallbtn" title="Prendre une photo" onclick="pickImage('${id}','spine',true)">${icSvg('camera')}</button>
            ${b.spine?`<button class="smallbtn" title="Rogner à nouveau" onclick="reRognerBookImage('${id}','spine')">${icSvg('rogner')}</button>`:''}
          </div>
          <div class="btns" style="margin-top:4px">
            <button class="smallbtn" title="Chercher en ligne" onclick="openSpineFind('book','${id}')">🔍</button>
          </div>
          <div class="lbl">Tranche</div>
        </div>
      </div>
      <div style="margin-top:12px">
        <h2 style="margin:0 0 4px">${esc(b.titre)}</h2>
        <div class="auth" style="color:var(--txt2);margin-bottom:8px">${esc(b.auteur)||'—'}</div>
        <div class="seg">
          <button type="button" class="${b.statut==='tbr'?'on':''}" onclick="quickSetStatut('${id}','tbr')">À lire</button>
          <button type="button" class="${b.statut==='reading'?'on':''}" onclick="quickSetStatut('${id}','reading')">En cours</button>
          <button type="button" class="${b.statut==='done'?'on':''}" onclick="quickSetStatut('${id}','done')">Terminé</button>
          <button type="button" class="${b.statut==='dnf'?'on':''}" onclick="quickSetStatut('${id}','dnf')">DNF</button>
        </div>
        ${(b.statut==='done'||b.statut==='dnf')&&b.note?`<div class="stars" style="margin-top:8px;font-size:1.1rem">${'★'.repeat(b.note)}${'☆'.repeat(5-b.note)}</div>`:''}
      </div>
    </div>
    ${b.statut==='done'?`<button class="btn ghost" style="margin:4px 0 10px" onclick="rereadBook('${b.id}')">${icSvg('retry')} J'ai relu ce livre${b.relectures?' — déjà '+(1+b.relectures)+' lectures':''}</button>`:''}
    ${rows.map(([l,v])=>`<div class="inforow"><span>${l}</span><b>${esc(String(v))}</b></div>`).join('')}
    ${subHtml?`<div style="margin-top:12px;font-weight:700;font-size:.85rem;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px">Notes détaillées</div>${subHtml}`:''}
    ${b.synopsis?`<details style="margin-top:12px;font-size:.9rem;line-height:1.5"><summary style="color:var(--txt2);cursor:pointer;font-weight:700">${icSvg('summary')} Résumé du livre</summary><div style="margin-top:6px">${esc(b.synopsis)}</div></details>`:''}
    ${b.resume?`<div style="margin-top:12px;font-size:.9rem;line-height:1.5"><span style="color:var(--txt2)">Mon résumé :</span><br>${esc(b.resume)}</div>`:''}
    ${b.finNote?`<details style="margin-top:12px;font-size:.9rem;line-height:1.5"><summary style="color:var(--gold);cursor:pointer;font-weight:700">${icSvg('warning')} La fin (spoilers)</summary><div style="margin-top:6px">${esc(b.finNote)}</div></details>`:''}
    ${b.avis?`<div style="margin-top:12px;font-size:.9rem;line-height:1.5"><span style="color:var(--txt2)">Commentaires :</span><br>${esc(b.avis)}</div>`:''}
    <div style="margin-top:14px">
      <span style="color:var(--txt2);font-size:.85rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Citations</span>
      ${(b.citations||[]).map((q,i)=>`<div class="mile" style="cursor:pointer" onclick="delCitation('${b.id}',${i})"><span class="name" style="font-style:italic">“${esc(q)}”</span></div>`).join('')}
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
        <button class="smallbtn" onclick="addCitation('${b.id}')">＋ Ajouter une citation</button>
        <button class="smallbtn" onclick="ocrCitation('${b.id}')">${icSvg('camera')} Depuis une photo</button>
      </div>
    </div>`;
  document.getElementById('infoEditBtn').onclick=()=>{closeModals();openEdit(id);};
  document.getElementById('infoModal').classList.add('open');
}
export function addCitation(id){
  askText('Ta citation','',t=>{
    if(!t)return;
    const b=db.books.find(x=>x.id===id);if(!b)return;
    b.citations=b.citations||[];b.citations.push(t);
    save();openInfo(id);
  });
}
export function delCitation(id,i){
  askConfirm('Supprimer cette citation ?',()=>{
    const b=db.books.find(x=>x.id===id);if(!b)return;
    b.citations.splice(i,1);save();openInfo(id);
  },'Supprimer');
}
export function rereadBook(id){
  const b=db.books.find(x=>x.id===id);if(!b)return;
  b.relectures=(b.relectures||0)+1;
  save();confetti();openInfo(id);
  toast('Relecture n°'+(1+b.relectures)+' notée 🎉');
}
/* Citation depuis une photo (OCR Gemini) */
export let quoteBookId=null;
export function ocrCitation(id){
  if(!gemKey){toast('Ajoute ta clé Gemini dans ⚙️ pour l\'OCR');return;}
  quoteBookId=id;
  document.getElementById('quotePick').click();
}
export function onQuotePicked(inp){
  const f=inp.files[0];inp.value='';
  if(!f||!quoteBookId)return;
  toast('⏳ Lecture de la citation…');
  const img=new Image();
  img.onload=async()=>{
    const maxH=1400,sc=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(img.src);
    const b64=c.toDataURL('image/jpeg',0.82).split(',')[1];
    try{
      const txt=await gemVision('Transcris exactement le passage surligné ou principal de cette page de livre, sans rien ajouter. Réponds uniquement avec le texte.',b64,false);
      askText('Citation transcrite — corrige si besoin',txt,t=>{
        if(!t)return;
        const b=db.books.find(x=>x.id===quoteBookId);if(!b)return;
        b.citations=b.citations||[];b.citations.push(t);
        save();openInfo(quoteBookId);
      });
    }catch(e){toast('Transcription impossible 😕 — réessaie avec une photo plus nette');}
  };
  img.src=URL.createObjectURL(f);
}

