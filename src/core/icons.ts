/* Système d'icônes personnalisées (PNG avec repli SVG). */
import {esc} from './utils';

export const IC_FILES={
  book:'book.png',shelf:'shelf.png',trophy:'rank.png',
  chart:'stats.png',calendar:'calendar.png',refresh:'refresh.png',gear:'settings.png',
  search:'search.png',pencil:'modify.png',tablet:'numeric.png',headphones:'audio.png',
  tag:'book_types.png','book-open':'paper.png',paper:'paper.png',
  pile:'book_pile.png',human:'human.png',camera:'photo.png',image:'image.png',saga:'saga.png',
  user:'profile-female.png',friends:'friends.png',feed:'feed.png',mail:'mail.png',lock:'lock.png',unlock:'unlock.png',
  recap:'recap.png',retry:'retry.png',sun:'sun.png',moon:'moon.png',rogner:'rogner.png',
  check:'check.png',import:'import.png',export:'export.png',web:'web.png',preview:'preview.png',
  thumbsup:'thumbsup.png',thumbsdown:'thumbsdown.png',comment:'comment.png',copy:'copy.png',
  badge:'badge.png',heart:'heart.png',add:'add.png',send:'send.png',delete:'delete.png',
  target:'target.png',streak:'streak.png',offline:'offline.png',empty:'empty.png',
  finished:'finished.png',summary:'summary.png',cat:'cat.png',dog:'dog.png',panda:'panda.png',
  soon:'soon.png',clock:'clock.png',crystalball:'crystalball.png',
  flamingo:'flamingo.png',giraffe:'giraffe.png',warning:'warning.png',
  loading:'loading.png',sync:'sync.png'
};
export const icSvg=n=>IC_FILES[n]
  ?'<img class="icn icimg" src="'+IC_FILES[n]+'" alt="" onerror="this.outerHTML=\'<svg class=&quot;icn&quot;><use href=&quot;#i-'+n+'&quot;/></svg>\'">'
  :'<svg class="icn"><use href="#i-'+n+'"/></svg>';
/* Icônes personnalisées : fichiers PNG individuels à côté d'index.html.
   Chaque icône marquée data-spr est remplacée si son fichier existe,
   sinon l'icône SVG d'origine reste affichée. */
export const SPR_FILES={
  book:'book.png',shelf:'shelf.png',trophy:'rank.png',
  pile:'book_pile.png',chart:'stats.png',calendar:'calendar.png',
  refresh:'refresh.png',gear:'settings.png',
  paper:'paper.png',tablet:'numeric.png',headphones:'audio.png',
  human:'human.png',search:'search.png',pencil:'modify.png',camera:'photo.png',image:'image.png',home:'home.png',tag:'book_types.png',saga:'saga.png',
  user:'profile-female.png',friends:'friends.png',feed:'feed.png',mail:'mail.png',lock:'lock.png',unlock:'unlock.png',
  recap:'recap.png',retry:'retry.png',sun:'sun.png',moon:'moon.png',rogner:'rogner.png',
  check:'check.png',import:'import.png',export:'export.png',web:'web.png',preview:'preview.png',
  thumbsup:'thumbsup.png',thumbsdown:'thumbsdown.png',comment:'comment.png',copy:'copy.png',
  badge:'badge.png',heart:'heart.png',add:'add.png',send:'send.png',delete:'delete.png',
  target:'target.png',streak:'streak.png',offline:'offline.png',empty:'empty.png',
  finished:'finished.png',summary:'summary.png',cat:'cat.png',dog:'dog.png',panda:'panda.png',
  soon:'soon.png',clock:'clock.png',crystalball:'crystalball.png',
  loading:'loading.png',sync:'sync.png'
};
export function applySpr(root){
  (root||document).querySelectorAll('[data-spr]').forEach(el=>{
    const f=SPR_FILES[el.dataset.spr];if(!f)return;
    const px=+el.dataset.sprSize||22;
    const im=new Image();
    im.onload=()=>{
      im.className='sprimg';
      im.style.height=px+'px';im.style.width='auto';
      el.innerHTML='';el.appendChild(im);
    };
    im.src=f;
  });
}
applySpr();
export function imgFallback(el,cls,n){
  const d=document.createElement('div');
  d.className=cls;d.innerHTML=icSvg(n);
  el.replaceWith(d);
}
export function coverEl(url,cls,icon){
  const c='cover '+(cls||'');
  if(!url)return `<div class="${c} ph">${icSvg(icon||'book')}</div>`;
  return `<img class="${c}" src="${esc(url)}" loading="lazy" alt=""
    onerror="imgFallback(this,'${c} ph','${icon||'book'}')">`;
}

/* Épaisseur toujours automatique : ~0,006 cm/page + couverture */
