import type { PlayerTemplate } from './types'

const KEY = 'mbgt:playerTemplate:v1'

export function loadTemplate(): PlayerTemplate | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return null
    const t = parsed as Partial<PlayerTemplate>
    if (!Array.isArray(t.players)) return null
    const turnSeconds = typeof t.turnSeconds === 'number' && Number.isFinite(t.turnSeconds) ? t.turnSeconds : 60
    return {
      turnSeconds,
      players: t.players
        .filter((p) => p && typeof p === 'object')
        .map((p) => p as any),
    }
  } catch {
    return null
  }
}

export function saveTemplate(template: PlayerTemplate) {
  try {
    localStorage.setItem(KEY, JSON.stringify(template))
  } catch {
    // ignore quota / privacy mode errors
  }
}

