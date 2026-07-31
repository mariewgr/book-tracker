/* Ma Bibli — service worker : app 100 % hors ligne */
const CACHE='mabibli-v3';
const ASSETS=['./','./index.html','./book.png','./shelf.png','./rank.png',
  './book_pile.png','./stats.png','./calendar.png','./refresh.png','./settings.png','./paper.png',
  './numeric.png','./audio.png','./human.png','./search.png','./modify.png','./photo.png',
  './image.png','./home.png','./book_types.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE)
    .then(c=>Promise.allSettled(ASSETS.map(a=>c.add(a))))
    .then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  /* index.html : réseau d'abord (mises à jour), cache en secours (hors ligne) */
  if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')){
    e.respondWith(
      fetch(e.request).then(r=>{
        const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));
        return r;
      }).catch(()=>caches.match('./index.html'))
    );
    return;
  }
  /* ressources locales : cache d'abord */
  if(u.origin===location.origin){
    e.respondWith(
      caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
        const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));
        return res;
      }))
    );
  }
});
