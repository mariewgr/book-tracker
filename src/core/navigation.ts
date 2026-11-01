/* Navigation entre onglets. */
import {t} from './i18n';
import {icSvg} from './icons';
import {render} from '../main';

export let tab='home';
export const TAB_KEYS=['home','lib','shelf','saga','rank','defi','stats','cal','disc','feedback','friends','feed','tandem'];
export const PLUS_TABS=new Set(['saga','rank','defi','stats','disc','feedback','friends','feed','tandem']);
export function switchTab(t){
  tab=t;
  try{sessionStorage.setItem('mabibli_tab',t);}catch(e){}
  document.querySelectorAll('nav button').forEach(b=>
    b.classList.toggle('active',b.dataset.v===t||(b.dataset.v==='plus'&&PLUS_TABS.has(t))));
  TAB_KEYS.forEach(v=>document.getElementById('view-'+v).classList.toggle('hidden',v!==t));
  const fab=document.getElementById('fab');
  fab.classList.toggle('hidden',t!=='lib'&&t!=='shelf');
  const FAB_IC={lib:'book',shelf:'shelf'};
  if(FAB_IC[t])fab.innerHTML=icSvg(FAB_IC[t])+'<span class="plus">+</span>';
  render();
  window.scrollTo(0,0);
}
/* Restaure l'onglet actif après un rechargement (tirer-pour-rafraîchir, etc.) au lieu de
   toujours retomber sur Accueil — mémorisé en sessionStorage, donc valable pour la session
   en cours mais pas pour une toute nouvelle ouverture de l'app. */
export function bootTab(){
  let t;
  try{t=sessionStorage.getItem('mabibli_tab');}catch(e){}
  if(t&&TAB_KEYS.includes(t)&&t!==tab)switchTab(t);else render();
}
export function openPlus(){document.getElementById('plusModal').classList.add('open');}

