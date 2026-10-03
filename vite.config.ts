import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

let base = '/';
export default defineConfig({
  plugins: [react(), {
    name: 'mosaic-offline-app',
    apply: 'build',
    configResolved(config) { base = config.base; },
    generateBundle(_, bundle) {
      const relativeFiles = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/app-icon.svg', '/icon-192.png', '/icon-512.png', '/fonts/manrope-variable.ttf', '/artwork/gnr.jpg', '/artwork/lana.jpg', '/artwork/lifafa.jpg', ...Object.keys(bundle).map(name => `/${name}`)];
      const files = relativeFiles.map(path => base + path.replace(/^\//, ''));
      const version = Object.keys(bundle).join('|');
      const source = `
const BASE = ${JSON.stringify(base)};
const PREFIX = 'nudge-phone-' + BASE;
const CACHE = PREFIX + ${JSON.stringify(version)};
const FILES = ${JSON.stringify([...new Set(files)])};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(BASE + 'index.html', { ignoreVary: true })));
    return;
  }
  // Compiled files are identical for this origin; dev preview can add Vary: Origin.
  event.respondWith(caches.match(event.request, { ignoreVary: true }).then(cached => cached || fetch(event.request)));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
    const client = clients.find(client => new URL(client.url).origin === self.location.origin && new URL(client.url).pathname.startsWith(BASE));
    return client ? client.focus() : self.clients.openWindow(BASE);
  }));
});
`;
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  }],
});
