/* Remarque / signaler un bug (envoi par mail). */
import {applySpr} from '../core/icons';
import {uploadImage} from '../core/images';
import {toast} from '../core/utils';

export const FEEDBACK_EMAIL='marie.wagnerwagner@gmail.com';
export let fbPhotoData='';
export function pickFeedbackPhoto(){document.getElementById('fbPhotoPick').click();}
export function onFeedbackPhotoPicked(inp){
  const f=inp.files[0];inp.value='';
  if(!f)return;
  const img=new Image();
  img.onload=()=>{
    const maxH=520,scale=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(img.src);
    fbPhotoData=c.toDataURL('image/jpeg',0.72);
    renderFeedbackPreview();
  };
  img.onerror=()=>toast('Image illisible 😕');
  img.src=URL.createObjectURL(f);
}
export function removeFeedbackPhoto(){fbPhotoData='';renderFeedbackPreview();}
export function renderFeedbackPreview(){
  document.getElementById('fbPhotoPreview').innerHTML=fbPhotoData
    ?`<div style="position:relative;display:inline-block;margin-top:8px">
        <img src="${fbPhotoData}" style="max-width:160px;border-radius:10px;display:block">
        <button onclick="removeFeedbackPhoto()" style="position:absolute;top:6px;right:6px;background:rgba(10,7,15,.75);color:#fff;border:none;border-radius:50%;width:26px;height:26px;cursor:pointer">✕</button>
      </div>`:'';
}
/* mailto: n'accepte pas de pièce jointe — la photo est mise en ligne (comme une couverture)
   et son lien est inclus dans le corps du message. Sans connexion/compte, on prévient plutôt
   que d'essayer de glisser un base64 énorme dans une URL mailto (ça casserait le lien). */
export async function sendFeedback(){
  const text=document.getElementById('fbText').value.trim();
  if(!text&&!fbPhotoData){toast('Écris un message ou ajoute une photo 🙂');return;}
  const btn=document.getElementById('fbSendBtn');
  btn.disabled=true;btn.textContent='⏳ Préparation…';
  let photoNote='';
  if(fbPhotoData){
    const uploaded=await uploadImage(fbPhotoData,'feedback');
    photoNote=/^https?:\/\//.test(uploaded)
      ?'\n\nPhoto : '+uploaded
      :'\n\n(Photo non jointe — connecte-toi pour pouvoir l\'envoyer)';
  }
  btn.disabled=false;btn.innerHTML='<span data-spr="mail" data-spr-size="20"><svg class="icn"><use href="#i-mail"/></svg></span> Envoyer par mail';
  applySpr(btn);
  const body=(text||'(pas de description)')+photoNote+'\n\n— Envoyé depuis Ma Bibli';
  const mailto='mailto:'+FEEDBACK_EMAIL+'?subject='+encodeURIComponent('Ma Bibli — Remarque / bug')+'&body='+encodeURIComponent(body);
  window.location.href=mailto;
  toast('Ton appli mail va s\'ouvrir avec le message prêt 📧');
  document.getElementById('fbText').value='';
  fbPhotoData='';renderFeedbackPreview();
}

