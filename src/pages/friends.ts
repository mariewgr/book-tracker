/* Amis. */
import {t} from '../core/i18n';
import {icSvg} from '../core/icons';
import {db,save} from '../core/state';
import {sbClient,sbUser} from '../core/supabase';
import {askConfirm,esc,toast,uid} from '../core/utils';
import {renderFeed} from './feed';
import {profileSectionHTML} from './profile-visitor';
import {profileField} from './settings';

export function genFriendCode(){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; /* évite 0/O, 1/I/l */
  let s='';for(let i=0;i<6;i++)s+=chars[Math.floor(Math.random()*chars.length)];
  return s;
}
/* Instantané HTML des sections rendues publiques (mêmes cartes en lecture seule que l'aperçu
   visiteur), envoyé au cloud pour que les ami·e·s voient le vrai profil tel que réglé dans
   Profil → « Visible publiquement », pas seulement ses livres terminés. */
export function computeProfileHTML(){
  const order=(db.profile.sectionOrder&&db.profile.sectionOrder.length)?db.profile.sectionOrder:['reading','stats','pal','shelves','done','coups','badges'];
  const on=order.filter(key=>db.profile[profileField(key)]);
  return on.map(profileSectionHTML).join('');
}
export async function syncPublicProfile(){
  const c=await sbClient();
  if(!c||!sbUser||!db.profile.friendCode)return;
  try{
    await c.from('bibli_public_profiles').upsert({
      user_id:sbUser.id,code:db.profile.friendCode,
      nom:db.profile.nom||'',photo:db.profile.photo||'',
      html:computeProfileHTML(),
      updated_at:new Date().toISOString()
    });
  }catch(e){}
}
export async function ensureFriendCode(){
  if(db.profile.friendCode)return db.profile.friendCode;
  db.profile.friendCode=genFriendCode();
  save();
  await syncPublicProfile();
  return db.profile.friendCode;
}
export function copyFriendCode(){
  const code=db.profile.friendCode;
  if(!code)return;
  if(navigator.clipboard)navigator.clipboard.writeText(code).then(()=>toast('Code copié ✅')).catch(()=>toast('Ton code : '+code));
  else toast('Ton code : '+code);
}
export function avatarHTML(photo,size,uid){
  const s=size||32,cur=uid?'cursor:pointer;':'',oc=uid?` onclick="openFriendProfile('${uid}')"`:'';
  if(photo)return `<img src="${esc(photo)}" loading="lazy" style="width:${s}px;height:${s}px;object-fit:cover;border-radius:50%;flex:none;${cur}" onerror="this.outerHTML='<div style=&quot;width:${s}px;height:${s}px;border-radius:50%;background:var(--card2);flex:none;${cur}&quot;></div>'"${oc}>`;
  const isz=Math.round(s*.55);
  return `<div style="width:${s}px;height:${s}px;border-radius:50%;background:var(--card2);display:flex;align-items:center;justify-content:center;flex:none;overflow:hidden;${cur}"${oc}><img src="profile-female.png" alt="" style="width:${isz}px;height:${isz}px;object-fit:contain" onerror="this.outerHTML='<svg class=&quot;icn&quot; style=&quot;width:${isz}px;height:${isz}px;color:var(--txt2)&quot;><use href=&quot;#i-user&quot;/></svg>'"></div>`;
}
export async function openFriendProfile(uid){
  document.getElementById('friendProfileBody').innerHTML='<div class="isbnmsg">Chargement…</div>';
  document.getElementById('friendProfileModal').classList.add('open');
  const c=await sbClient();
  if(!c){document.getElementById('friendProfileBody').innerHTML='<div class="isbnmsg err">Connecte-toi pour voir les profils.</div>';return;}
  try{
    const{data:prof,error}=await c.from('bibli_public_profiles').select('nom,photo,html').eq('user_id',uid).maybeSingle();
    if(error)throw error;
    const nom=(prof&&prof.nom)||'Sans nom',photo=prof&&prof.photo;
    let out=`<div style="text-align:center;margin-bottom:16px">
      <div style="display:flex;justify-content:center">${avatarHTML(photo,88)}</div>
      <h2 style="margin:10px 0 0">${esc(nom)}</h2>
    </div>`;
    out+=(prof&&prof.html)?prof.html:`<div class="empty">${icSvg('empty')} Rien n'est visible publiquement sur ce profil pour l'instant</div>`;
    document.getElementById('friendProfileBody').innerHTML=out;
  }catch(e){
    document.getElementById('friendProfileBody').innerHTML='<div class="isbnmsg err">⚠️ Impossible de charger ce profil — la colonne "html" existe-t-elle sur bibli_public_profiles ? (voir le script SQL fourni)</div>';
  }
}
export function closeFriendProfile(){document.getElementById('friendProfileModal').classList.remove('open');}
export let friendsLoadedOnce=false;
export async function renderFriends(){
  const el=document.getElementById('friendCodeDisplay');
  const msg=document.getElementById('friendsSyncMsg');
  /* Marqueur de chargement seulement au tout premier affichage, pas à chaque nouvel appel
     (accepter/refuser/retirer un·e ami·e, mise à jour temps réel…) — même principe que
     renderFeed(), sinon la liste clignote en blanc à chaque action. */
  if(!friendsLoadedOnce)document.getElementById('friendsListEl').innerHTML='<div class="empty" style="padding:24px 10px"><span style="display:inline-block;animation:ptrspin .7s linear infinite">'+icSvg('loading')+'</span><br>Chargement…</div>';
  friendsLoadedOnce=true;
  const c=await sbClient();
  if(!c||!sbUser){
    el.textContent='------';
    msg.className='isbnmsg err';
    msg.textContent='⚠️ Connecte-toi (compte cloud, voir ⚙️) pour utiliser les amis.';
    ['friendRequestsIn','friendRequestsOut','friendsListEl'].forEach(id=>document.getElementById(id).innerHTML='');
    return;
  }
  msg.textContent='';msg.className='isbnmsg';
  el.textContent=await ensureFriendCode();
  try{
    const {data:rows,error}=await c.from('bibli_friends').select('*').or('user_id.eq.'+sbUser.id+',friend_id.eq.'+sbUser.id);
    if(error)throw error;
    const ids=new Set();
    rows.forEach(r=>{ids.add(r.user_id);ids.add(r.friend_id);});
    ids.delete(sbUser.id);
    const profiles={};
    if(ids.size){
      const {data:profs}=await c.from('bibli_public_profiles').select('user_id,nom,photo,code').in('user_id',[...ids]);
      (profs||[]).forEach(p=>profiles[p.user_id]=p);
    }
    const nameOf=uid=>(profiles[uid]&&profiles[uid].nom)||'Sans nom';
    const photoOf=uid=>profiles[uid]&&profiles[uid].photo;
    const incoming=rows.filter(r=>r.friend_id===sbUser.id&&r.status==='pending');
    const outgoing=rows.filter(r=>r.user_id===sbUser.id&&r.status==='pending');
    const accepted=rows.filter(r=>r.status==='accepted');
    document.getElementById('friendRequestsIn').innerHTML=incoming.length?('<h2>Demandes reçues</h2>'+incoming.map(r=>
      `<div class="sitem">${avatarHTML(photoOf(r.user_id),32,r.user_id)}<span class="nm" style="cursor:pointer" onclick="openFriendProfile('${r.user_id}')">${esc(nameOf(r.user_id))}</span>
        <button style="color:var(--green)" onclick="acceptFriendRequest('${r.id}')">✓ Accepter</button>
        <button style="color:var(--red)" onclick="declineFriendRequest('${r.id}')">✕</button></div>`
    ).join('')):'';
    document.getElementById('friendRequestsOut').innerHTML=outgoing.length?('<h2>Demandes envoyées</h2>'+outgoing.map(r=>
      `<div class="sitem">${avatarHTML(photoOf(r.friend_id),32,r.friend_id)}<span class="nm" style="cursor:pointer" onclick="openFriendProfile('${r.friend_id}')">${esc(nameOf(r.friend_id))}</span><span class="h">En attente…</span>
        <button style="color:var(--red)" onclick="cancelFriendRequest('${r.id}')">✕</button></div>`
    ).join('')):'';
    document.getElementById('friendsListEl').innerHTML=accepted.length?accepted.map(r=>{
      const otherId=r.user_id===sbUser.id?r.friend_id:r.user_id;
      return `<div class="sitem">${avatarHTML(photoOf(otherId),32,otherId)}<span class="nm" style="cursor:pointer" onclick="openFriendProfile('${otherId}')">${esc(nameOf(otherId))}</span>
        <button style="color:var(--red)" onclick="removeFriend('${r.id}')">✕</button></div>`;
    }).join(''):'<div class="isbnmsg">Aucun·e ami·e pour l\'instant — partage ton code ci-dessus !</div>';
  }catch(e){
    msg.className='isbnmsg err';
    msg.textContent='⚠️ Impossible de charger tes amis — la table bibli_friends existe-t-elle ? (voir le script SQL fourni)';
  }
}
export async function sendFriendRequest(){
  const code=document.getElementById('friendCodeInput').value.trim().toUpperCase();
  const msg=document.getElementById('friendAddMsg');
  msg.className='isbnmsg';msg.textContent='';
  if(code.length!==6){msg.className='isbnmsg err';msg.textContent='Le code fait 6 caractères.';return;}
  const c=await sbClient();
  if(!c||!sbUser){msg.className='isbnmsg err';msg.textContent="Connecte-toi d'abord.";return;}
  try{
    const {data:found,error}=await c.from('bibli_public_profiles').select('user_id,nom').eq('code',code).maybeSingle();
    if(error)throw error;
    if(!found){msg.className='isbnmsg err';msg.textContent='Aucun compte avec ce code 😕';return;}
    if(found.user_id===sbUser.id){msg.className='isbnmsg err';msg.textContent="C'est ton propre code 😉";return;}
    const {error:insErr}=await c.from('bibli_friends').insert({user_id:sbUser.id,friend_id:found.user_id,status:'pending'});
    if(insErr){
      if(insErr.code==='23505'){msg.className='isbnmsg err';msg.textContent='Demande déjà envoyée (ou déjà ami·e·s).';}
      else throw insErr;
    }else{
      msg.className='isbnmsg ok';
      msg.textContent='Demande envoyée à '+(found.nom||'ce compte')+' ✅';
      document.getElementById('friendCodeInput').value='';
    }
    renderFriends();
  }catch(e){msg.className='isbnmsg err';msg.textContent='Erreur réseau — réessaie.';}
}
export async function acceptFriendRequest(id){
  const c=await sbClient();if(!c)return;
  await c.from('bibli_friends').update({status:'accepted'}).eq('id',id);
  renderFriends();
  toast('Ami·e ajouté·e ✅');
}
export async function declineFriendRequest(id){
  const c=await sbClient();if(!c)return;
  await c.from('bibli_friends').delete().eq('id',id);
  renderFriends();
}
export async function cancelFriendRequest(id){
  const c=await sbClient();if(!c)return;
  await c.from('bibli_friends').delete().eq('id',id);
  renderFriends();
}
export function removeFriend(id){
  askConfirm("Retirer cet·te ami·e ? Ses livres terminés n'apparaîtront plus dans ton fil.",async()=>{
    const c=await sbClient();if(!c)return;
    await c.from('bibli_friends').delete().eq('id',id);
    renderFriends();
  },'Retirer');
}
