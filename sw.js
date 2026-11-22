/* Sanadiya : fonctionnement hors ligne. Changez VERSION à chaque mise à jour de l'application. */
var VERSION="sanadiya-r8";
var CORE=["./","index.html","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png","icon-180.png",
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(VERSION).then(function(c){return Promise.all(CORE.map(function(u){return c.add(u).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET"){return;}
  var u=new URL(r.url);
  /* page : réseau d'abord (pour avoir la dernière version), cache si hors ligne */
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(VERSION).then(function(c){c.put("index.html",cp);});return res;}).catch(function(){return caches.match("index.html");}));return;}
  /* fichiers, police et three.js : cache d'abord */
  if(u.origin===location.origin||/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.host)){
    e.respondWith(caches.match(r).then(function(hit){return hit||fetch(r).then(function(res){if(res&&(res.ok||res.type==="opaque")){var cp=res.clone();caches.open(VERSION).then(function(c){c.put(r,cp);});}return res;});}));
  }
});
