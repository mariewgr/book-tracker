/* Recherche de tranches en ligne, tranches communautaires, caméra tranche. */
import {t} from '../core/i18n';
import {formImgs,uploadImage} from '../core/images';
import {db,save} from '../core/state';
import {sbClient,sbUser} from '../core/supabase';
import {esc,toast} from '../core/utils';
import {render} from '../main';
import {openInfo} from './book-info';
import {isbnClean} from './isbn-scan';

export let sfTarget=null;
export function sfMsgSet(t,cls){const m=document.getElementById('sfMsg');m.textContent=t;m.className='isbnmsg '+(cls||'');}
export async function openSpineFind(kind,id){
  sfTarget={kind,id};
  document.getElementById('sfGrid').innerHTML='';
  document.getElementById('spineFindModal').classList.add('open');
  let titre,auteur;
  if(kind==='form'){
    titre=document.getElementById('f_titre').value.trim();
    auteur=document.getElementById('f_auteur').value.trim();
  }else{
    const b=db.books.find(x=>x.id===id);if(!b)return;
    titre=b.titre;auteur=b.auteur||'';
  }
  if(!titre){sfMsgSet('Renseigne d\'abord le titre du livre','err');return;}
  document.getElementById('sfCommQ').value=titre;
  document.getElementById('sfCommGrid').innerHTML='';
  document.getElementById('sfCommMsg').textContent='';document.getElementById('sfCommMsg').className='isbnmsg';
  searchCommunitySpines();
  document.getElementById('sfGoogle').href=
    'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(titre+' '+auteur+' tranche livre book spine');
  sfMsgSet('Recherche des tranches de « '+titre+' »…');
  const items=[],seen=new Set();
  /* Openverse : gratuit, sans clé */
  {
    for(const q of [titre+' '+auteur+' book spine',titre+' book spine']){
      try{
        const r=await fetch('https://api.openverse.org/v1/images/?q='+encodeURIComponent(q)+'&page_size=20');
        if(!r.ok)continue;
        const d=await r.json();
        (d.results||[]).forEach(it=>{
          if(!it.url||seen.has(it.url))return;seen.add(it.url);
          items.push({url:it.url,thumb:it.thumbnail||it.url,
            ratio:it.width?it.height/it.width:1});
        });
      }catch(e){}
      if(items.length>=8)break;
    }
  }
  if(!items.length){
    sfMsgSet('Aucune image trouvée automatiquement 😕 — utilise le bouton Google Images ci-dessous, ou la photo 📷','err');
    return;
  }
  /* les images les plus verticales (format tranche) d'abord */
  items.sort((a,b)=>b.ratio-a.ratio);
  document.getElementById('sfGrid').innerHTML=items.slice(0,14).map(it=>
    `<img src="${esc(it.thumb)}" data-u="${esc(it.url)}" loading="lazy"
      style="height:150px;width:auto;border-radius:6px;border:2px solid var(--line2);cursor:pointer"
      onclick="chooseSpine(this.dataset.u)" onerror="this.remove()">`).join('');
  sfMsgSet(Math.min(14,items.length)+' résultat(s) — touche la tranche qui correspond','ok');
}
export function chooseSpine(url){
  if(!sfTarget)return;
  if(sfTarget.kind==='form'){
    document.getElementById('f_spine').value=url;
    formImgs.spine='';
    const m=document.getElementById('spMsg');
    if(m){m.textContent='✅ Tranche choisie en ligne';m.className='isbnmsg ok';}
  }else{
    const b=db.books.find(x=>x.id===sfTarget.id);
    if(b){b.spine=url;save();render();openInfo(b.id);}
  }
  document.getElementById('spineFindModal').classList.remove('open');
  toast('Tranche enregistrée ✅');
}
/* ---------- Tranches communautaires (Supabase : bibli_spines) ---------- */
export function currentBookMeta(kind,id){
  if(kind==='form')return{
    titre:document.getElementById('f_titre').value.trim(),
    auteur:document.getElementById('f_auteur').value.trim(),
    isbn:isbnClean(document.getElementById('f_isbn').value)
  };
  const b=db.books.find(x=>x.id===id)||{};
  return{titre:b.titre||'',auteur:b.auteur||'',isbn:b.isbn||''};
}
export async function contributeSpine(titre,auteur,isbn,url){
  if(!titre||!/^https?:\/\//.test(url))return;
  try{
    const c=await sbClient();
    if(!c||!sbUser)return;
    await c.from('bibli_spines').insert({user_id:sbUser.id,titre,auteur:auteur||'',isbn:isbn||'',url});
  }catch(e){}
}
export async function searchCommunitySpines(){
  const q=document.getElementById('sfCommQ').value.trim();
  const grid=document.getElementById('sfCommGrid'),msg=document.getElementById('sfCommMsg');
  grid.innerHTML='';
  if(!q){msg.textContent='Tape un titre ou un auteur';msg.className='isbnmsg err';return;}
  const c=await sbClient();
  if(!c||!sbUser){msg.textContent='Connecte-toi (compte cloud, voir ⚙️) pour chercher dans la communauté';msg.className='isbnmsg err';return;}
  msg.textContent='Recherche dans la communauté…';msg.className='isbnmsg';
  try{
    const like='%'+q.replace(/[%_]/g,'\\$&')+'%';
    const[r1,r2]=await Promise.all([
      c.from('bibli_spines').select('*').ilike('titre',like).order('created_at',{ascending:false}).limit(24),
      c.from('bibli_spines').select('*').ilike('auteur',like).order('created_at',{ascending:false}).limit(24)
    ]);
    if(r1.error)throw r1.error;if(r2.error)throw r2.error;
    const seen=new Set();
    const items=[...(r1.data||[]),...(r2.data||[])].filter(it=>!seen.has(it.id)&&seen.add(it.id));
    if(!items.length){msg.textContent='Aucune tranche communautaire pour « '+q+' » 😕';msg.className='isbnmsg';return;}
    msg.textContent=items.length+' tranche(s) de la communauté — touche celle qui correspond';msg.className='isbnmsg ok';
    grid.innerHTML=items.map(it=>`<img src="${esc(it.url)}" data-u="${esc(it.url)}" loading="lazy"
      style="height:150px;width:auto;border-radius:6px;border:2px solid var(--accent);cursor:pointer"
      title="${esc(it.titre)}${it.auteur?' — '+esc(it.auteur):''}" onclick="chooseSpine(this.dataset.u)" onerror="this.remove()">`).join('');
  }catch(e){
    msg.textContent="⚠️ Impossible de charger la communauté — la table bibli_spines existe-t-elle ? (voir le script SQL fourni)";
    msg.className='isbnmsg err';
  }
}

/* ---------- Caméra tranche : détection + surlignage + recadrage auto ---------- */
export let scStream=null,scTimer=null,scSpineTarget=null,scRange=null,scDataUrl=null;
export const scCv=document.createElement('canvas');
export function openSpineCam(target){
  scSpineTarget=target;scRange=null;scDataUrl=null;
  document.getElementById('scPreviewWrap').classList.add('hidden');
  document.getElementById('scShot').classList.remove('hidden');
  document.getElementById('scBox').style.display='none';
  document.getElementById('spineCamModal').classList.add('open');
  navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false})
    .then(st=>{
      scStream=st;
      const v=document.getElementById('scVideo');
      v.srcObject=st;v.play();
      scTimer=setInterval(scDetect,350);
    })
    .catch(()=>{closeSpineCam();toast("Impossible d'accéder à la caméra 😕");});
}
export function scDetect(){
  const v=document.getElementById('scVideo');
  if(!v.videoWidth)return;
  const W=96,H=Math.max(32,Math.round(W*v.videoHeight/v.videoWidth));
  scCv.width=W;scCv.height=H;
  const cx=scCv.getContext('2d',{willReadFrequently:true});
  cx.drawImage(v,0,0,W,H);
  const d=cx.getImageData(0,0,W,H).data;
  /* énergie d'arête verticale par colonne */
  const col=new Float32Array(W);
  for(let y=2;y<H-2;y+=2){
    const row=y*W;
    for(let x=1;x<W-1;x++){
      const i=(row+x)*4;
      col[x]+=Math.abs((d[i+4]+d[i+5]+d[i+6])-(d[i-4]+d[i-3]+d[i-2]));
    }
  }
  const s=new Float32Array(W);
  let mean=0;
  for(let x=1;x<W-1;x++){s[x]=(col[x-1]+col[x]*2+col[x+1])/4;mean+=s[x];}
  mean/=(W-2);
  /* bord gauche = pic dans la moitié gauche, bord droit = pic dans la moitié droite */
  let l=0,lv=0,r=W-1,rv=0;
  for(let x=Math.floor(W*.02);x<W*.46;x++)if(s[x]>lv){lv=s[x];l=x;}
  for(let x=Math.ceil(W*.54);x<W*.98;x++)if(s[x]>rv){rv=s[x];r=x;}
  const conf=mean?Math.min(lv,rv)/mean:0;
  const box=document.getElementById('scBox'),msg=document.getElementById('scMsg');
  if(conf>1.8&&r-l>=W*.06){
    scRange={l:l/W,r:(r+1)/W};
    const vw=v.clientWidth,vh=v.clientHeight;
    box.style.display='block';
    box.style.left=(scRange.l*vw)+'px';
    box.style.top='0px';
    box.style.width=((scRange.r-scRange.l)*vw)+'px';
    box.style.height=vh+'px';
    msg.textContent='Tranche repérée ✅ — la photo sera recadrée dessus';
    msg.className='isbnmsg ok';
  }else{
    scRange=null;box.style.display='none';
    msg.textContent='Tiens le livre vertical, tranche centrée, fond contrasté';
    msg.className='isbnmsg';
  }
}
export function spineShoot(){
  const v=document.getElementById('scVideo');
  if(!v.videoWidth)return;
  let sx=0,sw=v.videoWidth;
  if(scRange){
    sx=Math.floor(scRange.l*v.videoWidth);
    sw=Math.max(8,Math.ceil((scRange.r-scRange.l)*v.videoWidth));
  }
  const scale=Math.min(1,640/v.videoHeight);
  const c=document.createElement('canvas');
  c.width=Math.round(sw*scale);c.height=Math.round(v.videoHeight*scale);
  c.getContext('2d').drawImage(v,sx,0,sw,v.videoHeight,0,0,c.width,c.height);
  scDataUrl=c.toDataURL('image/jpeg',0.78);
  document.getElementById('scPreview').src=scDataUrl;
  document.getElementById('scPreviewWrap').classList.remove('hidden');
  document.getElementById('scShot').classList.add('hidden');
  document.getElementById('scMsg').textContent=scRange?'Recadrée sur la tranche repérée ✂️':'Pas de tranche repérée — image entière conservée';
  if(scTimer){clearInterval(scTimer);scTimer=null;}
  v.pause();
  if(navigator.vibrate)navigator.vibrate(60);
}
export function spineRetake(){
  scDataUrl=null;
  document.getElementById('scPreviewWrap').classList.add('hidden');
  document.getElementById('scShot').classList.remove('hidden');
  const v=document.getElementById('scVideo');
  v.play();
  if(!scTimer)scTimer=setInterval(scDetect,350);
}
export async function spineUse(){
  if(!scDataUrl||!scSpineTarget)return;
  scDataUrl=await uploadImage(scDataUrl,'spine');
  {const m=currentBookMeta(scSpineTarget.kind,scSpineTarget.id);contributeSpine(m.titre,m.auteur,m.isbn,scDataUrl);}
  if(scSpineTarget.kind==='form'){
    formImgs.spine=scDataUrl;
    const m=document.getElementById('spMsg');
    if(m){m.textContent='✅ Tranche capturée — sera utilisée à l\'enregistrement';m.className='isbnmsg ok';}
  }else{
    const b=db.books.find(x=>x.id===scSpineTarget.id);
    if(b){b.spine=scDataUrl;save();render();openInfo(b.id);}
  }
  closeSpineCam();
  toast('Tranche enregistrée ✅');
}
export function closeSpineCam(){
  if(scTimer){clearInterval(scTimer);scTimer=null;}
  if(scStream){scStream.getTracks().forEach(t=>t.stop());scStream=null;}
  const v=document.getElementById('scVideo');if(v)v.srcObject=null;
  document.getElementById('spineCamModal').classList.remove('open');
}

