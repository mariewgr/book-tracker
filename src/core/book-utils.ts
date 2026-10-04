/* Petits utilitaires génériques liés aux livres, partagés par plusieurs pages. */
export function thickness(b){
  if(b.pages>0)return +(b.pages*0.006+0.5).toFixed(1);
  return 2;
}

/* ---------- Navigation ---------- */
export const STATUT={tbr:['À lire','b-tbr'],reading:['En cours','b-reading'],done:['Terminé','b-done'],dnf:['DNF','b-dnf']};

export const FMT={papier:'Papier',numerique:'Numérique',audio:'Audio'};
export const FMT_IC={papier:'book',numerique:'tablet',audio:'headphones'};
export const fmt=b=>b.format||'papier';
export function isUpcoming(b){return !!(b.dateParution&&b.dateParution>new Date().toISOString().slice(0,10));}
export function fmtDateFr(iso){
  if(!iso)return'';
  const[y,m,d]=iso.split('-');return d+'/'+m+'/'+y;
}
export const COLORS=['#8b5cf6','#c9a2ff','#f5c86e','#6ee7a8','#7fc5ff','#ff9ad5','#ff8a8a'];
export const spineColor=id=>COLORS[[...(id||'x')].reduce((s,c)=>s+c.charCodeAt(0),0)%COLORS.length];
export const spineW=b=>Math.max(20,Math.min(42,Math.round(thickness(b)*9)));
