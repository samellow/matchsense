/**
 * Bet generation types
 */

import type { ScoredMarket } from './market.js'

export interface BetSelection {
  fixtureId: number
  homeTeam: string
  awayTeam: string
  league: string
  market: string
  odds: number
  riskScore: number
}

export interface GeneratedBet {
  totalOdds: number
  confidence: 'High' | 'Medium' | 'Low'
  selections: BetSelection[]
  explanation: string
}

export interface BetGenerationResult {
  date: string
  lowRisk: GeneratedBet | null
  mediumRisk: GeneratedBet | null
}

export interface BetOptimizationParams {
  scoredMarkets: ScoredMarket[]
  targetMinOdds: number
  targetMaxOdds: number
  minSelections: number
  maxSelections: number
  maxRiskScore: number
}

