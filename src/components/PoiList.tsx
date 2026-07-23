import type { Poi } from '../data/pois'
import { haversineM, type Fix } from '../lib/geo'

interface Props {
  pois: readonly Poi[]
  fix: Fix | null
  isVisited: (id: string) => boolean
  onSelect: (poi: Poi) => void
}

function fmtDist(m: number): string {
  return m < 950 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`
}

export default function PoiList({ pois, fix, isVisited, onSelect }: Props) {
  const sorted = [...pois].sort((a, b) => a.order - b.order)
  return (
    <div className="poi-list">
      {sorted.map((poi) => {
        const dist = fix ? haversineM(fix, { lat: poi.lat, lng: poi.lng }) : null
        const visited = isVisited(poi.id)
        return (
          <button key={poi.id} className="poi-row" onClick={() => onSelect(poi)}>
            <span className={`poi-num ${visited ? 'visited' : ''}`}>
              {visited ? '✓' : poi.order}
            </span>
            <span className="poi-row-text">
              <span className="poi-row-name">{poi.name}</span>
              <span className="poi-row-tagline">{poi.tagline}</span>
            </span>
            {dist !== null && <span className="poi-row-dist">{fmtDist(dist)}</span>}
          </button>
        )
      })}
    </div>
  )
}
