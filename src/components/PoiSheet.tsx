import { useState } from 'react'
import type { Poi } from '../data/pois'
import { withBase } from '../lib/base'

interface Props {
  poi: Poi
  visited: boolean
  onPlay: (poi: Poi) => void
  onClose: () => void
}

export default function PoiSheet({ poi, visited, onPlay, onClose }: Props) {
  const [showTranscript, setShowTranscript] = useState(false)
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        {poi.photo && (
          <img className="sheet-photo" src={withBase(poi.photo)} alt={poi.name} loading="lazy" />
        )}
        <h2>
          {poi.order}. {poi.name} {visited && <span className="visited-mark">✓</span>}
        </h2>
        <p className="sheet-greek">{poi.nameEl}</p>
        <p className="sheet-tagline">{poi.tagline}</p>
        <div className="sheet-actions">
          <button className="btn primary" onClick={() => onPlay(poi)}>
            ▶ Play guide
          </button>
          <button className="btn secondary" onClick={() => setShowTranscript((s) => !s)}>
            {showTranscript ? 'Hide text' : 'Read instead'}
          </button>
        </div>
        {showTranscript && <p className="sheet-transcript">{poi.transcript}</p>}
      </div>
    </div>
  )
}
