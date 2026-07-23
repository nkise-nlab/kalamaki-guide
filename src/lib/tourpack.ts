import { withBase } from './base'
import { TOURPACK_CACHE } from './pmtiles-source'

export interface PackEntry {
  url: string
  size: number
}

export interface PackManifest {
  version: string
  totalBytes: number
  entries: PackEntry[]
}

export interface DownloadProgress {
  downloadedBytes: number
  totalBytes: number
  done: number
  total: number
  currentFile: string
}

/** Load precache-manifest.json — network first, cached copy as fallback. */
export async function loadPackManifest(): Promise<PackManifest> {
  const url = withBase('precache-manifest.json')
  try {
    const resp = await fetch(url, { cache: 'no-cache' })
    if (resp.ok) {
      const cache = await caches.open(TOURPACK_CACHE)
      await cache.put(url, resp.clone())
      return (await resp.json()) as PackManifest
    }
  } catch {
    // offline — try cache below
  }
  const cached = await caches.match(url)
  if (!cached) throw new Error('No pack manifest available (offline, never downloaded)')
  return (await cached.json()) as PackManifest
}

/**
 * Download every tour-pack asset into the Cache API, reporting progress.
 * Skips files already cached. Safe to re-run (resumes where it left off).
 */
export async function downloadTourPack(
  manifest: PackManifest,
  onProgress: (p: DownloadProgress) => void,
): Promise<void> {
  const cache = await caches.open(TOURPACK_CACHE)
  let downloadedBytes = 0
  let done = 0
  for (const entry of manifest.entries) {
    const url = withBase(entry.url)
    const existing = await cache.match(url)
    if (!existing) {
      const resp = await fetch(url, { cache: 'no-cache' })
      if (!resp.ok) throw new Error(`Failed to fetch ${entry.url}: ${resp.status}`)
      await cache.put(url, resp)
    }
    downloadedBytes += entry.size
    done += 1
    onProgress({
      downloadedBytes,
      totalBytes: manifest.totalBytes,
      done,
      total: manifest.entries.length,
      currentFile: entry.url,
    })
  }
  // Best-effort: ask the browser not to evict our caches.
  if (navigator.storage?.persist) {
    try {
      await navigator.storage.persist()
    } catch {
      // fine — purely advisory
    }
  }
}

/**
 * Verify that EVERY manifest entry is actually present in the cache.
 * Never trust a "downloaded" flag — iOS can evict storage behind our back.
 */
export async function verifyTourPack(manifest: PackManifest): Promise<{ ok: boolean; missing: string[] }> {
  const cache = await caches.open(TOURPACK_CACHE)
  const missing: string[] = []
  for (const entry of manifest.entries) {
    const hit = await cache.match(withBase(entry.url))
    if (!hit) missing.push(entry.url)
  }
  return { ok: missing.length === 0, missing }
}
