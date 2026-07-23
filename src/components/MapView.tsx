import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { layers, namedFlavor } from '@protomaps/basemaps'
import type { Feature, FeatureCollection } from 'geojson'
import type { Poi } from '../data/pois'
import type { Fix } from '../lib/geo'
import { withAbsBase } from '../lib/base'

interface Props {
  pois: readonly Poi[]
  fix: Fix | null
  visitedTick: number
  isVisited: (id: string) => boolean
  onSelect: (poi: Poi) => void
}

const TOWN_CENTER: [number, number] = [20.8956, 37.7822]

/** ~64-gon polygon approximating a circle of `radiusM` meters. */
function circlePolygon(lng: number, lat: number, radiusM: number): Feature {
  const points: [number, number][] = []
  const dLat = radiusM / 111320
  const dLng = radiusM / (111320 * Math.cos((lat * Math.PI) / 180))
  for (let i = 0; i <= 64; i++) {
    const theta = (i / 64) * 2 * Math.PI
    points.push([lng + dLng * Math.cos(theta), lat + dLat * Math.sin(theta)])
  }
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [points] },
  }
}

export default function MapView({ pois, fix, visitedTick, isVisited, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const userMarkerRef = useRef<maplibregl.Marker | null>(null)
  const poiMarkersRef = useRef(new Map<string, { marker: maplibregl.Marker; el: HTMLElement }>())
  const followRef = useRef(true)

  // Init once.
  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return

    const map = new maplibregl.Map({
      container,
      center: TOWN_CENTER,
      zoom: 15,
      minZoom: 8,
      maxZoom: 19,
      attributionControl: { compact: true },
      style: {
        version: 8,
        glyphs: withAbsBase('map/fonts/{fontstack}/{range}.pbf'),
        sprite: withAbsBase('map/sprites/light'),
        sources: {
          protomaps: {
            type: 'vector',
            // Plain static tiles committed at build time; the service worker
            // serves them from the tour-pack cache when offline. Missing
            // tiles (outside the downloaded area) just render empty.
            tiles: [withAbsBase('map/tiles/{z}/{x}/{y}.mvt')],
            minzoom: 0,
            maxzoom: 15, // MapLibre overzooms z15 data up to maxZoom
            attribution: '© OpenStreetMap contributors, Protomaps',
          },
        },
        layers: layers('protomaps', namedFlavor('light'), { lang: 'en' }),
      },
    })
    mapRef.current = map

    map.on('dragstart', () => {
      followRef.current = false
    })

    map.on('load', () => {
      map.addSource('accuracy', { type: 'geojson', data: emptyFC() })
      map.addLayer({
        id: 'accuracy-fill',
        type: 'fill',
        source: 'accuracy',
        paint: { 'fill-color': '#4aa3ff', 'fill-opacity': 0.15 },
      })
    })

    // Tiles outside the offline pack 404 — that's expected, don't spam.
    map.on('error', (e) => {
      if (!/tile/i.test(e.error?.message ?? '')) console.error(e.error)
    })

    for (const poi of pois) {
      const el = document.createElement('button')
      el.className = 'poi-marker'
      el.textContent = String(poi.order)
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        onSelect(poi)
      })
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([poi.lng, poi.lat])
        .addTo(map)
      poiMarkersRef.current.set(poi.id, { marker, el })
    }

    return () => {
      map.remove()
      mapRef.current = null
      poiMarkersRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Visited styling
  useEffect(() => {
    for (const [id, { el }] of poiMarkersRef.current) {
      el.classList.toggle('visited', isVisited(id))
    }
  }, [visitedTick, isVisited])

  // User position
  useEffect(() => {
    const map = mapRef.current
    if (!map || !fix) return
    if (!userMarkerRef.current) {
      const dot = document.createElement('div')
      dot.className = 'user-dot'
      userMarkerRef.current = new maplibregl.Marker({ element: dot, anchor: 'center' })
        .setLngLat([fix.lng, fix.lat])
        .addTo(map)
    } else {
      userMarkerRef.current.setLngLat([fix.lng, fix.lat])
    }
    const src = map.getSource('accuracy') as maplibregl.GeoJSONSource | undefined
    if (src) {
      src.setData({
        type: 'FeatureCollection',
        features: [circlePolygon(fix.lng, fix.lat, fix.accuracy)],
      })
    }
    if (followRef.current) {
      map.easeTo({ center: [fix.lng, fix.lat], duration: 500 })
    }
  }, [fix])

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map-container" />
      <button
        className="locate-btn"
        aria-label="Center on me"
        onClick={() => {
          followRef.current = true
          if (fix && mapRef.current) {
            mapRef.current.easeTo({ center: [fix.lng, fix.lat], zoom: 16 })
          }
        }}
      >
        ◎
      </button>
    </div>
  )
}

function emptyFC(): FeatureCollection {
  return { type: 'FeatureCollection', features: [] }
}
