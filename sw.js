// sw.js – Service Worker cho Thwih Music
const CACHE_NAME = 'thwih-music-v1';
const CDN_URLS = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.0/jsmediatags.min.js',
];
const STATIC_URLS = [
    '/',
    '/Hhh.html',
];

// Cài đặt cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll([...CDN_URLS, ...STATIC_URLS]))
            .then(() => self.skipWaiting())
    );
});

// Kích hoạt và xóa cache cũ
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
        }).then(() => self.clients.claim())
    );
});

// Chiến lược: Cache First cho CDN, Network First cho API
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    // API gateway → Network First với timeout
    if (url.hostname === 'thwihsite06.weylynofficial.workers.dev') {
        event.respondWith(
            new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    resolve(caches.match(event.request).then(res => res || new Response('Timeout', { status: 504 })));
                }, 3000);
                fetch(event.request)
                    .then(response => {
                        clearTimeout(timeout);
                        resolve(response);
                    })
                    .catch(() => {
                        clearTimeout(timeout);
                        resolve(caches.match(event.request).then(res => res || new Response('Offline', { status: 503 })));
                    });
            })
        );
        return;
    }
    // CDN và tài nguyên tĩnh → Cache First
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});