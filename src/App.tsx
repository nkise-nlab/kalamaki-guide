import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { POIS, INTRO_AUDIO, type Poi } from './data/pois'
import { GeofenceTracker, type Fix } from './lib/geo'
import * as audio from './lib/audio'
import {
  loadPackManifest,
  downloadTourPack,
  verifyTourPack,
  type PackManifest,
  type DownloadProgress,
} from './lib/tourpack'
import StartScreen from './components/StartScreen'
import MapView from './components/MapView'
import PoiList from './components/PoiList'
import PoiSheet from './components/PoiSheet'
import AudioBar from './components/AudioBar'
import NearbyBanner from './components/NearbyBanner'
import DebugPanel from './components/DebugPanel'

export type PackStatus =
  | { kind: 'checking' }
  | { kind: 'none' }
  | { kind: 'downloading'; progress: DownloadProgress }
  | { kind: 'ready' }
  | { kind: 'error'; message: string }

const DEBUG = new URLSearchParams(window.location.search).has('debug')

export default function App() {
  const [phase, setPhase] = useState<'start' | 'tour'>('start')
  const [view, setView] = useState<'map' | 'list'>('map')
  const [fix, setFix] = useState<Fix | null>(null)
  const [gpsError, setGpsError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Poi | null>(null)
  const [nearby, setNearby] = useState<Poi | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [packStatus, setPackStatus] = useState<PackStatus>({ kind: 'checking' })
  const [visitedTick, setVisitedTick] = useState(0)

  const manifestRef = useRef<PackManifest | null>(null)
  const trackerRef = useRef<GeofenceTracker | null>(null)
  const queueRef = useRef<Poi[]>([])
  const watchIdRef = useRef<number | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const tracker = useMemo(() => {
    const t = new GeofenceTracker(POIS)
    trackerRef.current = t
    return t
  }, [])

  // ---- offline pack ----
  const refreshPackStatus = useCallback(async () => {
    try {
      const manifest = await loadPackManifest()
      manifestRef.current = manifest
      const { ok } = await verifyTourPack(manifest)
      setPackStatus(ok ? { kind: 'ready' } : { kind: 'none' })
    } catch (e) {
      setPackStatus({ kind: 'error', message: e instanceof Error ? e.message : String(e) })
    }
  }, [])

  useEffect(() => {
    void refreshPackStatus()
  }, [refreshPackStatus])

  const startDownload = useCallback(async () => {
    let manifest = manifestRef.current
    if (!manifest) {
      try {
        manifest = await loadPackManifest()
        manifestRef.current = manifest
      } catch (e) {
        setPackStatus({ kind: 'error', message: e instanceof Error ? e.message : String(e) })
        return
      }
    }
    try {
      await downloadTourPack(manifest, (progress) =>
        setPackStatus({ kind: 'downloading', progress }),
      )
      const { ok } = await verifyTourPack(manifest)
      setPackStatus(ok ? { kind: 'ready' } : { kind: 'none' })
    } catch (e) {
      setPackStatus({ kind: 'error', message: e instanceof Error ? e.message : String(e) })
    }
  }, [])

  // ---- geofencing ----
  const handleFix = useCallback((f: Fix) => {
    setFix(f)
    setGpsError(null)
    const t = trackerRef.current
    if (!t) return
    const triggered = t.update(f)
    if (!triggered) return
    t.markVisited(triggered.id)
    setVisitedTick((n) => n + 1)
    const playing = !audio.getState().paused
    if (playing) {
      queueRef.current.push(triggered)
      setToast(`Coming up: ${triggered.name}`)
    } else {
      void audio.playPoi(triggered).then((ok) => {
        if (!ok) setNearby(triggered)
      })
    }
  }, [])

  useEffect(() => {
    const off = audio.onEnded(() => {
      const next = queueRef.current.shift()
      if (next) setNearby(next)
    })
    return off
  }, [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(id)
  }, [toast])

  const requestWakeLock = useCallback(async () => {
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen')
    } catch {
      // not supported / denied — tour still works with screen taps
    }
  }, [])

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible' && phase === 'tour') {
        void requestWakeLock()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [phase, requestWakeLock])

  const startTour = useCallback(() => {
    // Single user gesture: bless audio, start GPS, grab wake lock.
    void audio.unlockAudio(INTRO_AUDIO).then(() => {
      void audio.playTrack(INTRO_AUDIO, 'Welcome to Zakynthos')
    })
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) =>
          handleFix({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          }),
        (err) => setGpsError(err.message),
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 },
      )
    } else {
      setGpsError('Geolocation not supported on this device')
    }
    void requestWakeLock()
    setPhase('tour')
  }, [handleFix, requestWakeLock])

  useEffect(
    () => () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
      void wakeLockRef.current?.release()
    },
    [],
  )

  const playFromBanner = useCallback((poi: Poi) => {
    setNearby(null)
    void audio.playPoi(poi)
  }, [])

  const playFromSheet = useCallback((poi: Poi) => {
    tracker.markVisited(poi.id)
    setVisitedTick((n) => n + 1)
    setSelected(null)
    void audio.playPoi(poi)
  }, [tracker])

  if (phase === 'start') {
    return (
      <StartScreen
        packStatus={packStatus}
        onDownload={() => void startDownload()}
        onStart={startTour}
      />
    )
  }

  return (
    <div className="app">
      {view === 'map' ? (
        <MapView
          pois={POIS}
          fix={fix}
          visitedTick={visitedTick}
          isVisited={(id) => tracker.isVisited(id)}
          onSelect={setSelected}
        />
      ) : (
        <PoiList
          pois={POIS}
          fix={fix}
          isVisited={(id) => tracker.isVisited(id)}
          onSelect={setSelected}
        />
      )}

      <header className="topbar">
        <span className="topbar-title">Zante Guide</span>
        <span className={`pack-badge ${packStatus.kind}`}>
          {packStatus.kind === 'ready'
            ? 'Offline ready ✓'
            : packStatus.kind === 'downloading'
              ? `Downloading ${Math.round((packStatus.progress.downloadedBytes / Math.max(1, packStatus.progress.totalBytes)) * 100)}%`
              : 'Online only'}
        </span>
        <button
          className="view-toggle"
          onClick={() => setView((v) => (v === 'map' ? 'list' : 'map'))}
        >
          {view === 'map' ? 'List' : 'Map'}
        </button>
      </header>

      {gpsError && <div className="gps-error">GPS: {gpsError}</div>}
      {toast && <div className="toast">{toast}</div>}
      {nearby && (
        <NearbyBanner poi={nearby} onPlay={playFromBanner} onDismiss={() => setNearby(null)} />
      )}
      {selected && (
        <PoiSheet
          poi={selected}
          visited={tracker.isVisited(selected.id)}
          onPlay={playFromSheet}
          onClose={() => setSelected(null)}
        />
      )}
      <AudioBar />
      {DEBUG && (
        <DebugPanel
          pois={POIS}
          onTeleport={(lat, lng) =>
            handleFix({ lat, lng, accuracy: 10, timestamp: Date.now() })
          }
          onResetVisited={() => {
            tracker.resetVisited()
            setVisitedTick((n) => n + 1)
          }}
        />
      )}
    </div>
  )
}
