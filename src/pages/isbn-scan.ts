/* Recherche par ISBN, scanner de code-barres, analyse de fiche de lecture (Gemini). */
import {t} from '../core/i18n';
import {coverEl} from '../core/icons';
import {esc,toast} from '../core/utils';
import {NV_LANG} from './backup';
import {renderSmut,renderStars,renderSubRatings,segSet,setFormNotes,toggleStatutFields,updateParutionMsg} from './book-form';

export const isbnClean=s=>(s||'').replace(/[^0-9Xx]/g,'');
export function isbnMsg(txt,cls){const m=document.getElementById('isbnMsg');m.textContent=txt;m.className='isbnmsg '+(cls||'');}
/* Analyse d'une fiche de lecture photographiée (IA Gemini) */
export const GKEY='mabibli_gemini';
export let gemKey=localStorage.getItem(GKEY)||'';
export function ficheMsgSet(t,cls){const m=document.getElementById('ficheMsg');m.textContent=t;m.className='isbnmsg '+(cls||'');}
export function pickFiche(){
  if(!gemKey){ficheMsgSet('Ajoute d\'abord ta clé Gemini gratuite dans ⚙️ Réglages','err');return;}
  document.getElementById('fichePick').click();
}
/* Appel vision Gemini : modèles stables uniquement, bascule auto si quota/indispo */
export const GEM_BASE=['models/gemini-2.5-flash','models/gemini-2.0-flash'];
/* Autres modèles flash stables de la clé : n'est interrogé que si les deux modèles de base échouent */
export async function gemMoreModels(){
  const more=[];
  try{
    const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=100',
      {headers:{'x-goog-api-key':gemKey}});
    if(r.ok){
      const d=await r.json();
      (d.models||[]).filter(m=>
        (m.supportedGenerationMethods||[]).includes('generateContent')&&
        /flash/i.test(m.name)&&
        !/preview|exp|lite|image|tts|live|audio|thinking|8b|latest/i.test(m.name))
        .sort((a,b)=>b.name.localeCompare(a.name))
        .forEach(m=>{if(!GEM_BASE.includes(m.name))more.push(m.name);});
    }
  }catch(e){}
  return more;
}
/* `fast` : pas de phase de « réflexion » (modèles 2.5) — bien plus rapide pour une simple transcription */
export async function gemVision(prompt,b64,json,fast,onTry){
  let lastErr='';
  async function tryModel(model){
    if(onTry)onTry(model);
    /* mode rapide : un modèle qui ne répond pas en 40 s est abandonné au profit du suivant */
    const ctl=fast?new AbortController():null,timer=ctl&&setTimeout(()=>ctl.abort(),40000);
    try{
      const cfg={temperature:0};
      if(json)cfg.response_mime_type='application/json';
      if(fast&&/2\.5/.test(model))cfg.thinkingConfig={thinkingBudget:0};
      const r=await fetch('https://generativelanguage.googleapis.com/v1beta/'+model+':generateContent',{
        method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':gemKey},signal:ctl?ctl.signal:undefined,
        body:JSON.stringify({
          contents:[{parts:[{text:prompt},{inline_data:{mime_type:'image/jpeg',data:b64}}]}],
          generationConfig:cfg
        })});
      if(!r.ok){
        const er=await r.json().catch(()=>({}));
        lastErr=((er.error&&er.error.message)||('HTTP '+r.status));
        /* quota atteint ou modèle indisponible → on tente le modèle suivant */
        if(r.status===429||r.status===404||r.status===400)return null;
        throw new Error(lastErr);
      }
      const d=await r.json();
      const txt=((d.candidates&&d.candidates[0]&&d.candidates[0].content&&d.candidates[0].content.parts)||[])
        .map(p=>p.text||'').join('').trim();
      if(txt)return txt;
      lastErr='réponse vide du modèle';
    }catch(e){lastErr=e.name==='AbortError'?'pas de réponse de '+model.replace('models/','')+' après 40 s':(e.message||lastErr);}
    finally{if(timer)clearTimeout(timer);}
    return null;
  }
  for(const model of GEM_BASE){const t=await tryModel(model);if(t)return t;}
  for(const model of await gemMoreModels()){const t=await tryModel(model);if(t)return t;}
  throw new Error(lastErr||'aucun modèle Gemini disponible pour cette clé');
}
export const FICHE_PROMPT=`Voici la photo d'une fiche de lecture manuscrite en français. Extrais les informations et réponds UNIQUEMENT avec un JSON valide, sans commentaire, avec exactement ces clés (mets null si l'info est absente ou illisible) :
{"titre":string,"auteur":string,"genre":string,"langue":string,"fmc":string,"mmc":string,"tropes":string,
"note":0-5 (grande rangée d'étoiles : compte les étoiles coloriées/surlignées),
"ecriture":0-5,"histoire":0-5,"personnages":0-5,"tension":0-5,"tristesse":0-5,"romance":0-5,"drole":0-5,"facile":0-5,"fin":0-5 (chaque catégorie : étoiles coloriées),
"recommande":"oui" ou "non" (symbole entouré/colorié) ou null,
"smut":0-5 (nombre de piments),
"resume":string,"finNote":string (contenu de l'encadré Fin),"commentaires":string,
"format":"papier" (si l'icône livre est cochée) ou "numerique" (si l'icône liseuse est cochée) ou null}`;
export function onFichePicked(inp){
  const f=inp.files[0];inp.value='';
  if(!f)return;
  ficheMsgSet('⏳ Analyse de la fiche en cours…');
  const img=new Image();
  img.onload=async()=>{
    const maxH=1500,scale=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(img.src);
    const b64=c.toDataURL('image/jpeg',0.82).split(',')[1];
    try{
      let txt=await gemVision(FICHE_PROMPT,b64,true);
      txt=txt.replace(/^```json\s*/i,'').replace(/```\s*$/,'').trim();
      applyFiche(JSON.parse(txt));
      ficheMsgSet('✅ Fiche analysée — vérifie et corrige si besoin','ok');
    }catch(e){ficheMsgSet('⚠️ '+(e.message||'Analyse impossible — réessaie avec une photo plus nette'),'err');}
  };
  img.onerror=()=>ficheMsgSet('Image illisible 😕','err');
  img.src=URL.createObjectURL(f);
}
export function applyFiche(v){
  const set=(id,val)=>{if(val)document.getElementById(id).value=val;};
  set('f_titre',v.titre);set('f_auteur',v.auteur);set('f_genre',v.genre);set('f_langue',v.langue);
  set('f_fmc',v.fmc);set('f_mmc',v.mmc);set('f_tropes',v.tropes);
  set('f_resume',v.resume);set('f_finNote',v.finNote);set('f_avis',v.commentaires);
  if(v.format==='papier'||v.format==='numerique')segSet('segFormat',v.format);
  segSet('segStatut','done');
  const n=x=>Math.max(0,Math.min(5,Math.round(+x||0)));
  setFormNotes(n(v.note),{ecriture:n(v.ecriture),histoire:n(v.histoire),personnages:n(v.personnages),
    tension:n(v.tension),tristesse:n(v.tristesse),romance:n(v.romance),
    drole:n(v.drole),facile:n(v.facile),fin:n(v.fin)},n(v.smut));
  segSet('segRec',v.recommande==='oui'?'oui':(v.recommande==='non'?'non':''));
  toggleStatutFields();renderStars();renderSubRatings();renderSmut();
}

