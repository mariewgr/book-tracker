/* Fil d'actualité + posts. */
import {fmtDateFr} from '../core/book-utils';
import {t} from '../core/i18n';
import {coverEl,icSvg} from '../core/icons';
import {setImgTarget} from '../core/images';
import {db} from '../core/state';
import {sbClient,sbUser} from '../core/supabase';
import {askConfirm,esc,toast,uid} from '../core/utils';
import {avatarHTML,openFriendProfile} from './friends';
import {bookMatch} from './library';
import {bookDataAttr,openBookPreview} from './profile-visitor';

export const REACTION_EMOJIS=['👍','❤️','😂','😮','😢'];
export let feedLoadedOnce=false;
export async function renderFeed(){
  const el=document.getElementById('feedListEl');
  /* Marqueur de chargement seulement au tout premier affichage du fil (chargement souvent
     lent) — pas à chaque rafraîchissement temps réel (nouveau commentaire/réaction d'un·e
     ami·e) ni après une action locale, sinon le fil clignote en blanc à chaque fois. */
  if(!feedLoadedOnce)el.innerHTML='<div class="empty" style="padding:24px 10px"><span style="display:inline-block;animation:ptrspin .7s linear infinite">'+icSvg('loading')+'</span><br>Chargement du fil…</div>';
  feedLoadedOnce=true;
  const c=await sbClient();
  if(!c||!sbUser){el.innerHTML='<div class="isbnmsg">Connecte-toi (compte cloud, voir ⚙️) pour voir le fil de tes amis.</div>';return;}
  let feedRows=[];
  try{
    const {data,error}=await c.from('bibli_feed').select('*')
      .order('date_fin',{ascending:false,nullsFirst:false}).order('updated_at',{ascending:false}).limit(60);
    if(error)throw error;
    feedRows=data||[];
  }catch(e){
    el.innerHTML='<div class="isbnmsg err">⚠️ Impossible de charger le fil — la table bibli_feed existe-t-elle ? (voir le script SQL fourni)</div>';
    return;
  }
  /* Posts/commentaires/réactions : fonctionnalité additive — si les tables n'existent
     pas encore (SQL pas encore lancé), le fil des livres terminés reste affiché normalement. */
  let postRows=[],comments=[],reactions=[];
  try{
    const {data:posts,error:pe}=await c.from('bibli_posts').select('*').order('created_at',{ascending:false}).limit(60);
    if(pe)throw pe;
    postRows=posts||[];
    const postIds=postRows.map(p=>p.id);
    if(postIds.length){
      const[{data:cs},{data:rs}]=await Promise.all([
        c.from('bibli_comments').select('*').in('post_id',postIds).order('created_at',{ascending:true}),
        c.from('bibli_reactions').select('*').in('post_id',postIds)
      ]);
      comments=cs||[];reactions=rs||[];
    }
  }catch(e){}
  if(!feedRows.length&&!postRows.length){el.innerHTML="<div class=\"empty\">Rien à afficher pour l'instant.<br>Ajoute des ami·e·s, poste quelque chose, ou synchronise tes livres terminés ci-dessus.</div>";return;}
  const ids=new Set();
  feedRows.forEach(r=>ids.add(r.user_id));
  postRows.forEach(r=>ids.add(r.user_id));
  comments.forEach(r=>ids.add(r.user_id));
  const profiles={};
  if(ids.size){
    const {data:profs}=await c.from('bibli_public_profiles').select('user_id,nom,photo').in('user_id',[...ids]);
    (profs||[]).forEach(p=>profiles[p.user_id]=p);
  }
  const nameOf=uid=>uid===sbUser.id?'Toi':((profiles[uid]&&profiles[uid].nom)||'Un·e ami·e');
  const photoOf=uid=>profiles[uid]&&profiles[uid].photo;
  const items=[
    ...feedRows.map(r=>({type:'book',date:r.date_fin||r.updated_at,data:r})),
    ...postRows.map(r=>({type:'post',date:r.created_at,data:r}))
  ].sort((a,b)=>new Date(b.date)-new Date(a.date));
  el.innerHTML=items.map(it=>{
    if(it.type==='book'){
      const r=it.data,isMe=r.user_id===sbUser.id;
      return `<div class="book" style="cursor:pointer" data-book="${bookDataAttr(r)}" onclick="openBookPreview(JSON.parse(this.dataset.book))">
        <div class="top">${coverEl(r.couverture,'')}
          <div class="tinfo"><h3>${esc(r.titre)}</h3><div class="auth">${esc(r.auteur)||'—'}</div>
          <div class="meta"><span style="font-weight:700;color:${isMe?'var(--accent)':'var(--txt2)'}">${esc(nameOf(r.user_id))}</span>${r.note?` <span class="stars">${'★'.repeat(r.note)}</span>`:''}</div></div>
        </div>
        ${r.date_fin?`<div style="font-size:.75rem;color:var(--txt2);margin-top:4px">Terminé le ${fmtDateFr(r.date_fin)}</div>`:''}
      </div>`;
    }
    const p=it.data;
    const postReactions=reactions.filter(r=>r.post_id===p.id);
    const grouped={};
    postReactions.forEach(r=>{grouped[r.emoji]=(grouped[r.emoji]||0)+1;});
    const mine=new Set(postReactions.filter(r=>r.user_id===sbUser.id).map(r=>r.emoji));
    const postComments=comments.filter(cm=>cm.post_id===p.id);
    return `<div class="book" style="cursor:default">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        ${avatarHTML(photoOf(p.user_id),32,p.user_id)}
        <div style="cursor:pointer" onclick="openFriendProfile('${p.user_id}')"><div style="font-weight:700;font-size:.85rem">${esc(nameOf(p.user_id))}</div>
        <div style="font-size:.7rem;color:var(--txt2)">${fmtDateFr((p.created_at||'').slice(0,10))}</div></div>
      </div>
      ${p.book_titre?`<div style="display:flex;gap:8px;align-items:center;background:var(--card2);border-radius:10px;padding:6px;margin-bottom:8px;cursor:pointer" data-book="${bookDataAttr({titre:p.book_titre,auteur:p.book_auteur,couverture:p.book_couverture})}" onclick="openBookPreview(JSON.parse(this.dataset.book))">
        ${coverEl(p.book_couverture,'')}<div style="font-size:.8rem;font-weight:700">${esc(p.book_titre)}${p.book_auteur?`<div style="font-weight:400;color:var(--txt2);font-size:.72rem">${esc(p.book_auteur)}</div>`:''}</div>
      </div>`:''}
      ${p.texte?`<div style="white-space:pre-wrap;font-size:.88rem;margin-bottom:8px">${esc(p.texte)}</div>`:''}
      ${(p.photos&&p.photos.length)?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${p.photos.map(u=>`<img src="${esc(u)}" loading="lazy" style="width:90px;height:90px;object-fit:cover;border-radius:8px">`).join('')}</div>`:''}
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:6px">
        ${REACTION_EMOJIS.map(em=>`<button class="smallbtn" style="${mine.has(em)?'border-color:var(--accent);color:var(--accent)':''}" onclick="toggleReaction('${p.id}','${em}')">${em}${grouped[em]?' '+grouped[em]:''}</button>`).join('')}
        <button class="smallbtn" onclick="toggleComments('${p.id}')">💬 ${postComments.length||''} Commentaire${postComments.length>1?'s':''}</button>
        ${p.user_id===sbUser.id?`<button class="smallbtn" style="color:var(--red)" onclick="deletePost('${p.id}')">${icSvg('delete')}</button>`:''}
      </div>
      <div id="comments-${p.id}" class="hidden">
        ${postComments.map(cm=>`<div class="sitem">${avatarHTML(photoOf(cm.user_id),24)}<span class="nm"><b>${esc(nameOf(cm.user_id))}</b> ${esc(cm.texte)}</span></div>`).join('')}
        <div class="isbnrow"><input id="cinput-${p.id}" placeholder="Écrire un commentaire…" onkeydown="if(event.key==='Enter'){event.preventDefault();addComment('${p.id}');}">
        <button class="btn" style="width:auto;margin-top:0;flex:none;padding:0 14px" onclick="addComment('${p.id}')">${icSvg('send')}</button></div>
      </div>
    </div>`;
  }).join('');
}
export function toggleComments(postId){
  const el=document.getElementById('comments-'+postId);
  if(el)el.classList.toggle('hidden');
}
export async function addComment(postId){
  const inp=document.getElementById('cinput-'+postId);
  const texte=(inp&&inp.value||'').trim();
  if(!texte)return;
  const c=await sbClient();
  if(!c||!sbUser)return;
  try{
    await c.from('bibli_comments').insert({post_id:postId,user_id:sbUser.id,texte});
    if(inp)inp.value='';
    renderFeed();
  }catch(e){toast("⚠️ Impossible d'envoyer le commentaire");}
}
export async function toggleReaction(postId,emoji){
  const c=await sbClient();
  if(!c||!sbUser)return;
  try{
    const {data:existing}=await c.from('bibli_reactions').select('id').eq('post_id',postId).eq('user_id',sbUser.id).eq('emoji',emoji).maybeSingle();
    if(existing)await c.from('bibli_reactions').delete().eq('id',existing.id);
    else await c.from('bibli_reactions').insert({post_id:postId,user_id:sbUser.id,emoji});
    renderFeed();
  }catch(e){}
}
export function deletePost(id){
  askConfirm('Supprimer ce post ?',async()=>{
    const c=await sbClient();if(!c)return;
    await c.from('bibli_posts').delete().eq('id',id);
    renderFeed();
  },'Supprimer');
}
export let pcPhotos=[];
export let pcBookId='';
export function openPostCompose(){
  const c1=document.getElementById('postComposeModal');
  if(!sbUser){toast('Connecte-toi (compte cloud, voir ⚙️) pour publier');return;}
  pcPhotos=[];pcBookId='';
  document.getElementById('pc_texte').value='';
  document.getElementById('pc_photos').innerHTML='';
  const msg=document.getElementById('pc_msg');msg.textContent='';msg.className='isbnmsg';
  document.getElementById('pc_bookSearch').value='';
  document.getElementById('pc_bookResults').innerHTML='';
  renderPcBookChip();
  c1.classList.add('open');
}
export function closePostCompose(){document.getElementById('postComposeModal').classList.remove('open');}
export function renderPcBookChip(){
  const el=document.getElementById('pc_bookChip');
  const b=pcBookId&&db.books.find(x=>x.id===pcBookId);
  if(!b){pcBookId='';el.innerHTML='';return;}
  el.innerHTML=`<div class="sitem">${coverEl(b.couverture,'sm')}<span class="nm">${esc(b.titre)}${b.auteur?' — '+esc(b.auteur):''}</span>
    <button type="button" onclick="clearPcBook()">✕</button></div>`;
}
export function clearPcBook(){pcBookId='';renderPcBookChip();}
export function pcPickBook(id){
  pcBookId=id;
  document.getElementById('pc_bookSearch').value='';
  document.getElementById('pc_bookResults').innerHTML='';
  renderPcBookChip();
}
export function renderPcBookResults(){
  const q=document.getElementById('pc_bookSearch').value.toLowerCase().trim();
  const el=document.getElementById('pc_bookResults');
  if(!q){el.innerHTML='';return;}
  const list=db.books.filter(b=>bookMatch(b,q)).slice(0,8);
  el.innerHTML=list.length?list.map(b=>
    `<div class="sitem" style="cursor:pointer" onclick="pcPickBook('${b.id}')">${coverEl(b.couverture,'sm')}<span class="nm">${esc(b.titre)}${b.auteur?' — '+esc(b.auteur):''}</span></div>`
  ).join(''):'<div class="isbnmsg">Aucun résultat.</div>';
}
export function pickPostPhoto(camera){
  setImgTarget({id:null,field:'postphoto',kind:'postcompose'});
  const inp=document.getElementById('imgPick');
  if(camera)inp.setAttribute('capture','environment');else inp.removeAttribute('capture');
  inp.click();
}
export function renderPcPhotos(){
  document.getElementById('pc_photos').innerHTML=pcPhotos.map((u,i)=>
    `<div style="position:relative"><img src="${esc(u)}" style="width:70px;height:70px;object-fit:cover;border-radius:8px">
      <button type="button" onclick="pcPhotos.splice(${i},1);renderPcPhotos()" style="position:absolute;top:-6px;right:-6px;background:var(--red);color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:.7rem;line-height:1;cursor:pointer">✕</button>
    </div>`).join('');
}
export async function submitPost(){
  const texte=document.getElementById('pc_texte').value.trim();
  const bookId=pcBookId;
  const msg=document.getElementById('pc_msg');
  if(!texte&&!pcPhotos.length&&!bookId){msg.className='isbnmsg err';msg.textContent='Ajoute au moins un texte, une photo ou un livre.';return;}
  const c=await sbClient();
  if(!c||!sbUser){msg.className='isbnmsg err';msg.textContent="Connecte-toi d'abord.";return;}
  const b=bookId?db.books.find(x=>x.id===bookId):null;
  try{
    const {error}=await c.from('bibli_posts').insert({
      user_id:sbUser.id,
      book_id:bookId||'',book_titre:(b&&b.titre)||'',book_auteur:(b&&b.auteur)||'',book_couverture:(b&&b.couverture)||'',
      texte,photos:pcPhotos
    });
    if(error)throw error;
    closePostCompose();
    toast('Post publié ✅');
    renderFeed();
  }catch(e){
    msg.className='isbnmsg err';
    msg.textContent='⚠️ Impossible de publier — la table bibli_posts existe-t-elle ? (voir le script SQL fourni)';
  }
}
export async function syncFeedForBook(b){
  const c=await sbClient();
  if(!c||!sbUser)return;
  try{
    if(b.statut==='done'){
      await c.from('bibli_feed').upsert({user_id:sbUser.id,book_id:b.id,titre:b.titre,auteur:b.auteur||'',
        couverture:b.couverture||'',note:b.note||null,date_fin:b.dateFin||null,updated_at:new Date().toISOString()});
    }else{
      await c.from('bibli_feed').delete().eq('user_id',sbUser.id).eq('book_id',b.id);
    }
  }catch(e){}
}
export async function backfillFeed(){
  const c=await sbClient();
  if(!c||!sbUser){toast("Connecte-toi d'abord");return;}
  const done=db.books.filter(b=>b.statut==='done');
  if(!done.length){toast('Aucun livre terminé à synchroniser');return;}
  toast('Synchronisation de '+done.length+' livre(s)…');
  for(const b of done)await syncFeedForBook(b);
  toast('Synchronisation terminée ✅');
  renderFeed();
}
