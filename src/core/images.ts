/* Sélection/compression/rognage de photos (couvertures, tranches, avatars, posts…) + stockage cloud. */
import {t} from './i18n';
import {db,save,saveLocal} from './state';
import {sbClient,sbUser,scheduleSync} from './supabase';
import {toast} from './utils';
import {render} from '../main';
import {openInfo} from '../pages/book-info';
import {pcPhotos,renderPcPhotos} from '../pages/feed';
import {contributeSpine,currentBookMeta,openSpineCam} from '../pages/spine-tools';

export function cleanupOldImage(oldUrl,newUrl){
  if(!oldUrl||oldUrl===newUrl)return;
  const m=oldUrl.match(/\/storage\/v1\/object\/public\/bibli\/(.+)$/);
  if(!m)return;
  sbClient().then(c=>{if(c)c.storage.from('bibli').remove([m[1]]).catch(()=>{});}).catch(()=>{});
}
/* Photos → Supabase Storage (sync légère) ; repli base64 locale hors connexion */
export async function uploadImage(dataUrl,name){
  try{
    const c=await sbClient();
    if(!c||!sbUser)return dataUrl;
    const blob=await (await fetch(dataUrl)).blob();
    const path=sbUser.id+'/'+name+'-'+Date.now()+'.jpg';
    const {error}=await c.storage.from('bibli').upload(path,blob,{contentType:'image/jpeg',upsert:true});
    if(error)return dataUrl;
    const {data}=c.storage.from('bibli').getPublicUrl(path);
    return (data&&data.publicUrl)||dataUrl;
  }catch(e){return dataUrl;}
}
/* Fichier quelconque (pas forcément une image) → Supabase Storage. Retourne null si pas
   connecté ou en cas d'erreur (pas de repli base64 ici : un fichier d'import peut être gros). */
export async function uploadFile(blob,name,contentType){
  try{
    const c=await sbClient();
    if(!c||!sbUser)return null;
    const path=sbUser.id+'/'+name+'-'+Date.now();
    const {error}=await c.storage.from('bibli').upload(path,blob,{contentType:contentType||'application/octet-stream',upsert:true});
    if(error)return null;
    const {data}=c.storage.from('bibli').getPublicUrl(path);
    return (data&&data.publicUrl)||null;
  }catch(e){return null;}
}
/* Couvertures récupérées en ligne (recherche, ISBN...) : l'URL externe (Open Library, Google
   Books...) est souvent lente à recharger à chaque affichage. On la télécharge une seule fois,
   juste après l'enregistrement, et on la stocke comme une photo prise depuis le téléphone —
   les affichages suivants utilisent alors notre copie, rapide. Échec silencieux (réseau, CORS…) :
   l'URL externe reste utilisée en secours.
   Même chose pour une couverture encore en base64 (data:...) — cas d'un ajout fait hors ligne,
   ou d'une sauvegarde importée : tant qu'elle reste en base64, elle est embarquée en entier dans
   le JSON synchronisé à CHAQUE modification, ce qui peut largement dépasser la taille de requête
   acceptée par Supabase et faire échouer silencieusement la sync (livres "qui ne remontent pas"). */
