import type { ScoredMarket } from '../types/market.js'
import type { BetOptimizationParams } from '../types/bet.js'

export interface OptimizedCombination {
  selections: ScoredMarket[]
  totalOdds: number
  totalRiskScore: number
  averageRiskScore: number
}

export function optimizeBetslip(params: BetOptimizationParams): OptimizedCombination | null {
  const {
    scoredMarkets,
    targetMinOdds,
    targetMaxOdds,
    minSelections,
    maxSelections,
    maxRiskScore,
  } = params

  // Filter markets by risk score
  const eligibleMarkets = scoredMarkets.filter(m => m.riskScore <= maxRiskScore)

  if (eligibleMarkets.length < minSelections) {
    return null
  }

  // Try to find optimal combination
  // Start with fewest selections and work up
  for (let numSelections = minSelections; numSelections <= maxSelections; numSelections++) {
    const combination = findBestCombination(
      eligibleMarkets,
      numSelections,
      targetMinOdds,
      targetMaxOdds
    )

    if (combination) {
      return combination
    }
  }

  return null
}

function findBestCombination(
  markets: ScoredMarket[],
  numSelections: number,
  targetMinOdds: number,
  targetMaxOdds: number
): OptimizedCombination | null {
  // Use greedy approach: start with lowest risk selections
  const sortedMarkets = [...markets].sort((a, b) => a.riskScore - b.riskScore)

  // Try different combinations
  const combinations = generateCombinations(sortedMarkets, numSelections, 100) // Limit to 100 combinations

  let bestCombination: OptimizedCombination | null = null
  let bestScore = Infinity

  for (const combination of combinations) {
    // Skip if same fixture appears multiple times
    const fixtureIds = new Set(combination.map(m => m.fixtureId))
    if (fixtureIds.size < combination.length) {
      continue
    }

    const totalOdds = calculateTotalOdds(combination)
    
    // Check if odds are in target range
    if (totalOdds < targetMinOdds || totalOdds > targetMaxOdds) {
      continue
    }

    const totalRiskScore = combination.reduce((sum, m) => sum + m.riskScore, 0)
    const averageRiskScore = totalRiskScore / combination.length

    // Score this combination (lower is better)
    // Consider both risk and how close we are to target odds
    const oddsDistance = Math.abs(totalOdds - (targetMinOdds + targetMaxOdds) / 2)
    const score = totalRiskScore + (oddsDistance * 10)

    if (score < bestScore) {
      bestScore = score
      bestCombination = {
        selections: combination,
        totalOdds: Math.round(totalOdds * 100) / 100,
        totalRiskScore: Math.round(totalRiskScore),
        averageRiskScore: Math.round(averageRiskScore * 10) / 10,
      }
    }
  }

  return bestCombination
}

function generateCombinations<T>(
  items: T[],
  size: number,
  maxCombinations: number
): T[][] {
  if (size === 0) return [[]]
  if (size > items.length) return []
  if (size === items.length) return [items]

  const combinations: T[][] = []
  
  // Use iterative approach to generate combinations
  function combine(start: number, combo: T[]) {
    if (combo.length === size) {
      combinations.push([...combo])
      return combinations.length >= maxCombinations
    }

    for (let i = start; i < items.length; i++) {
      combo.push(items[i])
      const shouldStop = combine(i + 1, combo)
      if (shouldStop) return true
      combo.pop()
    }

    return false
  }

  combine(0, [])
  return combinations
}

function calculateTotalOdds(selections: ScoredMarket[]): number {
  return selections.reduce((total, selection) => total * selection.odds, 1)
}

