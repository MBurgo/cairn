/**
 * Deliberately conservative.
 *
 * HTML responses are NEVER cached. Every page in this app is per-user, and a
 * cached page served to the wrong person on a shared device would be a real
 * bug rather than a stale-content annoyance. Navigations go to the network and
 * fall back to a static offline page if that fails.
 *
 * Only immutable static assets are cached, and only same-origin ones — so
 * Supabase requests pass straight through, untouched.
 */
const VERSION = 'cairn-v1'
const PRECACHE = ['/offline', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(PRECACHE)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/offline')))
    return
  }

  const isImmutable =
    url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')
  if (!isImmutable) return

  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ??
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(VERSION).then((cache) => cache.put(request, copy))
          }
          return response
        })
    )
  )
})