export function needsCaching(url){
  if(!url)return false;
  if(url.includes('/storage/v1/object/public/bibli/'))return false;
  return /^https?:\/\//.test(url)||/^data:image\//.test(url);
}
export async function cacheExternalImage(bookId,field){
  const b=db.books.find(x=>x.id===bookId);if(!b)return;
  const url=b[field];
  if(!needsCaching(url))return;
  try{
    const res=await fetch(url);
    if(!res.ok)return;
    const blob=await res.blob();
    const objUrl=URL.createObjectURL(blob);
    const img=new Image();
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=objUrl;});
    const maxH=520,scale=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(objUrl);
    const stored=await uploadImage(c.toDataURL('image/jpeg',0.72),'book-'+field);
    const cur=db.books.find(x=>x.id===bookId);
    if(cur&&cur[field]===url){
      cur[field]=stored;
      saveLocal();scheduleSync();render();
    }
  }catch(e){}
}
export function cacheExternalCover(bookId){return cacheExternalImage(bookId,'couverture');}
export let imgTarget=null,formImgs={couverture:'',spine:''};
export function resetFormImgs(){
  formImgs={couverture:'',spine:''};
  ['covMsg','spMsg'].forEach(i=>{const m=document.getElementById(i);if(m){m.textContent='';m.className='isbnmsg';}});
}
export function pickImage(id,field,camera,kind){
  if(field==='spine'&&camera){openSpineCam({id,field,kind:kind||'book'});return;}
  imgTarget={id,field,kind:kind||'book'};
  const inp=document.getElementById('imgPick');
  if(camera)inp.setAttribute('capture','environment');
  else inp.removeAttribute('capture');
  inp.click();
}
export function resizeDataUrl(dataUrl,maxH){
  return new Promise(res=>{
    const img=new Image();
    img.onload=()=>{
      const scale=Math.min(1,maxH/img.height);
      const c=document.createElement('canvas');
      c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      res(c.toDataURL('image/jpeg',0.72));
    };
    img.src=dataUrl;
  });
}
export function onImgPicked(inp){
  const f=inp.files[0];inp.value='';
  if(!f||!imgTarget)return;
  const target=imgTarget;
  const objUrl=URL.createObjectURL(f);
  openCropper(objUrl,async(cropped)=>{
    URL.revokeObjectURL(objUrl);
    if(!cropped)return; /* rognage annulé */
    const dataUrl=await uploadImage(await resizeDataUrl(cropped,520),(target.kind||'x')+'-'+(target.field||'img'));
    if(target.field==='spine'){const m=currentBookMeta(target.kind,target.id);contributeSpine(m.titre,m.auteur,m.isbn,dataUrl);}
    if(target.kind==='postcompose'){
      pcPhotos.push(dataUrl);
      renderPcPhotos();
      return;
    }
    if(target.kind==='form'){
      formImgs[target.field]=dataUrl;
      const m=document.getElementById(target.field==='couverture'?'covMsg':'spMsg');
      if(m){m.textContent='✅ Image ajoutée — sera utilisée à l\'enregistrement';m.className='isbnmsg ok';}
      return;
    }
    const obj=db.books.find(x=>x.id===target.id);
    if(!obj)return;
    cleanupOldImage(obj[target.field],dataUrl);
    obj[target.field]=dataUrl;
    save();render();
    openInfo(obj.id);
    toast('Image mise à jour ✅');
  });
}
/* Re-rogner une image déjà en place (couverture ou tranche) : on la retélécharge en blob
   (même une image en ligne, type Google Books) pour éviter qu'un canvas "taché" par une
   image cross-origin sans en-têtes CORS bloque le rognage. */
