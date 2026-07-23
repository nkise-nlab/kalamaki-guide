import { useEffect, useState } from 'react'
import * as audio from '../lib/audio'

function fmt(t: number): string {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AudioBar() {
  const [, setTick] = useState(0)
  useEffect(() => audio.subscribe(() => setTick((n) => n + 1)), [])

  const st = audio.getState()
  if (!st.nowPlaying) return null

  const pct = st.duration > 0 ? (st.currentTime / st.duration) * 100 : 0

  return (
    <div className="audio-bar">
      <button className="audio-btn" onClick={() => audio.togglePlay()}>
        {st.paused ? '▶' : '⏸'}
      </button>
      <div className="audio-info">
        <span className="audio-title">{st.nowPlaying.title}</span>
        <div className="audio-progress">
          <div className="audio-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="audio-time">
          {fmt(st.currentTime)} / {fmt(st.duration)}
        </span>
      </div>
      <button className="audio-btn small" onClick={() => audio.seekBy(-10)}>
        −10s
      </button>
      <button className="audio-btn small" onClick={() => audio.stop()}>
        ✕
      </button>
    </div>
  )
}
