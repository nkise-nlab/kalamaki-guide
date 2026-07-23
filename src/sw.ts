/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope & {
  // Injected by vite-plugin-pwa (injectManifest): hashed app-shell assets.
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>
}

const manifest = self.__WB_MANIFEST

// Version the shell cache by the manifest content so a new deploy swaps
// caches atomically on activate.
function hashString(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

const SHELL_CACHE = `shell-${hashString(JSON.stringify(manifest))}`
const TOURPACK_CACHE = 'tourpack-v1'
const BASE = new URL(self.registration.scope).pathname // '/kalamaki-guide/'

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE)
      await Promise.all(
        manifest.map(async ({ url, revision }) => {
          const bust = revision ? `?__v=${revision}` : ''
          const resp = await fetch(url + bust, { cache: 'no-cache' })
          if (resp.ok) await cache.put(url, resp)
        }),
      )
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(
        names
          .filter((n) => n !== SHELL_CACHE && n !== TOURPACK_CACHE)
          .map((n) => caches.delete(n)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (!url.pathname.startsWith(BASE)) return

  // App navigations always get the cached shell when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req)
        } catch {
          const shell = await caches.match(BASE + 'index.html')
          if (shell) return shell
          return new Response('Offline and app shell not cached', { status: 503 })
        }
      })(),
    )
    return
  }

  // Everything else: cache-first (shell + tour pack), network fallback.
  event.respondWith(
    (async () => {
      const cached = await caches.match(req.url.split('?')[0] ?? req.url)
      if (cached) return cached
      return fetch(req)
    })(),
  )
})

self.addEventListener('message', (event) => {
  if ((event.data as { type?: string } | null)?.type === 'SKIP_WAITING') {
    void self.skipWaiting()
  }
})
