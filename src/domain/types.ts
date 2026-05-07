export type Player = {
  id: string
  name: string
  color: string
}

export type PlayerTemplate = {
  turnSeconds: number
  players: Player[]
}

