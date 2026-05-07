import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { Player, PlayerTemplate } from './domain/types'
import { loadTemplate, saveTemplate } from './domain/storage'
import { randomPresetColor } from './domain/colors'
import { SetupScreen } from './screens/SetupScreen'
import { LiveTimerScreen } from './screens/LiveTimerScreen'
import { SummaryScreen } from './screens/SummaryScreen'

type Screen =
  | { id: 'setup' }
  | { id: 'live'; session: LiveSession }
  | { id: 'summary'; summary: GameSummary; template: PlayerTemplate }

type LiveSession = {
  template: PlayerTemplate
  activeIndex: number
  isPaused: boolean
  isTimeout: boolean
  remainingMs: number
  totalsById: Record<string, number>
}

type GameSummary = {
  template: PlayerTemplate
  totalsById: Record<string, number>
}

const DEFAULT_TURN_SECONDS = 60

function buildInitialTemplate(): PlayerTemplate {
  const stored = loadTemplate()
  if (stored) return stored
  return { turnSeconds: DEFAULT_TURN_SECONDS, players: [] }
}

function normalizePlayers(players: Player[]): Player[] {
  return players.map((p) => ({
    ...p,
    color: p.color || randomPresetColor(),
  }))
}

function App() {
  const [template, setTemplate] = useState<PlayerTemplate>(() => buildInitialTemplate())
  const [screen, setScreen] = useState<Screen>({ id: 'setup' })

  useEffect(() => {
    saveTemplate(template)
  }, [template])

  const normalizedTemplate = useMemo<PlayerTemplate>(() => {
    return {
      ...template,
      players: normalizePlayers(template.players),
    }
  }, [template])

  return (
    <div className="app">
      {screen.id === 'setup' && (
        <SetupScreen
          template={normalizedTemplate}
          onTemplateChange={setTemplate}
          onStart={() => {
            const t = normalizedTemplate
            setTemplate(t)
            setScreen({
              id: 'live',
              session: {
                template: t,
                activeIndex: 0,
                isPaused: false,
                isTimeout: false,
                remainingMs: t.turnSeconds * 1000,
                totalsById: Object.fromEntries(t.players.map((p) => [p.id, 0])),
              },
            })
          }}
        />
      )}

      {screen.id === 'live' && (
        <LiveTimerScreen
          session={screen.session}
          onSessionChange={(next) => setScreen({ id: 'live', session: next })}
          onFinish={(summary) =>
            setScreen({ id: 'summary', summary, template: normalizedTemplate })
          }
        />
      )}

      {screen.id === 'summary' && (
        <SummaryScreen
          summary={screen.summary}
          onReset={() => {
            setTemplate(screen.template)
            setScreen({ id: 'setup' })
          }}
        />
      )}
    </div>
  )
}

export default App
