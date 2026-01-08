import type { ScoredMarket } from '../types/market.js'
import type { GeneratedBet, BetGenerationResult } from '../types/bet.js'
import { BET_TARGETS } from '../config/scoring.js'
import { optimizeBetslip } from './betslipOptimizer.js'
import { generateExplanations } from './explanationGenerator.js'

export function generateLowRiskBet(scoredMarkets: ScoredMarket[]): GeneratedBet | null {
  const params = {
    scoredMarkets,
    targetMinOdds: BET_TARGETS.LOW_RISK.MIN_ODDS,
    targetMaxOdds: BET_TARGETS.LOW_RISK.MAX_ODDS,
    minSelections: BET_TARGETS.LOW_RISK.MIN_SELECTIONS,
    maxSelections: BET_TARGETS.LOW_RISK.MAX_SELECTIONS,
    maxRiskScore: BET_TARGETS.LOW_RISK.MAX_RISK_SCORE,
  }

  const optimized = optimizeBetslip(params)

  if (!optimized) {
    return null
  }

  // Determine confidence based on average risk score
  const confidence = determineConfidence(optimized.averageRiskScore)
  const explanation = generateExplanations(optimized.selections)

  return {
    totalOdds: optimized.totalOdds,
    confidence,
    selections: optimized.selections.map(m => ({
      fixtureId: m.fixtureId,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      league: m.league,
      market: m.market,
      odds: m.odds,
      riskScore: m.riskScore,
    })),
    explanation,
  }
}

export function generateMediumRiskBet(scoredMarkets: ScoredMarket[]): GeneratedBet | null {
  const params = {
    scoredMarkets,
    targetMinOdds: BET_TARGETS.MEDIUM_RISK.MIN_ODDS,
    targetMaxOdds: BET_TARGETS.MEDIUM_RISK.MAX_ODDS,
    minSelections: BET_TARGETS.MEDIUM_RISK.MIN_SELECTIONS,
    maxSelections: BET_TARGETS.MEDIUM_RISK.MAX_SELECTIONS,
    maxRiskScore: BET_TARGETS.MEDIUM_RISK.MAX_RISK_SCORE,
  }

  const optimized = optimizeBetslip(params)

  if (!optimized) {
    return null
  }

  // Balance leagues to avoid correlation
  const balancedSelections = balanceLeagues(optimized.selections)
  
  const confidence = determineConfidence(optimized.averageRiskScore)
  const explanation = generateExplanations(balancedSelections)

  return {
    totalOdds: calculateTotalOdds(balancedSelections),
    confidence,
    selections: balancedSelections.map(m => ({
      fixtureId: m.fixtureId,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      league: m.league,
      market: m.market,
      odds: m.odds,
      riskScore: m.riskScore,
    })),
    explanation,
  }
}

function balanceLeagues(selections: ScoredMarket[]): ScoredMarket[] {
  // Count leagues
  const leagueCounts = new Map<string, number>()
  for (const selection of selections) {
    const count = leagueCounts.get(selection.league) || 0
    leagueCounts.set(selection.league, count + 1)
  }

  // If any league has more than 2 selections, try to balance
  const maxPerLeague = 2
  const balanced: ScoredMarket[] = []
  const leagueUsed = new Map<string, number>()

  // Sort by risk score to keep best picks
  const sorted = [...selections].sort((a, b) => a.riskScore - b.riskScore)

  for (const selection of sorted) {
    const used = leagueUsed.get(selection.league) || 0
    if (used < maxPerLeague) {
      balanced.push(selection)
      leagueUsed.set(selection.league, used + 1)
    }
  }

  // If we lost too many selections, keep the original
  if (balanced.length < selections.length * 0.8) {
    return selections
  }

  return balanced
}

function calculateTotalOdds(selections: ScoredMarket[]): number {
  return Math.round(
    selections.reduce((total, s) => total * s.odds, 1) * 100
  ) / 100
}

function determineConfidence(averageRiskScore: number): 'High' | 'Medium' | 'Low' {
  if (averageRiskScore <= 25) return 'High'
  if (averageRiskScore <= 50) return 'Medium'
  return 'Low'
}

export async function generateBets(scoredMarkets: ScoredMarket[]): Promise<BetGenerationResult> {
  const date = new Date().toISOString().split('T')[0]
  
  const lowRisk = generateLowRiskBet(scoredMarkets)
  const mediumRisk = generateMediumRiskBet(scoredMarkets)

  return {
    date,
    lowRisk,
    mediumRisk,
  }
}

