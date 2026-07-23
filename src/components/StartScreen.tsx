import type { PackStatus } from '../App'

interface Props {
  packStatus: PackStatus
  onDownload: () => void
  onStart: () => void
}

function fmtMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1)
}

export default function StartScreen({ packStatus, onDownload, onStart }: Props) {
  return (
    <div className="start-screen">
      <div className="start-hero">
        <h1>Zakynthos Town</h1>
        <p className="start-sub">A self-guided audio walk through Zante</p>
      </div>

      <div className="start-pack">
        {packStatus.kind === 'checking' && <p className="pack-note">Checking offline pack…</p>}
        {packStatus.kind === 'ready' && (
          <p className="pack-note ok">✓ Downloaded — works fully offline</p>
        )}
        {packStatus.kind === 'none' && (
          <>
            <p className="pack-note">
              Download the map and all audio now (~30&nbsp;MB) so the tour works with no
              signal or data.
            </p>
            <button className="btn secondary" onClick={onDownload}>
              Download for offline use
            </button>
          </>
        )}
        {packStatus.kind === 'downloading' && (
          <div className="pack-progress">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.round(
                    (packStatus.progress.downloadedBytes /
                      Math.max(1, packStatus.progress.totalBytes)) *
                      100,
                  )}%`,
                }}
              />
            </div>
            <p className="pack-note">
              {fmtMB(packStatus.progress.downloadedBytes)} / {fmtMB(packStatus.progress.totalBytes)}{' '}
              MB — {packStatus.progress.currentFile}
            </p>
          </div>
        )}
        {packStatus.kind === 'error' && (
          <>
            <p className="pack-note err">Offline pack: {packStatus.message}</p>
            <button className="btn secondary" onClick={onDownload}>
              Retry download
            </button>
          </>
        )}
      </div>

      <button className="btn primary start-btn" onClick={onStart}>
        ▶ Start tour
      </button>

      <p className="start-hint">
        Tip: add this page to your Home Screen for the best experience. Audio plays
        automatically as you walk up to each stop.
      </p>
    </div>
  )
}
