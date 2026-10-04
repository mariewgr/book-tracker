/* Réglages + édition du profil. */
import {t,translatePage} from '../core/i18n';
import {applySpr,icSvg} from '../core/icons';
import {cacheExternalImage,cleanupOldImage,needsCaching,uploadImage} from '../core/images';
import {db,save} from '../core/state';
import {sbUser,setSyncStatus,touchProfileSync} from '../core/supabase';
import {closeModals,esc,makeSortable,toast} from '../core/utils';
import {render} from '../main';
import {segSet,segVal} from './book-form';
import {syncPublicProfile} from './friends';
import {GKEY,gemKey,setGemKey} from './isbn-scan';

export let gbFail=0;
export async function gbDescLang(q,lang){
  try{
    const r=await fetch('https://www.googleapis.com/books/v1/volumes?q='+encodeURIComponent(q)+'&country=FR&maxResults=5'+lang);
    if(!r.ok){gbFail++;return null;}
    const d=await r.json();
    const it=(d.items||[]).find(x=>x.volumeInfo&&x.volumeInfo.description);
    return it?it.volumeInfo.description:null;
  }catch(e){gbFail++;return null;}
}
export const gbDescFr=q=>gbDescLang(q,'&langRestrict=fr');
export const gbDescAny=q=>gbDescLang(q,'');
export async function gbDesc(q){return (await gbDescFr(q))||(await gbDescAny(q));}
/* Booknode (résumés en français) via proxy CORS */
export const unHtml=s=>{const t=document.createElement('textarea');t.innerHTML=s;return t.value;};
export async function viaProxy(url){
  for(const p of ['https://api.allorigins.win/raw?url=','https://corsproxy.io/?url=']){
    try{
      const r=await fetch(p+encodeURIComponent(url));
      if(r.ok){const t=await r.text();if(t&&t.length>300)return t;}
    }catch(e){}
  }
  return null;
}
export async function bnDesc(titre,auteur){
  try{
    const sh=await viaProxy('https://booknode.com/recherche?q='+encodeURIComponent(titre+' '+(auteur||'')));
    if(!sh)return null;
    const m=sh.match(/href="(https:\/\/booknode\.com\/[a-z0-9_]+_0?\d{4,})"/i)
      ||sh.match(/href="(\/[a-z0-9_]+_0?\d{4,})"/i);
    if(!m)return null;
    let u=m[1];if(u.startsWith('/'))u='https://booknode.com'+u;
    const ph=await viaProxy(u);
    if(!ph)return null;
    /* 1. données structurées JSON-LD */
    const lds=ph.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)||[];
    for(const s of lds){
      try{
        const j=JSON.parse(s.replace(/<script[^>]*>|<\/script>/gi,''));
        const o=Array.isArray(j)?j[0]:j;
        if(o&&o.description&&o.description.length>80)return unHtml(o.description);
      }catch(e){}
    }
    /* 2. og:description */
    const og=ph.match(/property=["']og:description["'] content=["']([^"']{80,})["']/i);
    if(og)return unHtml(og[1]);
    /* 3. bloc « Résumé » de la page */
    const rs=ph.match(/R[ée]sum[ée][\s\S]{0,500}?<p[^>]*>([\s\S]{100,3000}?)<\/p>/i);
    if(rs)return unHtml(rs[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
  }catch(e){}
  return null;
}
/* Secours : Open Library (édition → œuvre → description) */
export async function olDesc(isbn,titre,auteur){
  try{
    let workKey=null;
    if(isbn){
      const r=await fetch('https://openlibrary.org/isbn/'+isbn+'.json');
      if(r.ok){const d=await r.json();workKey=d.works&&d.works[0]&&d.works[0].key;}
    }
    if(!workKey&&titre){
      const r=await fetch('https://openlibrary.org/search.json?title='+encodeURIComponent(titre)+
        (auteur?'&author='+encodeURIComponent(auteur):'')+'&fields=key&limit=1');
      if(r.ok){const d=await r.json();workKey=d.docs&&d.docs[0]&&d.docs[0].key;}
    }
    if(!workKey)return null;
    const r2=await fetch('https://openlibrary.org'+workKey+'.json');
    if(!r2.ok)return null;
    const w=await r2.json();
    return typeof w.description==='string'?w.description:((w.description&&w.description.value)||null);
  }catch(e){return null;}
}
export async function backfillSynopsis(){
  const btn=document.getElementById('bfBtn');
  const missing=db.books.filter(b=>!b.synopsis);
  if(!missing.length){toast('Tous tes livres ont déjà un résumé ✅');return;}
  btn.disabled=true;gbFail=0;
  let ok=0,i=0;
  for(const b of missing){
    i++;
    btn.textContent='⏳ '+i+'/'+missing.length+' — '+b.titre.slice(0,22)+'…';
    let d=null;
    /* priorité au français */
    if(b.isbn)d=await gbDescFr('isbn:'+b.isbn);
    if(!d)d=await gbDescFr('intitle:"'+b.titre+'" '+(b.auteur||''));
    if(!d)d=await bnDesc(b.titre,b.auteur);
    if(!d&&b.isbn)d=await gbDescAny('isbn:'+b.isbn);
    if(!d)d=await gbDescAny(b.titre+' '+(b.auteur||''));
    if(!d)d=await olDesc(b.isbn,b.titre,b.auteur);
    if(d){b.synopsis=d;ok++;save();}
    await new Promise(r=>setTimeout(r,250));
  }
  save();render();
  btn.disabled=false;
  btn.innerHTML=icSvg('summary')+' Récupérer les résumés manquants';
  if(!ok&&gbFail>0)toast('⚠️ Google Books semble inaccessible depuis ton réseau ('+gbFail+' échecs) — Open Library n\'a rien trouvé non plus');
  else toast(ok+' résumé'+(ok>1?'s':'')+' récupéré'+(ok>1?'s':'')+' sur '+missing.length+' livre'+(missing.length>1?'s':'')+' ✅');
}
/* Variante silencieuse (pas de bouton à mettre à jour) : lancée en arrière-plan après un import,
   pour ne pas laisser une sauvegarde pleine de couvertures/tranches en base64 dans l'état à
   synchroniser. */
export async function cacheAllCoversQuiet(){
  for(const b of db.books){
    if(needsCaching(b.couverture))await cacheExternalImage(b.id,'couverture');
    if(needsCaching(b.spine))await cacheExternalImage(b.id,'spine');
  }
}
export function openSettings(){
  segSet('segLang',db.settings.lang||'fr');
  document.getElementById('s_taille').value=db.settings.taille||'';
  document.getElementById('s_objectif').value=db.settings.objectif||'';
  segSet('segTheme',db.settings.theme||'sombre');
  segSet('segBois',db.settings.bois||'sombre');
  document.getElementById('g_key').value=gemKey||'';
  document.getElementById('accountEmail').textContent=(sbUser&&sbUser.email)||'';
  setSyncStatus(sbUser?'✅ Sync temps réel active':'Non connectée');
  document.getElementById('settingsModal').classList.add('open');
}
export function saveSettings(){
  db.settings.lang=segVal('segLang');
  db.settings.taille=+document.getElementById('s_taille').value||165;
  db.settings.objectif=+document.getElementById('s_objectif').value||0;
  db.settings.theme=segVal('segTheme');
  db.settings.bois=segVal('segBois');
  const newGemKey=document.getElementById('g_key').value.trim();
  setGemKey(newGemKey);
  localStorage.setItem(GKEY,newGemKey);
  save();closeModals();render();
  translatePage(document.getElementById('appRoot'));
}
export let pfPhotoData='';
export function renderProfilePreview(){
  const url=pfPhotoData||db.profile.photo;
  document.getElementById('pfPhotoPreview').innerHTML=url
    ?`<img src="${url}" style="width:88px;height:88px;object-fit:cover;border-radius:50%;display:block;margin-top:6px">`
    :'<div class="isbnmsg" style="margin-top:6px">Aucune photo pour l\'instant.</div>';
}
export const PROFILE_SECTIONS={reading:'Livres en cours de lecture et leur avancement',stats:'Statistiques',pal:'Ma PAL',shelves:'Étagères',done:'Livres terminés',coups:'Coups de cœur',badges:'Badges'};
export const profileField=key=>'public'+key.charAt(0).toUpperCase()+key.slice(1);
export let pfSectionsW=[];
export function renderProfileSections(){
  const wrap=document.getElementById('pfSectionsEl');
  wrap.innerHTML=pfSectionsW.map((s,i)=>`<div class="sitem" data-i="${i}">
    <span class="drag">⠿</span>
    <span class="nm">${esc(PROFILE_SECTIONS[s.key])}</span>
    <button type="button" class="smallbtn" onclick="pfToggleSection(${i})" title="${s.on?'Public — touche pour rendre privé':'Privé — touche pour rendre public'}">
      <span data-spr="${s.on?'unlock':'lock'}" data-spr-size="16"><svg class="icn"><use href="#i-${s.on?'unlock':'lock'}"/></svg></span>
    </button>
  </div>`).join('');
  applySpr(wrap);
  makeSortable(wrap,order=>{
    pfSectionsW=order.map(i=>pfSectionsW[i]).filter(Boolean);
    renderProfileSections();
  });
}
export function pfToggleSection(i){
  pfSectionsW[i].on=!pfSectionsW[i].on;
  renderProfileSections();
}
export function openProfile(){
  document.getElementById('pf_nom').value=db.profile.nom||'';
  pfSectionsW=db.profile.sectionOrder.map(key=>({key,on:!!db.profile[profileField(key)]}));
  renderProfileSections();
  pfPhotoData='';
  renderProfilePreview();
  document.getElementById('profileModal').classList.add('open');
}
export function pickProfilePhoto(){document.getElementById('pfPhotoPick').click();}
export function onProfilePhotoPicked(inp){
  const f=inp.files[0];inp.value='';
  if(!f)return;
  const img=new Image();
  img.onload=()=>{
    const maxH=400,scale=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(img.src);
    pfPhotoData=c.toDataURL('image/jpeg',0.8);
    renderProfilePreview();
  };
  img.onerror=()=>toast('Image illisible 😕');
  img.src=URL.createObjectURL(f);
}
export async function saveProfile(){
  db.profile.nom=document.getElementById('pf_nom').value.trim();
  db.profile.sectionOrder=pfSectionsW.map(s=>s.key);
  pfSectionsW.forEach(s=>{db.profile[profileField(s.key)]=s.on;});
  if(pfPhotoData){
    const oldPhoto=db.profile.photo;
    db.profile.photo=await uploadImage(pfPhotoData,'profile');
    cleanupOldImage(oldPhoto,db.profile.photo);
  }
  save();closeModals();render();
  touchProfileSync();
  syncPublicProfile();
  toast('Profil enregistré ✅');
}
/* ---------- Aperçu visiteur : rendu en lecture seule des sections cochées, dans l'ordre choisi ---------- */
/* Encode les champs connus d'un livre en attribut data-book (JSON échappé) pour un clic sur
   sa carte — utilisé aussi bien sur son propre appareil que sur le profil déjà synchronisé
   d'un·e ami·e (aucune donnée JS partagée dans ce cas, juste le HTML publié : tout ce qu'on
   peut proposer d'ajouter doit donc être embarqué directement dans le HTML). */
export function applyTheme(){
  document.body.dataset.theme=db.settings.theme||'sombre';
  document.body.dataset.bois=db.settings.bois||'sombre';
}
