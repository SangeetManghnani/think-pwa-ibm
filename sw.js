var cacheName = 'utility-task';
var filesToCache = [
    '/',
    './index.html',
    './css/index.css',
    './js/index.js',
    './js/offline.js',
];


self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim()
        // getTasks()
    );
});

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install1213');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shel 123l');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
    // getTasks();
});

// function getTasks() {
//     // if (!('indexedDB' in window)) { return null; }
//     // return dbPromise.then(db => {
//     //     const tx = db.transaction('tasksList', 'readonly');
//     //     const store = tx.objectStore('tasksList');
//     //     return store.getAll();
//     // });
//     var transaction = self.db.transaction("tasksList", "readwrite");
//     transaction.oncomplete = function(event) {
//         console.log('Transaction completed.');
//     };
//     transaction.onerror = function(event) {
//         console.log('Transaction not completed :' + transaction.error);
//     };
//     var objectStore = transaction.objectStore("tasksList");
//     var objectStoreRequest = objectStore.getAll();
//     objectStoreRequest.onsuccess = function(event) {
//         console.log('object store request success');
//         var tasks = objectStoreRequest.result;
//     }
// }
