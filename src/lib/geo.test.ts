import { describe, expect, test } from 'bun:test'
import { GeofenceTracker, haversineM, type Fix } from './geo'
import type { Poi } from '../data/pois'

// localStorage shim for bun test
const store = new Map<string, string>()
;(globalThis as Record<string, unknown>).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
}

const POI: Poi = {
  id: 'test',
  order: 1,
  name: 'Test POI',
  nameEl: 'Τεστ',
  lat: 37.7822,
  lng: 20.8956,
  radiusM: 50,
  audio: 'audio/test.mp3',
  photo: null,
  tagline: 't',
  transcript: 't',
}

function fix(lat: number, lng: number, accuracy = 10): Fix {
  return { lat, lng, accuracy, timestamp: 0 }
}

// ~0.00045° latitude ≈ 50 m
const NEAR = fix(POI.lat + 0.0001, POI.lng) // ~11 m away
const FAR = fix(POI.lat + 0.003, POI.lng) // ~330 m away

function freshTracker(): GeofenceTracker {
  store.clear()
  return new GeofenceTracker([POI])
}

describe('haversineM', () => {
  test('zero distance', () => {
    expect(haversineM({ lat: 37, lng: 20 }, { lat: 37, lng: 20 })).toBe(0)
  })
  test('1 degree latitude ≈ 111 km', () => {
    const d = haversineM({ lat: 37, lng: 20 }, { lat: 38, lng: 20 })
    expect(d).toBeGreaterThan(110000)
    expect(d).toBeLessThan(112000)
  })
})

describe('GeofenceTracker', () => {
  test('requires 2 consecutive fixes inside radius', () => {
    const t = freshTracker()
    expect(t.update(NEAR)).toBeNull() // 1st fix — not yet
    expect(t.update(NEAR)?.id).toBe('test') // 2nd fix — trigger
  })

  test('inaccurate fixes are ignored', () => {
    const t = freshTracker()
    expect(t.update(fix(POI.lat, POI.lng, 80))).toBeNull()
    expect(t.update(fix(POI.lat, POI.lng, 80))).toBeNull()
    expect(t.update(NEAR)).toBeNull()
    expect(t.update(NEAR)?.id).toBe('test')
  })

  test('a far fix resets the confirmation counter', () => {
    const t = freshTracker()
    expect(t.update(NEAR)).toBeNull()
    expect(t.update(FAR)).toBeNull()
    expect(t.update(NEAR)).toBeNull() // counter restarted
    expect(t.update(NEAR)?.id).toBe('test')
  })

  test('visited POI does not re-trigger, even after exit + re-entry', () => {
    const t = freshTracker()
    t.update(NEAR)
    const poi = t.update(NEAR)
    expect(poi?.id).toBe('test')
    t.markVisited('test')
    // walk out beyond radius + slack (50 + 40 = 90 m)
    t.update(FAR)
    // come back
    expect(t.update(NEAR)).toBeNull()
    expect(t.update(NEAR)).toBeNull()
  })

  test('hysteresis: staying within slack ring does not re-arm', () => {
    const t = freshTracker()
    t.update(NEAR)
    t.update(NEAR)
    // ~60 m: outside radius (50) but inside radius + slack (90) → still "inside"
    const ring = fix(POI.lat + 0.00054, POI.lng)
    t.update(ring)
    t.update(ring)
    // back near center: no new trigger because never exited (and not visited yet
    // — trigger fires once per entry)
    expect(t.update(NEAR)).toBeNull()
  })

  test('resetVisited re-arms after leaving', () => {
    const t = freshTracker()
    t.update(NEAR)
    t.update(NEAR)
    t.markVisited('test')
    t.update(FAR) // exit
    t.resetVisited()
    t.update(NEAR)
    expect(t.update(NEAR)?.id).toBe('test')
  })

  test('overlapping geofences: nearest triggers first, other stays armed', () => {
    store.clear()
    const poiB: Poi = { ...POI, id: 'b', lat: POI.lat + 0.0005, radiusM: 80 } // ~55 m north
    const t = new GeofenceTracker([POI, poiB])
    // stand at POI center — inside both fences (b is 55 m away, radius 80)
    const at = fix(POI.lat, POI.lng)
    expect(t.update(at)).toBeNull()
    expect(t.update(at)?.id).toBe('test') // nearest wins
    // next fix: b is still armed and fires
    expect(t.update(at)?.id).toBe('b')
  })

  test('visited state persists across tracker instances', () => {
    const t = freshTracker()
    t.update(NEAR)
    t.update(NEAR)
    t.markVisited('test')
    const t2 = new GeofenceTracker([POI])
    expect(t2.isVisited('test')).toBe(true)
  })
})
