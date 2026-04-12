// sw.js — PWA Dev Agent Service Worker (Phase 5)
// Стратегії кешування: Shell + Static assets

const CACHE_SHELL   = 'pwa-agent-shell-v1'
const CACHE_STATIC  = 'pwa-agent-static-v1'
const CACHE_FONTS   = 'pwa-agent-fonts-v1'

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
]

const STATIC_EXTENSIONS = ['.js', '.css', '.woff2', '.woff', '.svg', '.png', '.ico']

// ── Install: кешуємо shell ────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_SHELL)
      .then(c => c.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// ── Activate: чистимо старий кеш ─────────────────────────────────
self.addEventListener('activate', (e) => {
  const validCaches = [CACHE_SHELL, CACHE_STATIC, CACHE_FONTS]
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !validCaches.includes(k)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

// ── Fetch: стратегії по типах запитів ────────────────────────────
self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  // API запити — завжди мережа, без кешування
  if (url.pathname.startsWith('/.netlify/') || url.hostname === 'api.anthropic.com') {
    return // browser default
  }

  // Google Fonts — Cache First
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(cacheFirst(request, CACHE_FONTS))
    return
  }

  // Статичні ресурси (.js, .css, .png) — Stale While Revalidate
  const ext = url.pathname.split('.').pop()?.toLowerCase()
  if (STATIC_EXTENSIONS.includes('.' + ext)) {
    e.respondWith(staleWhileRevalidate(request, CACHE_STATIC))
    return
  }

  // Navigation (HTML) — Network First з fallback на offline.html
  if (request.mode === 'navigate') {
    e.respondWith(networkFirstWithOfflineFallback(request))
    return
  }
})

// ── Стратегії ────────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached
  const response = await fetch(request)
  const cache = await caches.open(cacheName)
  cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const fetchPromise = fetch(request).then(r => {
    cache.put(request, r.clone())
    return r
  }).catch(() => cached)
  return cached || fetchPromise
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(CACHE_SHELL)
    cache.put(request, response.clone())
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    return caches.match('/offline.html')
  }
}

// ── Background Sync: відкладені запити ───────────────────────────
self.addEventListener('sync', (e) => {
  if (e.tag === 'sync-messages') {
    e.waitUntil(syncPendingMessages())
  }
})

async function syncPendingMessages() {
  // Placeholder для майбутньої реалізації офлайн-черги
  console.log('[SW] Background sync triggered')
}

// ── Push Notifications (заготовка) ───────────────────────────────
self.addEventListener('push', (e) => {
  const data = e.data?.json() || { title: 'PWA Dev Agent', body: 'Нове повідомлення' }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      vibrate: [100, 50, 100],
    })
  )
})
