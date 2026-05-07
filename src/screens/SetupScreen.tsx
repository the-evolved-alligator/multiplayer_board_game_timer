import type { Player, PlayerTemplate } from '../domain/types'
import { PRESET_COLORS, randomPresetColor } from '../domain/colors'

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function clampInt(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.trunc(v)))
}

export function SetupScreen({
  template,
  onTemplateChange,
  onStart,
}: {
  template: PlayerTemplate
  onTemplateChange: (t: PlayerTemplate) => void
  onStart: () => void
}) {
  const canStart = template.players.length >= 2 && template.turnSeconds > 0

  function updatePlayers(players: Player[]) {
    onTemplateChange({ ...template, players })
  }

  function move(from: number, to: number) {
    const players = template.players.slice()
    const [item] = players.splice(from, 1)
    players.splice(to, 0, item)
    updatePlayers(players)
  }

  return (
    <div className="screen">
      <header className="topbar">
        <div className="topbar__title">
          <div className="kicker">Setup</div>
          <h1>Multiplayer Timer</h1>
        </div>
      </header>

      <div className="setupTopRow">
        <div className="card card--turnLength">
          <div className="row row--between row--gap">
            <div>
              <div className="label">Turn length (seconds)</div>
            </div>
            <input
              className="input input--num"
              inputMode="numeric"
              pattern="[0-9]*"
              value={template.turnSeconds}
              onChange={(e) => {
                const raw = Number(e.target.value)
                onTemplateChange({
                  ...template,
                  turnSeconds: clampInt(Number.isFinite(raw) ? raw : template.turnSeconds, 1, 60 * 60),
                })
              }}
              aria-label="Turn length seconds"
            />
          </div>
        </div>

        <div className="footer footer--setup">
          <button className="btn btn--primary btn--xl" type="button" disabled={!canStart} onClick={onStart}>
            Start Game Timer
          </button>
        </div>
      </div>

      <div className="card">
        <div className="row row--between row--gap">
          <div>
            <div className="label">Players</div>
            <div className="hint">Add at least 2. Reorder for turn order.</div>
          </div>
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => {
              const id = newId()
              const next: Player = {
                id,
                name: `Player ${template.players.length + 1}`,
                color: randomPresetColor(),
              }
              updatePlayers([...template.players, next])
            }}
          >
            Add player
          </button>
        </div>

        <div className="list">
          {template.players.length === 0 && <div className="empty">No players yet.</div>}
          {template.players.map((p, idx) => (
            <div key={p.id} className="playerRow">
              <div className="playerRow__main">
                <input
                  className="input"
                  value={p.name}
                  style={{ borderColor: p.color }}
                  onChange={(e) => {
                    const players = template.players.slice()
                    players[idx] = { ...players[idx], name: e.target.value }
                    updatePlayers(players)
                  }}
                  aria-label={`Player ${idx + 1} name`}
                />
              </div>
              <div className="presets">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`preset ${p.color.toLowerCase() === color ? 'preset--active' : ''}`}
                    type="button"
                    onClick={() => {
                      const players = template.players.slice()
                      players[idx] = { ...players[idx], color }
                      updatePlayers(players)
                    }}
                    style={{ background: color }}
                    aria-label={`Set color ${color}`}
                    title={color}
                  />
                ))}
              </div>

              <div className="playerRow__actions">
                <button
                  className="btn"
                  type="button"
                  disabled={idx === 0}
                  onClick={() => move(idx, idx - 1)}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  className="btn"
                  type="button"
                  disabled={idx === template.players.length - 1}
                  onClick={() => move(idx, idx + 1)}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  className="btn btn--danger"
                  type="button"
                  onClick={() => updatePlayers(template.players.filter((x) => x.id !== p.id))}
                  aria-label="Remove"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

