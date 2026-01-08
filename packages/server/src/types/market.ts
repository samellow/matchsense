/**
 * Market types
 */

export type MarketType = 
  | '1X' 
  | 'X2' 
  | 'Over 1.5 Goals' 
  | 'Under 4.5 Goals' 
  | 'Both Teams To Score - Yes' 
  | 'Both Teams To Score - No'
  | 'Team To Score - Yes'

export interface ScoredMarket {
  fixtureId: number
  homeTeam: string
  awayTeam: string
  league: string
  leagueId: number
  market: MarketType
  odds: number
  riskScore: number
  confidence: 'Low' | 'Medium' | 'High'
  reasoning: {
    formScore: number
    goalTrendScore: number
    defensiveScore: number
    positionScore: number
    h2hScore: number
    oddsScore: number
  }
}