/* Recherche en ligne par titre/auteur */
export let searchRes=[];
export function searchMsg(t,cls){const m=document.getElementById('searchMsg');m.textContent=t;m.className='isbnmsg '+(cls||'');}
export async function searchOnline(){
  const q=document.getElementById('f_search').value.trim();
  if(q.length<3){searchMsg('Entre au moins 3 caractères','err');return;}
  searchMsg('Recherche en cours…');searchRes=[];
  document.getElementById('searchResults').innerHTML='';
  try{
    try{
      const r=await fetch('https://www.googleapis.com/books/v1/volumes?q='+encodeURIComponent(q)+'&country=FR&maxResults=6');
      if(r.ok){
        const d=await r.json();
        (d.items||[]).forEach(it=>{
          const v=it.volumeInfo||{};
          if(!v.title)return;
          const isbn=(v.industryIdentifiers||[]).map(x=>x.identifier).find(x=>/^97[89]\d{10}$/.test(x))||'';
          searchRes.push({titre:v.title,auteur:(v.authors||[]).join(', '),pages:v.pageCount||0,
            langue:NV_LANG[v.language]||v.language||'',genre:(v.categories||[])[0]||'',isbn,
            parution:normDate(v.publishedDate),
            couverture:((v.imageLinks&&(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail))||'').replace('http://','https://')});
        });
      }
    }catch(e){}
    if(searchRes.length<3){
      try{
        const r=await fetch('https://openlibrary.org/search.json?q='+encodeURIComponent(q)+'&fields=title,author_name,number_of_pages_median,cover_i,isbn,first_publish_year&limit=6');
        if(r.ok){
          const d=await r.json();
          (d.docs||[]).forEach(v=>{
            if(!v.title)return;
            if(searchRes.some(x=>x.titre.toLowerCase()===v.title.toLowerCase()))return;
            searchRes.push({titre:v.title,auteur:(v.author_name||[]).join(', '),
              pages:v.number_of_pages_median||0,langue:'',genre:'',
              isbn:(v.isbn||[]).find(x=>/^97[89]\d{10}$/.test(x))||'',
              parution:v.first_publish_year?normDate(String(v.first_publish_year)):'',
              couverture:v.cover_i?('https://covers.openlibrary.org/b/id/'+v.cover_i+'-M.jpg'):''});
          });
        }
      }catch(e){}
    }
    if(!searchRes.length){searchMsg('Aucun résultat 😕 — essaie avec l\'ISBN ou remplis à la main','err');return;}
    searchMsg(searchRes.length+' résultat(s) — touche celui qui correspond','ok');
    document.getElementById('searchResults').innerHTML=searchRes.map((v,i)=>
      `<div class="sitem" style="cursor:pointer" onclick="applySearch(${i})">${coverEl(v.couverture,'sm')}
        <span class="nm">${esc(v.titre)}<br><span style="color:var(--txt2);font-size:.75rem">${esc(v.auteur)||'—'}${v.pages?' · '+v.pages+' p.':''}</span></span>
        <button style="color:var(--green)">Utiliser</button></div>`).join('');
  }catch(e){searchMsg('Erreur réseau — vérifie ta connexion','err');}
}
export function applySearch(i){
  const v=searchRes[i];if(!v)return;
  document.getElementById('f_titre').value=v.titre;
  if(v.auteur)document.getElementById('f_auteur').value=v.auteur;
  if(v.pages)document.getElementById('f_pages').value=v.pages;
  if(v.langue)document.getElementById('f_langue').value=v.langue;
  if(v.genre&&!document.getElementById('f_genre').value)document.getElementById('f_genre').value=v.genre;
  if(v.isbn)document.getElementById('f_isbn').value=v.isbn;
  if(v.couverture)document.getElementById('f_couverture').value=v.couverture;
  if(v.desc)document.getElementById('f_synopsis').value=v.desc;
  if(v.parution)document.getElementById('f_dateParution').value=v.parution;
  updateParutionMsg();
  document.getElementById('searchResults').innerHTML='';
  searchMsg('✅ Infos remplies — vérifie et complète si besoin','ok');
}
/* Normalise une date de parution (Google Books / Open Library) vers AAAA-MM-JJ */
export function normDate(s){
  if(!s)return'';
  s=String(s).trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;
  if(/^\d{4}-\d{2}$/.test(s))return s+'-01';
  if(/^\d{4}$/.test(s))return s+'-01-01';
  const d=new Date(s);
  if(!isNaN(d)&&d.getFullYear()>1000&&d.getFullYear()<3000)return d.toISOString().slice(0,10);
  return'';
}
export function isbn13to10(i){
  if(!/^978\d{10}$/.test(i))return null;
  const core=i.slice(3,12);let s=0;
  for(let k=0;k<9;k++)s+=(10-k)*+core[k];
  const c=(11-s%11)%11;
  return core+(c===10?'X':c);
}
export function isbn10to13(i){
  if(!/^\d{9}[\dXx]$/.test(i))return null;
  const core='978'+i.slice(0,9);let s=0;
  for(let k=0;k<12;k++)s+=+core[k]*(k%2?3:1);
  return core+((10-s%10)%10);
}
export async function lookupISBN(){
  const isbn=isbnClean(document.getElementById('f_isbn').value);
  if(isbn.length!==10&&isbn.length!==13){isbnMsg('ISBN invalide (10 ou 13 chiffres)','err');return;}
  isbnMsg('Recherche en cours…');
  const candidates=[isbn];
  const alt=isbn.length===13?isbn13to10(isbn):isbn10to13(isbn);
  if(alt)candidates.push(alt);
  try{
    let info=null;
    for(const src of [fetchGoogleBooks,fetchOpenLibrary,fetchOpenLibSearch]){
      for(const code of candidates){
        try{info=await src(code);}catch(e){}
        if(info)break;
      }
      if(info)break;
    }
    if(!info){isbnMsg('Introuvable pour l\'ISBN '+isbn+' 😕 — vérifie le numéro ou remplis à la main','err');return;}
    if(info.titre)document.getElementById('f_titre').value=info.titre;
    if(info.auteur)document.getElementById('f_auteur').value=info.auteur;
    if(info.pages)document.getElementById('f_pages').value=info.pages;
    if(info.langue)document.getElementById('f_langue').value=info.langue;
    if(info.genre&&!document.getElementById('f_genre').value)document.getElementById('f_genre').value=info.genre;
    document.getElementById('f_couverture').value=info.couverture||('https://covers.openlibrary.org/b/isbn/'+isbn+'-M.jpg?default=false');
    if(info.desc)document.getElementById('f_synopsis').value=info.desc;
    if(info.parution)document.getElementById('f_dateParution').value=info.parution;
    updateParutionMsg();
    isbnMsg('✅ Infos trouvées — vérifie et complète si besoin','ok');
  }catch(e){isbnMsg('Erreur réseau — vérifie ta connexion','err');}
}
export async function fetchGoogleBooks(isbn){
  const r=await fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:'+isbn+'&country=FR');
  if(!r.ok)return null;
  const d=await r.json();
  const v=d.items&&d.items[0]&&d.items[0].volumeInfo;
  if(!v)return null;
  return {titre:v.title||'',auteur:(v.authors||[]).join(', '),pages:v.pageCount||0,
    langue:NV_LANG[v.language]||v.language||'',genre:(v.categories||[])[0]||'',
    desc:v.description||'',parution:normDate(v.publishedDate),
    couverture:((v.imageLinks&&(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail))||'').replace('http://','https://')};
}
export async function fetchOpenLibrary(isbn){
  const r=await fetch('https://openlibrary.org/api/books?bibkeys=ISBN:'+isbn+'&format=json&jscmd=data');
  if(!r.ok)return null;
  const d=await r.json();const v=d['ISBN:'+isbn];
  if(!v)return null;
  return {titre:v.title||'',auteur:(v.authors||[]).map(a=>a.name).join(', '),
    pages:v.number_of_pages||0,langue:'',genre:(v.subjects&&v.subjects[0]&&v.subjects[0].name)||'',
    parution:normDate(v.publish_date),
    couverture:(v.cover&&(v.cover.medium||v.cover.small))||''};
}
export async function fetchOpenLibSearch(isbn){
  const r=await fetch('https://openlibrary.org/search.json?q=isbn:'+isbn+'&fields=title,author_name,number_of_pages_median,cover_i,first_publish_year&limit=1');
  if(!r.ok)return null;
  const d=await r.json();const v=d.docs&&d.docs[0];
  if(!v||!v.title)return null;
  return {titre:v.title,auteur:(v.author_name||[]).join(', '),
    pages:v.number_of_pages_median||0,langue:'',genre:'',
    parution:v.first_publish_year?normDate(String(v.first_publish_year)):'',
    couverture:v.cover_i?('https://covers.openlibrary.org/b/id/'+v.cover_i+'-M.jpg'):''};
}
/* Scanner : BarcodeDetector natif si dispo, sinon ZXing chargé à la demande */
export let scanStream=null,zxingReader=null,scanning=false;
export function loadZXing(){
  return new Promise((res,rej)=>{
    if(window.ZXing)return res();
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js';
    s.onload=res;s.onerror=rej;document.head.appendChild(s);
  });
}
export function onScanned(raw){
  const code=isbnClean(raw);
  if(!(/^97[89]\d{10}$/.test(code)||code.length===10))return false;
  document.getElementById('f_isbn').value=code;
  if(navigator.vibrate)navigator.vibrate(80);
  closeScanner();lookupISBN();
  return true;
}
export async function openScanner(){
  document.getElementById('scanModal').classList.add('open');
  const video=document.getElementById('scanVideo'),msg=document.getElementById('scanMsg');
  msg.textContent='Vise le code-barres au dos du livre…';
  scanning=true;
  try{
    if('BarcodeDetector' in window){
      scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});
      video.srcObject=scanStream;await video.play();
      const det=new BarcodeDetector({formats:['ean_13','ean_8']});
      const loop=async()=>{
        if(!scanning)return;
        try{
          const codes=await det.detect(video);
          if(codes.length&&onScanned(codes[0].rawValue))return;
        }catch(e){}
        setTimeout(loop,150);
      };
      loop();
    }else{
      msg.textContent='Chargement du scanner…';
      await loadZXing();
      if(!scanning)return;
      msg.textContent='Vise le code-barres au dos du livre…';
      zxingReader=new ZXing.BrowserMultiFormatReader();
      zxingReader.decodeFromVideoDevice(null,video,(result)=>{
        if(result&&scanning)onScanned(result.getText());
      });
    }
  }catch(e){
    closeScanner();
    toast("Impossible d'accéder à la caméra 😕 Autorise-la dans les réglages, ou saisis l'ISBN à la main.");
  }
}
export function closeScanner(){
  scanning=false;
  document.getElementById('scanModal').classList.remove('open');
  if(zxingReader){try{zxingReader.reset();}catch(e){}zxingReader=null;}
  if(scanStream){scanStream.getTracks().forEach(t=>t.stop());scanStream=null;}
  document.getElementById('scanVideo').srcObject=null;
}

/* ---------- Défi pile ---------- */

export function setGemKey(k){gemKey=k;}
