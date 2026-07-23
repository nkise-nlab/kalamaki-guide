# Zante Audio Guide 🎧

Self-guided, **fully offline** audio walking tour of Zakynthos Town (Zante), Greece.
Eleven stops from the church of Agios Dionysios up to Strani Hill, with AI-narrated
audio guides that start automatically as you walk up to each spot.

**Live app:** https://nkise-nlab.github.io/kalamaki-guide/

## Phone setup (do this the evening before, on Wi-Fi)

1. Open the link above in Safari (iPhone) or Chrome (Android).
2. Tap **Download for offline use** and wait for the progress bar to finish
   (~30 MB: map, all audio).
3. **Add to Home Screen** — Safari: Share → Add to Home Screen; Chrome: menu →
   Add to Home screen. This makes storage persistent and gives a full-screen app.
4. Open it once from the Home Screen icon and check the **"Offline ready ✓"** badge.
5. Test: enable Airplane Mode — the map and audio should still work.

On the walk: open the app, tap **▶ Start tour** (allows audio + location), keep the
screen on in your pocket. When you get within ~50 m of a stop, the guide starts
talking — or shows a "tap to listen" banner. Everything can also be played manually
from the map pins or the List view.

## Tech

- Vite + React + TypeScript (strict), Bun. Deviation from the org Next.js default:
  single-screen offline-first PWA needs a hand-rolled service worker and exact
  subpath control — Vite's `injectManifest` mode provides both with less risk.
- **Map:** MapLibre GL JS + Protomaps vector tiles, committed as static
  `{z}/{x}/{y}.mvt` files fetched at build time in CI (`scripts/fetch-map.ts`) —
  fully offline, no tile server, ~3 MB for the town + island overview.
- **GPS/geofencing:** `watchPosition` + accuracy gating, 2-fix confirmation and
  hysteresis (`src/lib/geo.ts`, unit-tested).
- **Audio:** one persistent `<audio>` element unlocked on the Start-tour tap
  (iOS autoplay), MediaSession lock-screen controls. Guides pre-generated with
  ElevenLabs (`scripts/generate-audio.ts`, runs in CI from a repo secret).
- **Offline:** service worker precaches the app shell; the tour pack (audio +
  map + photos) is downloaded explicitly with a progress bar and verified
  against `precache-manifest.json` on every launch.

## Development

```sh
bun install
bun run dev        # local dev (map tiles only present after fetch-map)
bun test           # geofencing unit tests
bun run build      # tsc + vite + precache manifest
```

CI (`.github/workflows/deploy.yml`) fetches map assets, builds and deploys to
GitHub Pages on every push. Audio generation (`generate-audio.yml`) runs on a
`[generate-audio]` commit-message tag or manual dispatch and needs the
`ELEVENLABS_API_KEY` repository secret.

## Debug mode

Append `?debug=1` to the URL for a teleport panel that fakes GPS fixes at any
stop — the only way to test geofencing when you're not on Zakynthos.
