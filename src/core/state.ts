/* Modèle de données central (db) + persistance locale (IndexedDB) et migrations. */
import {LANG_FIX,t} from './i18n';
import {scheduleSync} from './supabase';
import {toast} from './utils';

export const KEY='mabibli_v1';
export function normalizeDb(d){
  d.books=d.books||[];d.loans=d.loans||[];d.sessions=d.sessions||[];
  d.shelves=d.shelves||[];d.tandems=d.tandems||[];d.ranking=d.ranking||[];
  d.settings=d.settings||{taille:165};d.meta=d.meta||{updatedAt:0};
  d.settings.lang=d.settings.lang||'fr';
  d.discover=d.discover||{rejected:[]};d.discover.rejected=d.discover.rejected||[];
  d.profile=d.profile||{nom:'',photo:'',publicReading:false,publicStats:false,publicShelves:false,publicPal:false,publicDone:false,publicCoups:false,publicBadges:false,friendCode:''};
  d.profile.sectionOrder=(d.profile.sectionOrder&&d.profile.sectionOrder.length)?d.profile.sectionOrder:['reading','stats','pal','shelves','done','coups','badges'];
  /* Ajoute les sections PAL/Livres terminés/Coups de cœur (nouvelles) aux profils déjà réglés
     avant leur existence, sans perturber l'ordre déjà choisi pour les sections existantes. */
  ['pal','done','coups'].forEach(k=>{if(!d.profile.sectionOrder.includes(k))d.profile.sectionOrder.push(k);});
  /* Uniformise les codes langue abrégés (FR/EN) en toutes lettres, quelle que soit la source */
  d.books.forEach(b=>{if(LANG_FIX[b.langue])b.langue=LANG_FIX[b.langue];});
  return d;
}
export let db=normalizeDb({});
/* Stockage local : IndexedDB (~centaines de Mo), migration auto depuis localStorage */
export function idbOpen(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open('mabibli',1);
    r.onupgradeneeded=()=>r.result.createObjectStore('kv');
    r.onsuccess=()=>res(r.result);
    r.onerror=()=>rej(r.error);
  });
}
export async function idbGet(k){
  const d=await idbOpen();
  return new Promise((res,rej)=>{
    const t=d.transaction('kv').objectStore('kv').get(k);
    t.onsuccess=()=>res(t.result);t.onerror=()=>rej(t.error);
  });
}
export async function idbSet(k,v){
  const d=await idbOpen();
  return new Promise((res,rej)=>{
    const t=d.transaction('kv','readwrite');
    t.objectStore('kv').put(v,k);
    t.oncomplete=res;t.onerror=()=>rej(t.error);
  });
}
export function saveLocal(){
  idbSet('db',db).catch(()=>toast('⚠️ Impossible d\'enregistrer localement'));
}
export function save(){
  db.meta={updatedAt:Date.now()};
  saveLocal();
  scheduleSync();
}
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();

/* ---------- Sync cloud : BDD Supabase (Postgres), temps réel ---------- */

export function setDb(d){db=d;}