export async function reRognerImage(url,onCropped){
  url=(url||'').trim();
  if(!url){toast('Ajoute d\'abord une image à rogner');return;}
  let objUrl;
  try{
    const blob=await (await fetch(url)).blob();
    objUrl=URL.createObjectURL(blob);
  }catch(e){toast('Impossible de charger cette image pour la rogner 😕');return;}
  openCropper(objUrl,async(cropped)=>{
    URL.revokeObjectURL(objUrl);
    if(!cropped)return;
    onCropped(await uploadImage(await resizeDataUrl(cropped,520),'recrop'));
  });
}
/* Depuis le formulaire d'ajout/édition (champ Couverture ou Tranche encore non enregistré). */
export function reRognerField(field){
  const inp=document.getElementById(field==='couverture'?'f_couverture':'f_spine');
  reRognerImage(inp.value,dataUrl=>{
    inp.value=dataUrl;
    const m=document.getElementById(field==='couverture'?'covMsg':'spMsg');
    if(m){m.textContent='✅ Image rognée';m.className='isbnmsg ok';}
  });
}
/* Depuis la fiche d'un livre déjà enregistré. */
export function reRognerBookImage(id,field){
  const obj=db.books.find(x=>x.id===id);
  if(!obj)return;
  const oldUrl=obj[field];
  reRognerImage(oldUrl,dataUrl=>{
    obj[field]=dataUrl;
    cleanupOldImage(oldUrl,dataUrl);
    save();render();openInfo(id);
    toast('Image rognée ✅');
  });
}
/* ---------- Rognage photo (couverture / tranche), sans dépendance externe ---------- */
export let cropState=null;
export function openCropper(src,onDone){
  const imEl=document.getElementById('cropImgEl');
  /* Le modal doit être ouvert (donc mis en page) AVANT de mesurer clientWidth/Height,
     sinon l'image est encore display:none et ces mesures valent 0. */
  document.getElementById('cropModal').classList.add('open');
  imEl.onload=()=>{
    const dispW=imEl.clientWidth,dispH=imEl.clientHeight;
    const w=dispW*0.8,h=dispH*0.8;
    cropState={onDone,dispW,dispH,natW:imEl.naturalWidth,natH:imEl.naturalHeight,
      box:{x:(dispW-w)/2,y:(dispH-h)/2,w,h}};
    renderCropBox();
  };
  imEl.src=src;
}
export function renderCropBox(){
  const s=cropState,b=s.box,el=document.getElementById('cropBox');
  el.style.left=b.x+'px';el.style.top=b.y+'px';el.style.width=b.w+'px';el.style.height=b.h+'px';
  /* Voile obscurcissant = 4 rectangles bornés à l'image (pas de box-shadow qui déborderait
     sur toute la page), pour que seul ce qui sera rogné reste assombri. */
  const vt=document.getElementById('veilTop'),vb=document.getElementById('veilBottom'),
    vl=document.getElementById('veilLeft'),vr=document.getElementById('veilRight');
  vt.style.left='0px';vt.style.top='0px';vt.style.width=s.dispW+'px';vt.style.height=Math.max(0,b.y)+'px';
  vb.style.left='0px';vb.style.top=(b.y+b.h)+'px';vb.style.width=s.dispW+'px';vb.style.height=Math.max(0,s.dispH-b.y-b.h)+'px';
  vl.style.left='0px';vl.style.top=b.y+'px';vl.style.width=Math.max(0,b.x)+'px';vl.style.height=b.h+'px';
  vr.style.left=(b.x+b.w)+'px';vr.style.top=b.y+'px';vr.style.width=Math.max(0,s.dispW-b.x-b.w)+'px';vr.style.height=b.h+'px';
}
export function cropClamp(){
  const s=cropState,b=s.box,MIN=30;
  b.w=Math.max(MIN,Math.min(b.w,s.dispW));
  b.h=Math.max(MIN,Math.min(b.h,s.dispH));
  b.x=Math.max(0,Math.min(b.x,s.dispW-b.w));
  b.y=Math.max(0,Math.min(b.y,s.dispH-b.h));
}
(function(){
  const wrap=document.getElementById('cropWrap');
  let mode=null,startX=0,startY=0,startBox=null;
  wrap.addEventListener('pointerdown',e=>{
    if(!cropState)return;
    const handle=e.target.closest('.cropHandle');
    const box=e.target.closest('#cropBox');
    if(!handle&&!box)return;
    e.preventDefault();
    mode=handle?handle.dataset.c:'move';
    startX=e.clientX;startY=e.clientY;
    startBox={...cropState.box};
    wrap.setPointerCapture(e.pointerId);
  });
  wrap.addEventListener('pointermove',e=>{
    if(!mode||!cropState)return;
    e.preventDefault();
    const dx=e.clientX-startX,dy=e.clientY-startY,b=cropState.box;
    if(mode==='move'){
      b.x=startBox.x+dx;b.y=startBox.y+dy;
    }else{
      if(mode.includes('w')){b.x=startBox.x+dx;b.w=startBox.w-dx;}
      if(mode.includes('e'))b.w=startBox.w+dx;
      if(mode.includes('n')){b.y=startBox.y+dy;b.h=startBox.h-dy;}
      if(mode.includes('s'))b.h=startBox.h+dy;
    }
    cropClamp();
    renderCropBox();
  });
  ['pointerup','pointercancel'].forEach(ev=>wrap.addEventListener(ev,()=>{mode=null;}));
})();
export function closeCropper(apply){
  document.getElementById('cropModal').classList.remove('open');
  if(!cropState)return;
  const {onDone,box:b,natW,dispW,natH,dispH}=cropState;
  cropState=null;
  if(!apply){onDone(null);return;}
  const scaleX=natW/dispW,scaleY=natH/dispH;
  const c=document.createElement('canvas');
  c.width=Math.round(b.w*scaleX);c.height=Math.round(b.h*scaleY);
  c.getContext('2d').drawImage(document.getElementById('cropImgEl'),
    b.x*scaleX,b.y*scaleY,b.w*scaleX,b.h*scaleY,0,0,c.width,c.height);
  onDone(c.toDataURL('image/jpeg',0.9));
}

/* ---------- Remarque / signaler un bug (envoi par mail) ---------- */

export function setImgTarget(t){imgTarget=t;}
