/* Wise Parrot Management System — service worker
   - App shell is cached so the installed app opens instantly, even offline
   - Fonts / icon font / Firebase SDK are cached after first load
   - Live school data (Firestore) is never touched here; the Firebase SDK keeps its own offline cache */
const VERSION = 'wp-admin-v4';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-64.png'
];
const CDN_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'www.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => Promise.allSettled(SHELL.map(url => cache.add(url))))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('wp-admin-') && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Page loads: network first (always fresh when online), cached shell when offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); }
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Static files from this site + trusted CDNs: stale-while-revalidate
  if (url.origin === self.location.origin || CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(VERSION).then(cache =>
        cache.match(req).then(cached => {
          const network = fetch(req)
            .then(res => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
  }
  // everything else (Firestore, APIs) goes straight to the network
});
