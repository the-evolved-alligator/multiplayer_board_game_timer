import type { PlayerTemplate } from '../domain/types'

type GameSummary = {
  template: PlayerTemplate
  totalsById: Record<string, number>
}

export function SummaryScreen({
  summary,
  onReset,
}: {
  summary: GameSummary
  onReset: () => void
}) {
  const rows = summary.template.players
    .map((p) => ({ player: p, total: summary.totalsById[p.id] ?? 0 }))
    .sort((a, b) => b.total - a.total)

  return (
    <div className="screen">
      <header className="topbar">
        <div className="topbar__title">
          <div className="kicker">Game Summary</div>
          <h1>Totals</h1>
        </div>
      </header>

      <div className="card">
        <div className="list">
          {rows.map(({ player, total }, idx) => (
            <div key={player.id} className="summaryRow">
              <div className="summaryRow__rank">#{idx + 1}</div>
              <div className="dot" style={{ background: player.color }} />
              <div className="summaryRow__name">{player.name}</div>
              <div className="summaryRow__val">{total}s</div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer">
        <button className="btn btn--primary btn--xl" type="button" onClick={onReset}>
          Reset (keep setup)
        </button>
      </div>
    </div>
  )
}

