/**
 * Downloads offline map assets into public/map/:
 *  - vector tiles (z/x/y.mvt) for Zakynthos island (low zoom) and
 *    Zakynthos Town (high zoom), read from the latest Protomaps daily build
 *    via HTTP range requests — no pmtiles CLI needed
 *  - Noto Sans glyphs (Latin + Greek ranges) and basemap sprites
 *
 * Runs in CI (GitHub Actions) where outbound network is unrestricted.
 * Skips everything that already exists, so re-runs are cheap.
 */
import { PMTiles, FetchSource } from 'pmtiles'
import { mkdir, writeFile, exists } from 'node:fs/promises'
import { join, dirname } from 'node:path'

const MAP_DIR = join(import.meta.dir, '..', 'public', 'map')

// [west, south, east, north]
const ISLAND_BBOX = [20.55, 37.6, 21.05, 38.0] as const
const TOWN_BBOX = [20.862, 37.755, 20.93, 37.808] as const
const MAX_ZOOM = 15 // Protomaps builds top out at z15; MapLibre overzooms

const FONTS = ['Noto Sans Regular', 'Noto Sans Medium', 'Noto Sans Italic']
const GLYPH_RANGES = ['0-255', '256-511', '512-767', '768-1023', '8192-8447']
const ASSETS_BASE = 'https://protomaps.github.io/basemaps-assets'

function lngToTileX(lng: number, z: number): number {
  return Math.floor(((lng + 180) / 360) * 2 ** z)
}

function latToTileY(lat: number, z: number): number {
  const rad = (lat * Math.PI) / 180
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z,
  )
}

function tilesForBbox(
  bbox: readonly [number, number, number, number],
  z: number,
): Array<[number, number]> {
  const x0 = lngToTileX(bbox[0], z)
  const x1 = lngToTileX(bbox[2], z)
  const y0 = latToTileY(bbox[3], z) // north → smaller y
  const y1 = latToTileY(bbox[1], z)
  const out: Array<[number, number]> = []
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) out.push([x, y])
  return out
}

async function findLatestBuild(): Promise<string> {
  const today = Date.now()
  for (let back = 0; back < 21; back++) {
    const d = new Date(today - back * 86400_000)
    const name = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`
    const url = `https://build.protomaps.com/${name}.pmtiles`
    const resp = await fetch(url, { method: 'HEAD' })
    if (resp.ok) return url
  }
  throw new Error('No Protomaps build found in the last 21 days')
}

async function saveIfMissing(path: string, fetchIt: () => Promise<ArrayBuffer | null>): Promise<boolean> {
  if (await exists(path)) return false
  const data = await fetchIt()
  if (data === null) return false
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, new Uint8Array(data))
  return true
}

// ---- tiles ----
const buildUrl = await findLatestBuild()
console.log(`Using build: ${buildUrl}`)
const pm = new PMTiles(new FetchSource(buildUrl))

const wanted = new Map<string, [number, number, number]>()
for (let z = 0; z <= MAX_ZOOM; z++) {
  const bbox = z <= 12 ? ISLAND_BBOX : TOWN_BBOX
  for (const [x, y] of tilesForBbox(bbox, z)) wanted.set(`${z}/${x}/${y}`, [z, x, y])
}
console.log(`Fetching up to ${wanted.size} tiles…`)

let written = 0
let empty = 0
for (const [key, [z, x, y]] of wanted) {
  const path = join(MAP_DIR, 'tiles', `${key}.mvt`)
  const did = await saveIfMissing(path, async () => {
    const res = await pm.getZxy(z, x, y)
    if (!res) {
      empty++
      return null
    }
    return res.data
  })
  if (did) written++
}
console.log(`Tiles: ${written} written, ${empty} empty/skipped, ${wanted.size} total`)

// ---- glyphs ----
for (const font of FONTS) {
  for (const range of GLYPH_RANGES) {
    const path = join(MAP_DIR, 'fonts', font, `${range}.pbf`)
    await saveIfMissing(path, async () => {
      const resp = await fetch(`${ASSETS_BASE}/fonts/${encodeURIComponent(font)}/${range}.pbf`)
      if (!resp.ok) throw new Error(`glyph ${font}/${range}: ${resp.status}`)
      return resp.arrayBuffer()
    })
  }
}
console.log('Glyphs done')

// ---- sprites ----
for (const file of ['light.json', 'light.png', 'light@2x.json', 'light@2x.png']) {
  const path = join(MAP_DIR, 'sprites', file)
  await saveIfMissing(path, async () => {
    const resp = await fetch(`${ASSETS_BASE}/sprites/v4/${file}`)
    if (!resp.ok) throw new Error(`sprite ${file}: ${resp.status}`)
    return resp.arrayBuffer()
  })
}
console.log('Sprites done')
