/**
 * Runs after `vite build`. Emits dist/precache-manifest.json listing every
 * tour-pack asset (audio, map, photos) with its size, so the app can download
 * them into the Cache API with a real progress bar and verify completeness.
 * Also copies index.html to 404.html for GitHub Pages hard-reload fallback.
 */
import { readdir, stat, writeFile, copyFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { existsSync } from 'node:fs'

const DIST = join(import.meta.dir, '..', 'dist')
const PACK_DIRS = ['audio', 'map', 'photos']

async function walk(dir: string): Promise<string[]> {
  const out: string[] = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(p)))
    else out.push(p)
  }
  return out
}

const entries: { url: string; size: number }[] = []
for (const sub of PACK_DIRS) {
  const dir = join(DIST, sub)
  if (!existsSync(dir)) continue
  for (const file of await walk(dir)) {
    const { size } = await stat(file)
    entries.push({ url: relative(DIST, file).replaceAll('\\', '/'), size })
  }
}

entries.sort((a, b) => a.url.localeCompare(b.url))
const totalBytes = entries.reduce((sum, e) => sum + e.size, 0)
const manifest = { version: new Date().toISOString(), totalBytes, entries }

await writeFile(join(DIST, 'precache-manifest.json'), JSON.stringify(manifest, null, 2))
await copyFile(join(DIST, 'index.html'), join(DIST, '404.html'))

console.log(
  `precache-manifest.json: ${entries.length} files, ${(totalBytes / 1024 / 1024).toFixed(1)} MB`,
)
