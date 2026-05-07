import { useEffect, useMemo, useRef, useState } from 'react'
import type { PlayerTemplate } from '../domain/types'

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

function formatMs(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(s / 60)
  const r = s % 60
  if (m <= 0) return `${r}s`
  return `${m}:${r.toString().padStart(2, '0')}`
}

export function LiveTimerScreen({
  session,
  onSessionChange,
  onFinish,
}: {
  session: LiveSession
  onSessionChange: (s: LiveSession) => void
  onFinish: (summary: GameSummary) => void
}) {
  const { template } = session
  const activePlayer = template.players[session.activeIndex]

  // timer model: track a target end timestamp when running (remainingMs at resume/start)
  const endAtRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(Date.now())
  const audioCtxRef = useRef<AudioContext | null>(null)
  const beepIntervalRef = useRef<number | null>(null)
  const vibrationIntervalRef = useRef<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  function playBeep() {
    try {
      const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctx) return
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx()
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = 880
      gain.gain.value = 0.08
      osc.connect(gain)
      gain.connect(ctx.destination)
      const startAt = ctx.currentTime
      const stopAt = startAt + 0.16
      osc.start(startAt)
      osc.stop(stopAt)
    } catch {
      // ignore browser/audio restrictions
    }
  }

  function startTimeoutAlerts() {
    if (beepIntervalRef.current !== null) return

    playBeep()
    beepIntervalRef.current = window.setInterval(() => {
      playBeep()
    }, 700)

    if ('vibrate' in navigator) {
      navigator.vibrate([300, 120, 300, 120, 300])
      vibrationIntervalRef.current = window.setInterval(() => {
        navigator.vibrate([300, 120, 300, 120, 300])
      }, 1200)
    }
  }

  function stopTimeoutAlerts() {
    if (beepIntervalRef.current !== null) {
      window.clearInterval(beepIntervalRef.current)
      beepIntervalRef.current = null
    }
    if (vibrationIntervalRef.current !== null) {
      window.clearInterval(vibrationIntervalRef.current)
      vibrationIntervalRef.current = null
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0)
    }
  }

  // keep ref aligned with state (when session changes externally)
  useEffect(() => {
    if (session.isPaused || session.isTimeout) {
      endAtRef.current = null
      return
    }
    endAtRef.current = Date.now() + session.remainingMs
  }, [session.isPaused, session.isTimeout, session.remainingMs, session.activeIndex])

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 150)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (session.isTimeout) {
      startTimeoutAlerts()
    } else {
      stopTimeoutAlerts()
    }
    return () => {
      stopTimeoutAlerts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isTimeout])

  const remainingMs = useMemo(() => {
    if (session.isPaused || session.isTimeout) return session.remainingMs
    const endAt = endAtRef.current
    if (!endAt) return session.remainingMs
    return Math.max(0, endAt - now)
  }, [now, session.isPaused, session.isTimeout, session.remainingMs])

  function elapsedSecondsForCurrentTurn() {
    const turnSeconds = template.turnSeconds
    const remainingSeconds = Math.ceil(remainingMs / 1000)
    return Math.max(0, Math.min(turnSeconds, turnSeconds - remainingSeconds))
  }

  function totalsWithActiveTurnApplied() {
    // Timeout already credits full turn at the transition to isTimeout=true.
    if (session.isTimeout) return session.totalsById
    const currentId = template.players[session.activeIndex]?.id
    if (!currentId) return session.totalsById
    const totalsById = { ...session.totalsById }
    totalsById[currentId] = (totalsById[currentId] ?? 0) + elapsedSecondsForCurrentTurn()
    return totalsById
  }

  // timeout detection + transition
  useEffect(() => {
    const lastTick = lastTickRef.current
    lastTickRef.current = now
    if (now === lastTick) return
    if (session.isPaused || session.isTimeout) return
    if (remainingMs > 0) return

    const turnSeconds = template.turnSeconds
    const id = template.players[session.activeIndex]?.id
    if (!id) return

    const totalsById = { ...session.totalsById }
    totalsById[id] = (totalsById[id] ?? 0) + turnSeconds

    onSessionChange({
      ...session,
      isTimeout: true,
      remainingMs: 0,
      totalsById,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, remainingMs, session.isPaused, session.isTimeout, session.activeIndex, template.turnSeconds])

  function setRunning(remaining: number) {
    endAtRef.current = Date.now() + remaining
    onSessionChange({ ...session, isPaused: false, isTimeout: false, remainingMs: remaining })
  }

  function startPlayer(index: number, totalsById = session.totalsById) {
    const bounded = ((index % template.players.length) + template.players.length) % template.players.length
    endAtRef.current = Date.now() + template.turnSeconds * 1000
    onSessionChange({
      ...session,
      activeIndex: bounded,
      isPaused: false,
      isTimeout: false,
      remainingMs: template.turnSeconds * 1000,
      totalsById,
    })
  }

  function manualSwitch(toIndex: number, creditElapsed: boolean) {
    let totalsById = session.totalsById
    if (creditElapsed) {
      const currentId = template.players[session.activeIndex]?.id
      if (currentId) {
        totalsById = { ...session.totalsById }
        totalsById[currentId] = (totalsById[currentId] ?? 0) + elapsedSecondsForCurrentTurn()
      }
    }
    // when creditElapsed is false (skip), outgoing player gets 0
    startPlayer(toIndex, totalsById)
  }

  const bg = activePlayer?.color || '#111827'

  return (
    <div className="screen live" style={{ background: bg }}>
      <header className="topbar topbar--live">
        <div className="topbar__title">
          <div className="kicker">Live</div>
          <h1>{activePlayer?.name ?? '—'}</h1>
        </div>
        <button
          className="btn"
          type="button"
          onClick={() => onFinish({ template, totalsById: totalsWithActiveTurnApplied() })}
        >
          Finish
        </button>
      </header>

      <div className="timerCard">
        <div className="timerValue">{formatMs(remainingMs)}</div>
        {session.isTimeout && <div className="badge badge--timeout">TIMEOUT — host action required</div>}
        {session.isPaused && !session.isTimeout && <div className="badge">Paused</div>}
      </div>

      <div className="controls">
        <button
          className="btn btn--xl btn--live"
          type="button"
          onClick={() => manualSwitch(session.activeIndex - 1, true)}
          disabled={template.players.length < 2}
        >
          Previous
        </button>

        <button
          className="btn btn--primary btn--xl btn--live"
          type="button"
          onClick={() => {
            if (session.isTimeout) {
              startPlayer(session.activeIndex + 1)
              return
            }
            if (session.isPaused) {
              setRunning(session.remainingMs)
              return
            }
            onSessionChange({
              ...session,
              isPaused: true,
              remainingMs: remainingMs,
            })
          }}
        >
          {session.isTimeout ? 'Advance' : session.isPaused ? 'Resume' : 'Pause'}
        </button>

        <button
          className="btn btn--xl btn--live"
          type="button"
          onClick={() => manualSwitch(session.activeIndex + 1, true)}
          disabled={template.players.length < 2}
        >
          Next
        </button>
      </div>

      <div className="controls">
        <button
          className="btn btn--danger btn--xl btn--live"
          type="button"
          onClick={() => manualSwitch(session.activeIndex + 1, false)}
          disabled={template.players.length < 2 || session.isTimeout}
          title="End current turn early (credits 0)"
        >
          Skip/Advance
        </button>
      </div>
    </div>
  )
}

