/* Session Supabase, synchronisation cloud temps réel, auth. */
import {LANG_FIX,t} from './i18n';
import {bootTab,tab} from './navigation';
import {db,normalizeDb,save,saveLocal,setDb} from './state';
import {closeModals,toast} from './utils';
import {loadLocalData,render} from '../main';
import {renderAuthMode,showResetScreen} from '../pages/auth';
import {renderFeed} from '../pages/feed';
import {renderFriends,syncPublicProfile} from '../pages/friends';
import {filter} from '../pages/library';
import {saveProfile} from '../pages/settings';

export const SBKEY='mabibli_sb';
/* Valeurs par défaut du projet Supabase (clé publique — protégée par RLS) */
export let sbCfg={url:'https://nfyxidwrpzeiasxdwnhn.supabase.co',key:'sb_publishable_z5wPhdz64pl4KGXHTj0T7w_rd7TwSf5'};
try{sbCfg={...sbCfg,...JSON.parse(localStorage.getItem(SBKEY)||'{}')};}catch(e){}
if(!sbCfg.url)sbCfg.url='https://nfyxidwrpzeiasxdwnhn.supabase.co';
if(!sbCfg.key)sbCfg.key='sb_publishable_z5wPhdz64pl4KGXHTj0T7w_rd7TwSf5';
export let sb=null,sbUser=null,sbChannel=null,sbSocialChannel=null;
export function setSyncStatus(t){const e=document.getElementById('syncStatus');if(e)e.textContent=t;}
export function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
/* Empêche un appel réseau bloqué (hors ligne) de figer l'app indéfiniment */
export function withTimeout(promise,ms){
  return Promise.race([
    promise,
    new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))
  ]);
}
export async function sbClient(){
  if(sb)return sb;
  if(!sbCfg.url||!sbCfg.key)return null;
  if(!window.supabase)await withTimeout(loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'),8000);
  sb=window.supabase.createClient(sbCfg.url,sbCfg.key);
  return sb;
}
/* ---------- Hors ligne : bascule automatique sur les données locales ---------- */
export function setOfflineBadge(on){
  const b=document.getElementById('offlineBadge');if(b)b.classList.toggle('hidden',!on);
}
export async function offlineFallback(){
  await loadLocalData();
  setOfflineBadge(true);
  if(db.books&&db.books.length){
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('appRoot').classList.remove('hidden');
    bootTab();
  }else{
    document.getElementById('authSub').textContent="Impossible de joindre le serveur (hors ligne ?). Reconnecte-toi au réseau pour te connecter la première fois sur cet appareil.";
  }
}
window.addEventListener('offline',()=>{
  setOfflineBadge(true);
  if(sbUser)toast('Hors ligne — tes modifications seront synchronisées au retour du réseau');
});
window.addEventListener('online',async()=>{
  toast('🔌 Connexion rétablie…');
  if(sbUser){
    setOfflineBadge(false);
    doPush();
    pullCloud(true).catch(()=>{});
  }else{
    /* on était en mode hors ligne dès le départ : retente la connexion complète */
    initAuth();
  }
});
/* ---------- Écran de connexion (page dédiée, plein écran) ---------- */
export async function handleSession(session){
  if(session&&session.user){
    sbUser=session.user;
    setOfflineBadge(false);
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('appRoot').classList.remove('hidden');
    document.getElementById('authError').textContent='';
    await loadLocalData();
    bootTab();
    startCloud();
  }else{
    sbUser=null;
    document.getElementById('appRoot').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
  }
}
export async function initAuth(){
  renderAuthMode();
  if(!navigator.onLine){await offlineFallback();return;}
  let c;
  try{
    c=await withTimeout(sbClient(),8000);
  }catch(e){await offlineFallback();return;}
  if(!c){
    document.getElementById('authSub').textContent="Configuration Supabase manquante — vérifie sbCfg dans le code (index.html).";
    document.getElementById('authSubmitBtn').disabled=true;
    return;
  }
  /* Seule source de vérité pour l'état de connexion : onAuthStateChange (dont l'évènement
     INITIAL_SESSION, émis une fois au démarrage). Un second appel manuel à getSession() ici
     entrerait en compétition avec PASSWORD_RECOVERY et pouvait écraser l'écran de nouveau
     mot de passe avant que l'utilisateur ait fini de le remplir. */
  /* Si l'URL contient un lien de récupération, on ignore les évènements de session "normaux"
     (ex : INITIAL_SESSION avec une session déjà ouverte sur cet appareil) le temps que
     PASSWORD_RECOVERY arrive — sinon un compte déjà connecté ouvrait directement l'app au lieu
     de proposer le nouveau mot de passe. Filet de sécurité : si ça ne arrive jamais (lien expiré/
     déjà utilisé), on abandonne après quelques secondes pour ne pas bloquer la connexion normale. */
  let recoveryPending=/type=recovery/.test(location.hash)||/type=recovery/.test(location.search);
  /* Une fois le lien traité (avec succès ou non), on nettoie l'URL : sinon le marqueur
     "type=recovery" reste dans la barre d'adresse et refait déclencher ce blocage à CHAQUE
     rechargement suivant (tirer-pour-rafraîchir compris) — avec un lien à usage unique déjà
     consommé, ce qui pouvait empêcher la vraie session de se réafficher. */
  function clearRecoveryMarker(){
    if(!recoveryPending)return;
    recoveryPending=false;
    try{history.replaceState(null,'',location.pathname);}catch(e){}
  }
  if(recoveryPending)setTimeout(()=>{
    if(!recoveryPending)return;
    clearRecoveryMarker();
    c.auth.getSession().then(({data})=>handleSession(data.session));
  },5000);
  c.auth.onAuthStateChange((event,session)=>{
    if(event==='PASSWORD_RECOVERY'){clearRecoveryMarker();showResetScreen();return;}
    if(recoveryPending)return;
    handleSession(session);
  });
  try{
    await withTimeout(c.auth.getSession(),8000);
  }catch(e){
    await offlineFallback();
  }
}
export async function pullCloud(notify){
  const c=await sbClient();if(!c||!sbUser)return 'none';
  const {data:row,error}=await c.from('bibli').select('data').eq('user_id',sbUser.id).maybeSingle();
  if(error)throw error;
  const remote=row&&row.data;
  const rT=(remote&&remote.meta&&remote.meta.updatedAt)||0;
  const lT=(db.meta&&db.meta.updatedAt)||0;
  if(remote&&remote.books&&rT>lT){
    /* Garde-fou symétrique à sbPush() : le cloud est "plus récent" mais vide alors qu'on a des
       livres en local — plutôt qu'adopter (et donc effacer localement), on traite ça comme
       localNewer, ce qui redéclenche un push et répare le cloud depuis cet appareil. */
    if(!remote.books.length&&db.books.length)return 'localNewer';
    const needsLangFix=remote.books.some(b=>LANG_FIX[b.langue]);
    setDb(normalizeDb(remote));
    if(needsLangFix)save();else saveLocal();
    render();
    if(notify)toast('Données mises à jour depuis le cloud ✅ ('+db.books.length+' livres)');
    return 'adopted';
  }
  return !remote?'none':(lT>rT?'localNewer':'same');
}
export async function startCloud(){
  setSyncStatus('⏳ Récupération…');
  try{
    const st=await pullCloud(true);
    if(st==='none'||st==='localNewer')await sbPush();
    const c=await sbClient();
    if(sbChannel)c.removeChannel(sbChannel);
    /* temps réel : une modif sur un autre appareil arrive instantanément */
    sbChannel=c.channel('bibli-sync').on('postgres_changes',
      {event:'*',schema:'public',table:'bibli',filter:'user_id=eq.'+sbUser.id},
      ()=>{pullCloud(true).catch(()=>{});}
    ).subscribe();
    if(sbSocialChannel)c.removeChannel(sbSocialChannel);
    /* temps réel : amis, fil d'actualité, posts, commentaires, réactions — arrivent
       en direct sans avoir à retirer pour rafraîchir. Ne redessine que si l'onglet
       concerné est affiché (inutile de recharger un fil qu'on ne regarde pas). */
    sbSocialChannel=c.channel('bibli-social')
      .on('postgres_changes',{event:'*',schema:'public',table:'bibli_friends'},()=>{if(tab==='friends')renderFriends();})
      .on('postgres_changes',{event:'*',schema:'public',table:'bibli_feed'},()=>{if(tab==='feed')scheduleRenderFeed();})
      .on('postgres_changes',{event:'*',schema:'public',table:'bibli_posts'},()=>{if(tab==='feed')scheduleRenderFeed();})
      .on('postgres_changes',{event:'*',schema:'public',table:'bibli_comments'},()=>{if(tab==='feed')scheduleRenderFeed();})
      .on('postgres_changes',{event:'*',schema:'public',table:'bibli_reactions'},()=>{if(tab==='feed')scheduleRenderFeed();})
      .subscribe();
    setSyncStatus('✅ Connectée ('+(sbUser.email||'')+') — sync temps réel active');
  }catch(e){setSyncStatus('⚠️ Erreur BDD — la table « bibli » est-elle créée ? (voir guide §3)');}
}
export let renderFeedTimer=null;
export function scheduleRenderFeed(){clearTimeout(renderFeedTimer);renderFeedTimer=setTimeout(()=>{if(tab==='feed')renderFeed();},400);}
export async function sbPush(){
  const c=await sbClient();if(!c||!sbUser)return;
  /* Garde-fou : si l'état local est vide (bug, chargement raté, etc.) alors que le cloud
     contient déjà des livres, on refuse d'écraser — mieux vaut une sync ratée qu'une
     bibliothèque effacée pour de bon. */
  if(!db.books.length){
    const {data:row}=await c.from('bibli').select('data').eq('user_id',sbUser.id).maybeSingle();
    if(row&&row.data&&row.data.books&&row.data.books.length)
      throw new Error('Push refusé : la base locale est vide alors que le cloud contient des livres.');
  }
  const {error}=await c.from('bibli').upsert({user_id:sbUser.id,data:db,updated_at:new Date().toISOString()});
  if(error)throw error;
}
export let syncTimer=null,syncing=false;
export function scheduleSync(){
  if(!sbUser)return;
  clearTimeout(syncTimer);
  syncTimer=setTimeout(doPush,1200);
}
export let lastProfileSync=0;
export async function doPush(){
  if(!sbUser)return;
  if(syncing){scheduleSync();return;}
  syncing=true;
  try{
    await sbPush();
    /* Le profil public (recalcul HTML + upload) ne doit pas partir à CHAQUE sync — sur une
       session d'édition active (plusieurs livres modifiés d'affilée), ça ajoutait une requête
       réseau supplémentaire à chaque coup, perceptible comme lenteur. Limité à une fois toutes
       les 5 min automatiquement ; saveProfile() le force en plus immédiatement. */
    if(db.profile.friendCode&&Date.now()-lastProfileSync>300000){
      lastProfileSync=Date.now();
      syncPublicProfile();
    }
    setSyncStatus('✅ Synchronisé à '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}));
  }catch(e){setSyncStatus('⚠️ Échec de la sync');}
  syncing=false;
}
export async function sbLogout(){
  try{
    const c=await sbClient();
    if(c){if(sbChannel)c.removeChannel(sbChannel);if(sbSocialChannel)c.removeChannel(sbSocialChannel);await c.auth.signOut();}
  }catch(e){}
  sbChannel=null;sbSocialChannel=null;
  closeModals();
  /* onAuthStateChange déclenche handleSession(null) : réaffiche l'écran de connexion */
}

export function touchProfileSync(){lastProfileSync=Date.now();}
