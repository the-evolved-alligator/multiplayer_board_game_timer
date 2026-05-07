export const PRESET_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
  '#ec4899',
]

export function randomPresetColor() {
  const idx = Math.floor(Math.random() * PRESET_COLORS.length)
  return PRESET_COLORS[idx]
}

