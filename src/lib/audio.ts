import { withBase } from './base'
import type { Poi } from '../data/pois'

/**
 * One persistent <audio> element for the whole app. iOS blesses the element
 * (not the origin) on a user gesture, so every later programmatic play —
 * including geofence-triggered ones — must reuse this exact element.
 */
const player = new Audio()
player.setAttribute('playsinline', '')
player.preload = 'auto'

let unlocked = false

export interface NowPlaying {
  poiId: string
  title: string
}

type Listener = () => void
const listeners = new Set<Listener>()

export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function notify(): void {
  for (const fn of listeners) fn()
}

let nowPlaying: NowPlaying | null = null

for (const ev of ['play', 'pause', 'ended', 'timeupdate', 'durationchange'] as const) {
  player.addEventListener(ev, notify)
}

export function getState() {
  return {
    nowPlaying,
    paused: player.paused,
    ended: player.ended,
    currentTime: player.currentTime,
    duration: Number.isFinite(player.duration) ? player.duration : 0,
    unlocked,
  }
}

/**
 * Bless the audio element. MUST be called from a user-gesture handler
 * (the "Start tour" tap). Plays the given asset muted for an instant.
 */
export async function unlockAudio(assetPath: string): Promise<void> {
  if (unlocked) return
  try {
    player.muted = true
    player.src = withBase(assetPath)
    await player.play()
    player.pause()
    player.currentTime = 0
    unlocked = true
  } catch {
    // Element may still be blessed enough for gesture-driven plays;
    // geofence auto-play will fall back to the tap-to-listen banner.
  } finally {
    player.muted = false
  }
}

/** Play a POI's guide. Returns false if the browser refused (show banner). */
export async function playPoi(poi: Poi): Promise<boolean> {
  try {
    player.src = withBase(poi.audio)
    nowPlaying = { poiId: poi.id, title: poi.name }
    setMediaSession(poi)
    await player.play()
    unlocked = true
    notify()
    return true
  } catch {
    // play() flips paused=false synchronously even when it rejects — pause()
    // restores a truthful state so the app doesn't think audio is running.
    player.pause()
    nowPlaying = null
    notify()
    return false
  }
}

/** Play an arbitrary track (e.g. the welcome intro). */
export async function playTrack(assetPath: string, title: string, id = 'intro'): Promise<boolean> {
  try {
    player.src = withBase(assetPath)
    nowPlaying = { poiId: id, title }
    await player.play()
    unlocked = true
    notify()
    return true
  } catch {
    player.pause()
    nowPlaying = null
    notify()
    return false
  }
}

export function togglePlay(): void {
  if (player.paused) void player.play()
  else player.pause()
}

export function stop(): void {
  player.pause()
  player.removeAttribute('src')
  player.load()
  nowPlaying = null
  notify()
}

export function seekBy(seconds: number): void {
  player.currentTime = Math.max(0, player.currentTime + seconds)
}

export function onEnded(fn: () => void): () => void {
  player.addEventListener('ended', fn)
  return () => player.removeEventListener('ended', fn)
}

function setMediaSession(poi: Poi): void {
  if (!('mediaSession' in navigator)) return
  navigator.mediaSession.metadata = new MediaMetadata({
    title: poi.name,
    artist: 'Zante Audio Guide',
    album: 'Zakynthos Town Walking Tour',
    artwork: poi.photo ? [{ src: withBase(poi.photo), sizes: '512x512', type: 'image/jpeg' }] : [],
  })
  navigator.mediaSession.setActionHandler('play', () => void player.play())
  navigator.mediaSession.setActionHandler('pause', () => player.pause())
  navigator.mediaSession.setActionHandler('seekbackward', () => seekBy(-10))
  navigator.mediaSession.setActionHandler('seekforward', () => seekBy(10))
}
