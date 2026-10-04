/* Découvrir (recommandations façon Tinder). */
import {t} from '../core/i18n';
import {icSvg,imgFallback} from '../core/icons';
import {db,save} from '../core/state';
import {esc,toast,uid} from '../core/utils';
import {NV_LANG} from './backup';
import {renderLib} from './library';
import {renderStats} from './stats';

export const discNorm=s=>(s||'').toLowerCase().replace(/[^a-z0-9à-ÿ]/g,'');
export let discCards=[],discLoading=false,discTried=false;
/* Nettoie un nom d'auteur, y compris le format inversé « Nom, Prénom » */
export function discAuthor(a){
  a=(a||'').split(/[,;]/).map(x=>x.trim()).filter(Boolean);
  if(a.length>=2&&a[0].split(' ').length<=2&&a[1].split(' ').length<=2)return a[1]+' '+a[0];
  return a[0]||'';
}
export let discErr='';
export async function discQuery(q,why,ctx,lang){
  try{
    const url='https://www.googleapis.com/books/v1/volumes?q='+encodeURIComponent(q)+
      (lang?'&langRestrict=fr':'')+'&maxResults=15&country=FR';
    const r=await fetch(url);
    if(!r.ok){discErr='Google Books : HTTP '+r.status;return;}
    const d=await r.json();
    (d.items||[]).forEach(it=>{
      const v=it.volumeInfo||{};if(!v.title)return;
      const isbn=(v.industryIdentifiers||[]).map(x=>x.identifier).find(x=>/^97[89]\d{10}$/.test(x))||'';
      const key=isbn||discNorm(v.title);
      if(ctx.seen.has(key)||ctx.have.has(key)||ctx.have.has(discNorm(v.title)))return;
      ctx.seen.add(key);
      ctx.out.push({titre:v.title,auteur:(v.authors||[]).join(', '),pages:v.pageCount||0,
        desc:v.description||'',genre:(v.categories||[])[0]||'',isbn,why,
        langue:NV_LANG[v.language]||v.language||'',
        couverture:((v.imageLinks&&(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail))||'').replace('http://','https://')});
    });
  }catch(e){discErr='Google Books injoignable';}
}
/* Source de secours : Open Library */
export async function discQueryOL(params,why,ctx){
  try{
    const r=await fetch('https://openlibrary.org/search.json?'+params+
      '&fields=title,author_name,number_of_pages_median,cover_i,isbn,language&limit=20');
    if(!r.ok){discErr='Open Library : HTTP '+r.status;return;}
    const d=await r.json();
    (d.docs||[]).forEach(v=>{
      if(!v.title)return;
      const isbn=(v.isbn||[]).find(x=>/^97[89]\d{10}$/.test(x))||'';
      const key=isbn||discNorm(v.title);
      if(ctx.seen.has(key)||ctx.have.has(key)||ctx.have.has(discNorm(v.title)))return;
      ctx.seen.add(key);
      ctx.out.push({titre:v.title,auteur:(v.author_name||[]).join(', '),
        pages:v.number_of_pages_median||0,desc:'',genre:'',isbn,why,langue:'',
        couverture:v.cover_i?('https://covers.openlibrary.org/b/id/'+v.cover_i+'-M.jpg'):''});
    });
  }catch(e){discErr='Open Library injoignable';}
}
export async function discLoad(){
  discLoading=true;discTried=true;discErr='';renderDisc();
  const liked=db.books.filter(b=>b.statut==='done'&&(b.note||0)>=4);
  const base=liked.length?liked:db.books;
  const authors=[...new Set(base.map(b=>discAuthor(b.auteur)).filter(Boolean))].slice(0,6);
  const genres=[...new Set(base.map(b=>b.genre).filter(Boolean))].slice(0,4);
  const queries=[];
  authors.forEach(a=>queries.push({q:'inauthor:"'+a+'"',why:'Parce que tu as aimé '+a}));
  genres.forEach(g=>{
    queries.push({q:'subject:"'+g+'"',why:'Genre que tu adores : '+g});
    queries.push({q:g+' roman',why:'Genre que tu adores : '+g});
  });
  const ctx={out:[],seen:new Set(),have:new Set()};
  db.books.forEach(b=>{if(b.isbn)ctx.have.add(b.isbn);ctx.have.add(discNorm(b.titre));});
  db.discover.rejected.forEach(k=>ctx.have.add(k));
  /* 1er essai : en français */
  await Promise.all(queries.slice(0,12).map(({q,why})=>discQuery(q,why,ctx,true)));
  /* 2e essai : sans restriction de langue */
  if(ctx.out.length<5)
    await Promise.all(queries.slice(0,8).map(({q,why})=>discQuery(q,why,ctx,false)));
  /* 3e essai : requêtes génériques */
  if(ctx.out.length<5)
    await Promise.all([
      discQuery('roman fantasy','Populaire en fantasy',ctx,true),
      discQuery('romantasy','Tendance romantasy',ctx,true),
      discQuery('roman romance new adult','Populaire en romance',ctx,true),
    ]);
  /* 4e essai : Open Library en secours */
  if(ctx.out.length<5){
    await Promise.all(authors.slice(0,4).map(a=>
      discQueryOL('author='+encodeURIComponent(a)+'&language=fre','Parce que tu as aimé '+a,ctx)));
    await Promise.all(genres.slice(0,3).map(g=>
      discQueryOL('subject='+encodeURIComponent(g.toLowerCase())+'&language=fre','Genre que tu adores : '+g,ctx)));
    if(!ctx.out.length)
      await discQueryOL('subject=fantasy&language=fre','Populaire en fantasy',ctx);
  }
  const out=ctx.out;
  for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
  discCards=out.slice(0,40);
  discLoading=false;renderDisc();
}
export function renderDisc(){
  const el=document.getElementById('discWrap');if(!el)return;
  if(discLoading){el.innerHTML=`<div class="empty">${icSvg('crystalball')} Je cherche des livres qui devraient te plaire…</div>`;return;}
  if(!discCards.length){
    el.innerHTML=`<div class="empty"><span class="big">${icSvg('search')}</span>
      ${discTried
        ?'Aucune suggestion trouvée 😕'+(discErr?'<br><span style="font-size:.8rem">Détail : '+esc(discErr)+'</span>':'<br>Vérifie ta connexion et réessaie.')
        :'Des suggestions basées sur tes lectures préférées (auteurs et genres notés ★★★★+).'}<br><br>
      <button class="btn" style="max-width:280px;margin:0 auto" onclick="discLoad()">${discTried?'Réessayer':'Trouver des livres'}</button></div>`;
    return;
  }
  const c=discCards[0];
  el.innerHTML=`
  <div class="disccard" id="discCard">
    ${c.couverture?`<img class="disccover" src="${esc(c.couverture)}" onerror="imgFallback(this,'disccover ph','book')">`:`<div class="disccover ph">${icSvg('book')}</div>`}
    <h3>${esc(c.titre)}</h3>
    <div style="color:var(--txt2);font-size:.9rem;margin-top:3px">${esc(c.auteur)||'—'}</div>
    <div style="color:var(--txt2);font-size:.8rem;margin-top:4px">${c.pages?c.pages+' p.':''}${c.pages&&c.genre?' · ':''}${esc(c.genre)}</div>
    <div class="discwhy">${esc(c.why||'')}</div>
    ${c.desc?`<p class="discdesc">${esc(c.desc.slice(0,320))}${c.desc.length>320?'…':''}</p>`:''}
  </div>
  <div class="discbtns">
    <button class="discno" onclick="discSwipe(false)" title="Pas intéressée">✕</button>
    <button class="discyes" onclick="discSwipe(true)" title="À lire !">♥</button>
  </div>
  <div style="text-align:center;color:var(--txt2);font-size:.75rem;margin-top:10px">
    ${discCards.length} suggestion${discCards.length>1?'s':''} — glisse la carte (→ à lire, ← passer)</div>`;
  attachSwipe(document.getElementById('discCard'));
}
export function discSwipe(like){
  const c=discCards.shift();if(!c)return;
  if(like){
    db.books.push({id:uid(),titre:c.titre,auteur:c.auteur,genre:c.genre,synopsis:c.desc||'',
      langue:c.langue||'Français',pages:c.pages,epaisseur:0,fiction:true,
      format:'papier',statut:'tbr',progression:0,pageActuelle:0,note:0,avis:'',
      isbn:c.isbn,couverture:c.couverture,spine:'',dateFin:'',dateAjout:Date.now()});
    toast('Ajouté à ta pile à lire : '+c.titre+' 📚');
  }else{
    db.discover.rejected.push(c.isbn||discNorm(c.titre));
    if(db.discover.rejected.length>600)db.discover.rejected=db.discover.rejected.slice(-600);
  }
  save();renderLib();renderStats();renderDisc();
  if(!discCards.length)discLoad();
}
export function attachSwipe(card){
  if(!card)return;
  let sx=0,dx=0,active=false;
  const start=e=>{active=true;const t=e.touches?e.touches[0]:e;sx=t.clientX;card.style.transition='none';};
  const move=e=>{
    if(!active)return;
    const t=e.touches?e.touches[0]:e;
    dx=t.clientX-sx;
    card.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;
    card.style.opacity=String(1-Math.min(.5,Math.abs(dx)/320));
  };
  const end=()=>{
    if(!active)return;active=false;
    if(Math.abs(dx)>90){
      const like=dx>0;
      card.style.transition='transform .25s,opacity .25s';
      card.style.transform=`translateX(${like?520:-520}px) rotate(${like?30:-30}deg)`;
      card.style.opacity='0';
      setTimeout(()=>discSwipe(like),240);
    }else{
      card.style.transition='transform .2s,opacity .2s';
      card.style.transform='';card.style.opacity='1';
    }
    dx=0;
  };
  card.addEventListener('touchstart',start,{passive:true});
  card.addEventListener('touchmove',move,{passive:true});
  card.addEventListener('touchend',end);
  card.addEventListener('mousedown',e=>{
    start(e);
    const mm=ev=>move(ev),mu=()=>{end();removeEventListener('mousemove',mm);removeEventListener('mouseup',mu);};
    addEventListener('mousemove',mm);addEventListener('mouseup',mu);
  });
}

