import type { Poi } from '../data/pois'

interface Props {
  poi: Poi
  onPlay: (poi: Poi) => void
  onDismiss: () => void
}

export default function NearbyBanner({ poi, onPlay, onDismiss }: Props) {
  return (
    <div className="nearby-banner" role="alert">
      <div className="nearby-text">
        <strong>You’re near {poi.name}</strong>
        <span>{poi.tagline}</span>
      </div>
      <button className="btn primary" onClick={() => onPlay(poi)}>
        ▶ Listen
      </button>
      <button className="banner-close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}
