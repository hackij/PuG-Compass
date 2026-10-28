// Offline-Cache. Bei Änderungen an Dateien die Versionsnummer erhöhen.
const CACHE = "pugcompass-v3-4";
const FILES = ["./", "index.html", "app.css", "app.js", "data/katalog.js", "data/extras.js", "manifest.json", "icons/icon.svg", "icons/icon-192.png", "logo/pug-compass-zeichen.svg", "fonts/jakarta-800.woff2", "fonts/jakarta-500.woff2"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x))))); self.clients.claim(); });
// Netzwerk zuerst (Aktualisierungen kommen sofort an), offline aus dem Cache
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
