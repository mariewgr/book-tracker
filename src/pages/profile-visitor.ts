/* Aperçu visiteur du profil (rendu en lecture seule des sections cochées). */
import {fmt,isUpcoming,thickness} from '../core/book-utils';
import {coverEl,icSvg} from '../core/icons';
import {cacheExternalCover} from '../core/images';
import {db,save} from '../core/state';
import {esc,toast,uid} from '../core/utils';
import {render} from '../main';
import {MILESTONES} from './defi';
import {avatarHTML} from './friends';
import {pfPhotoData,pfSectionsW} from './settings';
import {shelfVisual} from './shelves';

export function bookDataAttr(b){
  return esc(JSON.stringify({
    titre:b.titre||'',auteur:b.auteur||'',couverture:b.couverture||'',genre:b.genre||'',
    pages:b.pages||0,isbn:b.isbn||'',langue:b.langue||'',synopsis:b.synopsis||b.resume||''
  }));
}
export function hstripHTML(books){
  return `<div class="hscroll">${books.map(b=>`<div class="hcard" style="cursor:pointer" data-book="${bookDataAttr(b)}" onclick="openBookPreview(JSON.parse(this.dataset.book))">
    ${coverEl(b.couverture,'')}<span class="nm">${esc(b.titre)}</span><span class="sub">${esc(b.auteur)||''}</span>
  </div>`).join('')}</div>`;
}
export let bookPreviewData=null;
export function openBookPreview(d){
  bookPreviewData=d;
  document.getElementById('bookPreviewBody').innerHTML=`<div style="text-align:center;margin-bottom:14px">
    <div style="display:flex;justify-content:center">${coverEl(d.couverture,'lg')}</div>
    <h2 style="margin:10px 0 2px">${esc(d.titre)}</h2>
    <div style="color:var(--txt2)">${esc(d.auteur)||'—'}</div>
  </div>
  ${(d.genre||d.pages||d.langue)?`<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:10px">
    ${d.genre?`<span class="chip">${esc(d.genre)}</span>`:''}
    ${d.pages?`<span class="chip">${d.pages} pages</span>`:''}
    ${d.langue?`<span class="chip">${esc(d.langue)}</span>`:''}
  </div>`:''}
  ${d.synopsis?`<p style="font-size:.85rem;color:var(--txt2);white-space:pre-wrap">${esc(d.synopsis)}</p>`:''}`;
  document.getElementById('bookPreviewModal').classList.add('open');
}
export function closeBookPreview(){document.getElementById('bookPreviewModal').classList.remove('open');bookPreviewData=null;}
export function addBookFromPreview(){
  const d=bookPreviewData;
  if(!d||!d.titre)return;
  const exists=db.books.some(b=>(b.titre||'').toLowerCase()===d.titre.toLowerCase()&&(b.auteur||'').toLowerCase()===(d.auteur||'').toLowerCase());
  if(exists){toast('Ce livre est déjà dans ta bibliothèque 📚');return;}
  /* Volontairement sans fiche de lecture : ni note, ni avis, ni notes détaillées — ce sont
     des jugements personnels, pas des infos objectives du livre qu'on peut copier de chez
     quelqu'un d'autre. Juste les infos du livre lui-même, en « à lire ». */
  const b={
    id:uid(),titre:d.titre,auteur:d.auteur||'',saga:'',tome:0,synopsis:d.synopsis||'',citations:[],relectures:0,
    isbn:d.isbn||'',couverture:d.couverture||'',spine:'',genre:d.genre||'',langue:d.langue||'',dateParution:'',
    pages:d.pages||0,fiction:true,format:'papier',statut:'tbr',progression:0,pageActuelle:0,note:0,avis:'',
    fmc:'',mmc:'',tropes:'',resume:'',finNote:'',sousNotes:{},smut:0,recommande:null,dateFin:'',dateAjout:Date.now()
  };
  db.books.push(b);
  save();render();
  if(b.couverture)cacheExternalCover(b.id);
  closeBookPreview();
  toast('Ajouté à ta bibliothèque ✅');
}
export function profileSectionHTML(key){
  if(key==='reading'){
    const reading=db.books.filter(b=>b.statut==='reading');
    let h='<h2>📖 En cours de lecture</h2>';
    if(!reading.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucune lecture en cours</div>`;
    reading.forEach(b=>{
      h+=`<div class="book" style="cursor:pointer" data-book="${bookDataAttr(b)}" onclick="openBookPreview(JSON.parse(this.dataset.book))">
        <div class="top">${coverEl(b.couverture,'')}
          <div class="tinfo"><h3>${esc(b.titre)}</h3><div class="auth">${esc(b.auteur)||'—'}</div>
          <div class="meta"><span style="color:var(--accent);font-weight:700">${fmt(b)==='papier'&&b.pages?`p. ${b.pageActuelle||0}/${b.pages}`:(b.progression||0)+' %'}</span></div></div>
        </div>
        <div class="pbar"><div style="width:${b.progression||0}%"></div></div>
      </div>`;
    });
    return h;
  }
  if(key==='stats'){
    const done=db.books.filter(b=>b.statut==='done');
    const pages=done.reduce((s,b)=>s+(b.pages||0),0);
    const noted=done.filter(b=>b.note>0);
    const avg=noted.length?(noted.reduce((s,b)=>s+b.note,0)/noted.length).toFixed(1):'—';
    return `<h2>📊 Statistiques</h2><div class="statgrid">
      <div class="stat"><div class="n">${done.length}</div><div class="l">Livres terminés</div></div>
      <div class="stat"><div class="n">${pages.toLocaleString('fr-FR')}</div><div class="l">Pages lues</div></div>
      <div class="stat"><div class="n">${avg} ★</div><div class="l">Note moyenne</div></div>
    </div>`;
  }
  if(key==='pal'){
    const tbr=db.books.filter(b=>b.statut==='tbr'&&!isUpcoming(b));
    let h=`<h2>📖 Ma PAL (${tbr.length})</h2>`;
    if(!tbr.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucun livre à lire pour l'instant</div>`;
    return h+hstripHTML(tbr);
  }
  if(key==='shelves'){
    let h='<h2>📚 Étagères</h2>';
    if(!db.shelves.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucune étagère</div>`;
    db.shelves.forEach(s=>{
      h+=`<h3 style="margin:14px 2px 8px;font-size:.9rem">${esc(s.nom)}</h3>${shelfVisual(s,true)}`;
    });
    return h;
  }
  if(key==='done'){
    const done=db.books.filter(b=>b.statut==='done');
    let h=`<h2>${icSvg('finished')} Livres terminés (${done.length})</h2>`;
    if(!done.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucun livre terminé pour l'instant</div>`;
    return h+hstripHTML(done);
  }
  if(key==='coups'){
    const coups=db.books.filter(b=>b.statut==='done'&&b.note>=5);
    let h=`<h2>${icSvg('heart')} Coups de cœur (${coups.length})</h2>`;
    if(!coups.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucun coup de cœur pour l'instant</div>`;
    return h+hstripHTML(coups);
  }
  if(key==='badges'){
    const taille=db.settings.taille||165;
    const doneAll=db.books.filter(b=>b.statut==='done');
    const hgt=+doneAll.reduce((s,b)=>s+thickness(b),0).toFixed(1);
    const reached=MILESTONES.map(([e,n,v])=>[e,n,v===null?taille:v]).filter(([,,v])=>hgt>=v);
    let h=`<h2>${icSvg('human')} Badges</h2>`;
    if(!reached.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucun badge débloqué pour l'instant</div>`;
    return h+`<div style="display:flex;flex-wrap:wrap;gap:10px">${reached.map(([e,n])=>
      `<div class="mile reached" style="flex:none"><span class="emo">${e}</span><span class="name">${esc(n)}</span><span class="check">✓</span></div>`
    ).join('')}</div>`;
  }
  return '';
}
export function openProfileVisitor(){
  const p=db.profile,name=(document.getElementById('pf_nom').value||'').trim()||'Sans nom';
  const photo=pfPhotoData||p.photo;
  let out=`<div style="text-align:center;margin-bottom:20px">
    <div style="display:flex;justify-content:center;margin-bottom:10px">${avatarHTML(photo,96)}</div>
    <h2 style="margin:0">${esc(name)}</h2>
    <div style="color:var(--txt2);font-size:.8rem;margin-top:4px">${icSvg('preview')} Aperçu — ce que verrait un·e visiteur·se</div>
  </div>`;
  const sections=pfSectionsW.filter(s=>s.on);
  out+=sections.length?sections.map(s=>profileSectionHTML(s.key)).join(''):'<div class="empty">Rien n\'est encore visible publiquement.<br>Coche au moins une section ci-dessus.</div>';
  document.getElementById('pfVisitorBody').innerHTML=out;
  document.getElementById('profileVisitorModal').classList.add('open');
}
export function closeProfileVisitor(){document.getElementById('profileVisitorModal').classList.remove('open');}

/* ---------- Amis + Fil d'actualité ----------
   Nécessite 3 tables Supabase en plus de "bibli" : bibli_public_profiles (code ami + nom,
   lisible par tous les comptes connectés), bibli_friends (demandes/relations), bibli_feed
   (livres terminés, visibles par soi-même + ami·e·s accepté·e·s via RLS). Voir le script SQL
   fourni pour les créer — sans ces tables, ces fonctions échouent proprement (message d'erreur
   explicite) sans jamais toucher aux données locales. */
