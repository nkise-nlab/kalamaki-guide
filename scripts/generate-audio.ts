/**
 * Generates one MP3 per POI (plus the welcome intro) via the ElevenLabs
 * text-to-speech API into public/audio/. Skips files that already exist
 * (set FORCE=1 to regenerate everything).
 *
 * Requires ELEVENLABS_API_KEY in the environment — runs in GitHub Actions
 * (repository secret), never committed.
 */
import { mkdir, writeFile, exists } from 'node:fs/promises'
import { join } from 'node:path'
import { POIS, INTRO_TRANSCRIPT } from '../src/data/pois'

const API_KEY = process.env.ELEVENLABS_API_KEY
if (!API_KEY) {
  console.error('ELEVENLABS_API_KEY is not set')
  process.exit(1)
}

// "George" — warm British storyteller. Override with VOICE_ID env var.
const VOICE_ID = process.env.VOICE_ID ?? 'JBFqnCBsd6RMkjVDRZzb'
const MODEL_ID = process.env.MODEL_ID ?? 'eleven_v3'
const FALLBACK_MODEL_ID = 'eleven_multilingual_v2'
const OUT_DIR = join(import.meta.dir, '..', 'public', 'audio')
const FORCE = process.env.FORCE === '1'

async function tts(text: string, modelId: string): Promise<Response> {
  return fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_64`,
    {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY!, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: modelId }),
    },
  )
}

async function generate(id: string, text: string): Promise<void> {
  const path = join(OUT_DIR, `${id}.mp3`)
  if (!FORCE && (await exists(path))) {
    console.log(`skip ${id} (exists)`)
    return
  }
  for (let attempt = 1; attempt <= 4; attempt++) {
    let resp = await tts(text, MODEL_ID)
    if (resp.status >= 400 && resp.status < 500 && MODEL_ID !== FALLBACK_MODEL_ID) {
      const body = await resp.text()
      console.warn(`${id}: ${resp.status} with ${MODEL_ID} (${body.slice(0, 200)}), trying ${FALLBACK_MODEL_ID}`)
      resp = await tts(text, FALLBACK_MODEL_ID)
    }
    if (resp.ok) {
      const buf = await resp.arrayBuffer()
      await writeFile(path, new Uint8Array(buf))
      console.log(`ok ${id} (${(buf.byteLength / 1024 / 1024).toFixed(2)} MB)`)
      return
    }
    const body = await resp.text()
    console.warn(`${id}: attempt ${attempt} failed ${resp.status}: ${body.slice(0, 300)}`)
    if (attempt < 4) await new Promise((r) => setTimeout(r, attempt * 5000))
  }
  throw new Error(`Failed to generate audio for ${id}`)
}

await mkdir(OUT_DIR, { recursive: true })
await generate('intro', INTRO_TRANSCRIPT)
for (const poi of POIS) {
  await generate(poi.id, poi.transcript)
}
console.log('All audio generated.')
