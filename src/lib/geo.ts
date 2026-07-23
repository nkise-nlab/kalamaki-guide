import type { Poi } from '../data/pois'

export interface Fix {
  lat: number
  lng: number
  accuracy: number
  timestamp: number
}

export interface LatLng {
  lat: number
  lng: number
}

const EARTH_RADIUS_M = 6371000

export function haversineM(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h))
}

export interface GeofenceOptions {
  /** Fixes worse than this accuracy (meters) are ignored for triggering. */
  accuracyMaxM?: number
  /** Consecutive in-radius fixes required before a POI triggers. */
  confirmFixes?: number
  /** A POI counts as exited only beyond radius + this slack (hysteresis). */
  exitSlackM?: number
}

interface PoiState {
  hits: number
  inside: boolean
}

/**
 * Geofence state machine. Feed it GPS fixes; it returns the POI that should
 * start playing, if any. Urban GPS is noisy, so a trigger needs
 * `confirmFixes` consecutive accurate fixes inside the radius, and a POI is
 * only re-armed after the user leaves radius + exitSlackM.
 */
export class GeofenceTracker {
  private readonly pois: readonly Poi[]
  private readonly accuracyMaxM: number
  private readonly confirmFixes: number
  private readonly exitSlackM: number
  private readonly state = new Map<string, PoiState>()
  private visited: Set<string>

  constructor(pois: readonly Poi[], opts: GeofenceOptions = {}) {
    this.pois = pois
    this.accuracyMaxM = opts.accuracyMaxM ?? 40
    this.confirmFixes = opts.confirmFixes ?? 2
    this.exitSlackM = opts.exitSlackM ?? 40
    this.visited = loadVisited()
    for (const poi of pois) this.state.set(poi.id, { hits: 0, inside: false })
  }

  isVisited(id: string): boolean {
    return this.visited.has(id)
  }

  markVisited(id: string): void {
    this.visited.add(id)
    saveVisited(this.visited)
  }

  resetVisited(): void {
    this.visited = new Set()
    saveVisited(this.visited)
    for (const st of this.state.values()) {
      st.hits = 0
      st.inside = false
    }
  }

  /** Process a fix. Returns the POI to trigger, or null. */
  update(fix: Fix): Poi | null {
    if (fix.accuracy > this.accuracyMaxM) return null
    let triggered: Poi | null = null
    for (const poi of this.pois) {
      const st = this.state.get(poi.id)
      if (!st) continue
      const dist = haversineM(fix, { lat: poi.lat, lng: poi.lng })
      if (st.inside) {
        if (dist > poi.radiusM + this.exitSlackM) {
          st.inside = false
          st.hits = 0
        }
        continue
      }
      if (dist <= poi.radiusM) {
        st.hits += 1
        if (st.hits >= this.confirmFixes) {
          st.inside = true
          if (!this.visited.has(poi.id) && triggered === null) {
            triggered = poi
          }
        }
      } else {
        st.hits = 0
      }
    }
    return triggered
  }
}

const VISITED_KEY = 'zante-guide-visited'

function loadVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(VISITED_KEY)
    if (!raw) return new Set()
    const arr: unknown = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [])
  } catch {
    return new Set()
  }
}

function saveVisited(visited: Set<string>): void {
  try {
    localStorage.setItem(VISITED_KEY, JSON.stringify([...visited]))
  } catch {
    // storage full/blocked — visited state just won't persist
  }
}
