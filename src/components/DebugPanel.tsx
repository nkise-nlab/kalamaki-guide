import { useState } from 'react'
import type { Poi } from '../data/pois'

interface Props {
  pois: readonly Poi[]
  onTeleport: (lat: number, lng: number) => void
  onResetVisited: () => void
}

/** Dev-only (?debug=1): fake GPS fixes to test geofencing from anywhere. */
export default function DebugPanel({ pois, onTeleport, onResetVisited }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="debug-panel">
      <button className="btn secondary" onClick={() => setOpen((o) => !o)}>
        🐞 {open ? 'Close' : 'Debug'}
      </button>
      {open && (
        <div className="debug-body">
          {pois.map((poi) => (
            <button key={poi.id} onClick={() => onTeleport(poi.lat, poi.lng)}>
              → {poi.order}. {poi.name}
            </button>
          ))}
          <button onClick={() => onTeleport(37.75, 20.87)}>→ far away (exit all)</button>
          <button onClick={onResetVisited}>Reset visited</button>
        </div>
      )}
    </div>
  )
}
