// nora-hq service worker. Network-first, never trusts the HTTP cache. Cache is offline fallback only.
const V='20261023-020111',C='nora-hq-'+V,ASSETS=['./','index.html','install.html','config.js','extras.js','v5.js','note.js','fun.js','weather.js','data/weather_report.json','img/weather/a.png','img/weather/b.png','data/adhkar.json','data/fashion_sites.json','data/honeymoon.json','data/outfits.json','data/fashion.json','data/messages.json','data/beauty.json','style.css','app.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();
 e.waitUntil(caches.open(C).then(c=>Promise.all(ASSETS.map(u=>fetch(u,{cache:'no-store'}).then(r=>r.ok?c.put(u,r):0).catch(()=>0)))))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
 const ks=await caches.keys(),old=ks.filter(k=>k!==C);
 await Promise.all(old.map(k=>caches.delete(k)));
 await self.clients.claim();
 if(old.length){const cl=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  cl.forEach(c=>{try{const u=new URL(c.url);u.searchParams.set('v',Date.now());c.navigate(u.href)}catch(_){}})}
})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 let u;try{u=new URL(r.url)}catch(_){return}if(u.origin!==location.origin)return;
 const q=r.mode==='navigate'?new Request(r.url,{cache:'no-store',credentials:'same-origin',redirect:'manual'}):new Request(r,{cache:'no-store'});
 e.respondWith(fetch(q).then(n=>{if(n.ok&&n.type==='basic'){const cp=n.clone();caches.open(C).then(c=>c.put(r,cp))}return n})
  .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||Response.error())))});
