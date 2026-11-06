/* Network-first for everything on this site (with a short timeout), so a new
   deploy shows up on the next open and the app still works offline. */
var CACHE = 'workout-v6-20261106f';
var ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  './js/data.js', './js/figures.js', './js/poses/upper.js', './js/poses/lower.js', './js/poses/stretchA.js', './js/poses/stretchB.js', './js/poses/kot.js', './js/poses/power.js', './js/poses/variants.js', './js/poses/baby.js',
  './js/stretch.js', './js/levels.js', './js/baby.js', './js/core.js', './js/ui.js', './js/player.js', './js/app.js', './classic.html'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(ASSETS.map(function (u) { return c.add(new Request(u, { cache: 'no-cache' })).catch(function () {}); }));
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function fromCache(req) {
  return caches.match(req, { ignoreSearch: true }).then(function (hit) {
    if (hit) return hit;
    if (req.mode === 'navigate') return caches.match('./index.html');
    return Response.error();
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(new Promise(function (resolve) {
    var done = false;
    var t = setTimeout(function () { if (!done) { done = true; resolve(fromCache(req)); } }, 3500);
    fetch(req, { cache: 'no-cache' }).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      if (!done) { done = true; clearTimeout(t); resolve(res); }
    }).catch(function () { if (!done) { done = true; clearTimeout(t); resolve(fromCache(req)); } });
  }));
});
