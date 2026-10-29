const CACHE_NAME = 'localshop-pwa-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    '/images/icon-192.png',
    '/images/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Almacenando recursos del App Shell en caché...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// borra caches de versiones anteriores
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// network first: intenta red, guarda copia en cache y si no hay red usa la cache
self.addEventListener('fetch', event => {
    // solo GET y solo http(s) (las extensiones de chrome mandan peticiones raras que truenan el put)
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

    // la consola de h2 no la queremos en cache
    if (event.request.url.includes('/h2-console')) return;

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request).then(res => {
                    // si es una pagina que no esta guardada, mostramos la principal
                    if (!res && event.request.mode === 'navigate') return caches.match('/');
                    return res;
                });
            })
    );
});