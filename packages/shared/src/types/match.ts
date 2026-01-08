export type RiskLevel = 'low' | 'medium' | 'high'

export type ConfidenceLevel = 'low' | 'medium' | 'high'

export interface Match {
  id: string
  league: string
  time: string // Format: "HH:mm"
  homeTeam: string
  awayTeam: string
  market: string
  odds: number
}

export interface BetPick {
  id: string
  riskLevel: RiskLevel
  totalOdds: number
  matches: Match[]
  confidence: ConfidenceLevel
  explanation: string
  date: string
}

