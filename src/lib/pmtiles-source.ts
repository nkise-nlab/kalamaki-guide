import { PMTiles, type Source, type RangeResponse } from 'pmtiles'

/**
 * PMTiles source backed by a fully-downloaded ArrayBuffer.
 *
 * GitHub Pages does serve Range requests, but the Cache API ignores Range
 * headers on match(), so a range-based setup silently breaks offline. For a
 * few MB it's simpler and bulletproof to hold the archive in memory and
 * serve slices from it — one code path online and offline.
 */
class ArrayBufferSource implements Source {
  constructor(
    private readonly buf: ArrayBuffer,
    private readonly key: string,
  ) {}

  getKey(): string {
    return this.key
  }

  getBytes(offset: number, length: number): Promise<RangeResponse> {
    return Promise.resolve({ data: this.buf.slice(offset, offset + length) })
  }
}

export const TOURPACK_CACHE = 'tourpack-v1'

/** Fetch a URL cache-first (tour pack cache), falling back to network. */
export async function fetchCacheFirst(url: string): Promise<Response> {
  if ('caches' in self) {
    try {
      const cache = await caches.open(TOURPACK_CACHE)
      const hit = await cache.match(url)
      if (hit) return hit
    } catch {
      // Cache API unavailable (e.g. private mode) — fall through to network
    }
  }
  return fetch(url)
}

export async function loadPmtiles(url: string, key: string): Promise<PMTiles> {
  const resp = await fetchCacheFirst(url)
  if (!resp.ok) throw new Error(`pmtiles fetch failed: ${resp.status}`)
  const buf = await resp.arrayBuffer()
  return new PMTiles(new ArrayBufferSource(buf, key))
}
