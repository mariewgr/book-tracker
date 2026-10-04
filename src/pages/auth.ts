/* Écran de connexion (page dédiée, plein écran). */
import {handleSession,initAuth,sbClient,withTimeout} from '../core/supabase';
import {toast} from '../core/utils';

export let authMode='signin';
export function renderAuthMode(){
  document.getElementById('authSubmitBtn').textContent=authMode==='signin'?'Se connecter':'Créer le compte';
  document.getElementById('authToggleBtn').textContent=authMode==='signin'?'Pas de compte ? Crée-en un':'Déjà un compte ? Se connecter';
  document.getElementById('authForgotBtn').classList.toggle('hidden',authMode!=='signin');
}
export function toggleAuthMode(){
  authMode=authMode==='signin'?'signup':'signin';
  document.getElementById('authError').textContent='';
  renderAuthMode();
}
export function translateAuthError(msg){
  if(/invalid login credentials/i.test(msg))return 'Email ou mot de passe incorrect.';
  if(/already registered/i.test(msg))return 'Un compte existe déjà avec cet email.';
  if(/password should be at least/i.test(msg))return 'Mot de passe trop court (6 caractères minimum).';
  if(/email not confirmed/i.test(msg))return 'Confirme ton email avant de te connecter (vérifie ta boîte mail).';
  if(/auth session missing/i.test(msg))return "Le lien a expiré ou a déjà été utilisé. Redemande un email via « Mot de passe oublié ? », puis ouvre le lien reçu sur cet appareil, dans le même navigateur.";
  return msg;
}
export async function handleAuthSubmit(){
  const email=(document.getElementById('authEmail').value||'').trim();
  const password=document.getElementById('authPassword').value;
  const errEl=document.getElementById('authError');
  errEl.className='isbnmsg err';errEl.textContent='';
  if(!email||!password){errEl.textContent='Renseigne un email et un mot de passe.';return;}
  if(!navigator.onLine){errEl.textContent='Pas de connexion réseau — la première connexion nécessite du réseau.';return;}
  let c;
  try{c=await withTimeout(sbClient(),8000);}catch(e){c=null;}
  if(!c){errEl.textContent="Impossible de joindre Supabase (réseau ou configuration).";return;}
  const btn=document.getElementById('authSubmitBtn');
  btn.disabled=true;
  try{
    if(authMode==='signup'){
      const {error}=await c.auth.signUp({email,password});
      if(error)throw error;
      errEl.className='isbnmsg ok';
      errEl.textContent='Compte créé ! Si une confirmation par email est demandée, clique sur le lien reçu puis connecte-toi.';
      authMode='signin';renderAuthMode();
    }else{
      const {error}=await c.auth.signInWithPassword({email,password});
      if(error)throw error;
    }
  }catch(e){
    errEl.className='isbnmsg err';
    errEl.textContent=translateAuthError(e.message||String(e));
  }finally{
    btn.disabled=false;
  }
}
export async function signInWithOAuth(provider){
  const errEl=document.getElementById('authError');
  errEl.className='isbnmsg err';errEl.textContent='';
  if(!navigator.onLine){errEl.textContent='Pas de connexion réseau — la première connexion nécessite du réseau.';return;}
  let c;
  try{c=await withTimeout(sbClient(),8000);}catch(e){c=null;}
  if(!c){errEl.textContent="Impossible de joindre Supabase (réseau ou configuration).";return;}
  /* Redirection vers Google/Apple puis retour sur cette même page — onAuthStateChange (déjà
     en place dans initAuth) détecte la session dans l'URL au retour, comme pour le lien de
     récupération de mot de passe : aucun code de callback séparé n'est nécessaire. */
  const {error}=await c.auth.signInWithOAuth({provider,options:{redirectTo:location.origin+location.pathname}});
  if(error){errEl.className='isbnmsg err';errEl.textContent=translateAuthError(error.message||String(error));}
}
export async function handleForgotPassword(){
  const email=(document.getElementById('authEmail').value||'').trim();
  const errEl=document.getElementById('authError');
  errEl.className='isbnmsg err';errEl.textContent='';
  if(!email){errEl.textContent='Renseigne ton email ci-dessus, puis clique à nouveau sur « Mot de passe oublié ? ».';return;}
  if(!navigator.onLine){errEl.textContent='Pas de connexion réseau — réessaie une fois en ligne.';return;}
  let c;
  try{c=await withTimeout(sbClient(),8000);}catch(e){c=null;}
  if(!c){errEl.textContent="Impossible de joindre Supabase (réseau ou configuration).";return;}
  const btn=document.getElementById('authForgotBtn');
  btn.disabled=true;
  try{
    const {error}=await c.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
    if(error)throw error;
    errEl.className='isbnmsg ok';
    errEl.textContent='Email envoyé (si ce compte existe) : clique sur le lien reçu pour choisir un nouveau mot de passe. Vérifie aussi tes spams.';
  }catch(e){
    errEl.className='isbnmsg err';
    errEl.textContent=translateAuthError(e.message||String(e));
  }finally{
    btn.disabled=false;
  }
}
export function showResetScreen(){
  document.getElementById('authCard').classList.add('hidden');
  document.getElementById('resetCard').classList.remove('hidden');
}
export async function handleResetPassword(){
  const pwd=document.getElementById('resetPassword').value;
  const errEl=document.getElementById('resetError');
  errEl.className='isbnmsg err';errEl.textContent='';
  if(!pwd||pwd.length<6){errEl.textContent='Mot de passe trop court (6 caractères minimum).';return;}
  let c;
  try{c=await withTimeout(sbClient(),8000);}catch(e){c=null;}
  if(!c){errEl.textContent="Impossible de joindre Supabase (réseau ou configuration).";return;}
  const btn=document.getElementById('resetSubmitBtn');
  btn.disabled=true;
  try{
    const {data:sessData}=await c.auth.getSession();
    if(!sessData.session){
      errEl.textContent="Le lien a expiré ou a déjà été utilisé. Redemande un email via « Mot de passe oublié ? », puis ouvre le lien reçu sur cet appareil, dans le même navigateur.";
      return;
    }
    const {error}=await c.auth.updateUser({password:pwd});
    if(error)throw error;
    toast('Mot de passe mis à jour ✅');
    document.getElementById('resetCard').classList.add('hidden');
    document.getElementById('authCard').classList.remove('hidden');
    const {data}=await c.auth.getSession();
    handleSession(data.session);
  }catch(e){
    errEl.className='isbnmsg err';
    errEl.textContent=translateAuthError(e.message||String(e));
  }finally{
    btn.disabled=false;
  }
}
