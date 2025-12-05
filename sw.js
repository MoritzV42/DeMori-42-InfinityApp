/**
 * DeMori Fitness Tracker - Service Worker
 * Caching und Push-Benachrichtigungen
 */

const CACHE_NAME = 'fitness-tracker-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './manifest.json',
    './js/config.js',
    './js/data.js',
    './js/calendar.js',
    './js/streaks.js',
    './js/notifications.js',
    './js/app.js'
];

// Install Event - Cache Assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app shell');
                return cache.addAll(ASSETS);
            })
            .catch((err) => {
                console.log('[SW] Cache failed:', err);
            })
    );
    // Sofort aktivieren
    self.skipWaiting();
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[SW] Removing old cache:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // Übernehme sofort alle Clients
    self.clients.claim();
});

// Fetch Event - Cache-first strategy
self.addEventListener('fetch', (event) => {
    // Ignoriere non-GET requests
    if (event.request.method !== 'GET') return;

    // Ignoriere chrome-extension und andere URLs
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return cached response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Add to cache
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                }).catch(() => {
                    // Offline fallback
                    if (event.request.destination === 'document') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});

// Push Event - Show notification
self.addEventListener('push', (event) => {
    console.log('[SW] Push received:', event);

    let data = {
        title: 'DeMori Fitness',
        body: 'Zeit für deinen Fitness-Check!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-96.png'
    };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || '/icons/icon-192.png',
        badge: data.badge || '/icons/icon-96.png',
        vibrate: [200, 100, 200],
        tag: 'fitness-tracker',
        renotify: true,
        actions: [
            { action: 'open', title: 'Öffnen' },
            { action: 'dismiss', title: 'Später' }
        ],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);

    event.notification.close();

    if (event.action === 'dismiss') {
        return;
    }

    // Öffne oder fokussiere die App
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Prüfe ob App bereits offen
                for (const client of clientList) {
                    if (client.url.includes(self.registration.scope) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Öffne neue App-Instanz
                if (clients.openWindow) {
                    const url = event.notification.data?.url || '/';
                    return clients.openWindow(url);
                }
            })
    );
});

// Background Sync (für Offline-Einträge)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-entries') {
        // Hier könnte man Offline-Einträge synchronisieren
        // Für diese lokale App nicht nötig
    }
});

// Periodic Background Sync (für geplante Benachrichtigungen)
self.addEventListener('periodicsync', (event) => {
    console.log('[SW] Periodic sync:', event.tag);

    if (event.tag === 'daily-reminder') {
        event.waitUntil(showDailyReminder());
    }
});

async function showDailyReminder() {
    const registration = self.registration;

    await registration.showNotification('Fitness Reminder', {
        body: 'Vergiss nicht, deine Ziele zu tracken!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-96.png',
        tag: 'daily-reminder',
        actions: [
            { action: 'open', title: 'Jetzt tracken' }
        ]
    });
}
