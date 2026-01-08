import type { ScoredMarket } from '../types/market.js'

export function generateExplanations(selections: ScoredMarket[]): string {
  if (selections.length === 0) {
    return 'No selections available.'
  }

  // Group selections by market type for better explanations
  const marketGroups = new Map<string, ScoredMarket[]>()
  for (const selection of selections) {
    const marketType = selection.market
    if (!marketGroups.has(marketType)) {
      marketGroups.set(marketType, [])
    }
    marketGroups.get(marketType)!.push(selection)
  }

  const explanations: string[] = []

  // Generate explanation for each market type
  for (const [marketType, markets] of marketGroups.entries()) {
    const explanation = generateMarketExplanation(marketType, markets)
    if (explanation) {
      explanations.push(explanation)
    }
  }

  // If we have multiple types, combine them
  if (explanations.length > 1) {
    return `Selection combines ${selections.length} picks: ${explanations.join(' ')}`
  }

  return explanations[0] || generateGenericExplanation(selections)
}

function generateMarketExplanation(
  marketType: string,
  selections: ScoredMarket[]
): string | null {
  const first = selections[0]

  if (marketType.includes('Both Teams To Score')) {
    const bttsType = marketType.includes('Yes') ? 'Yes' : 'No'
    
    if (bttsType === 'Yes') {
      return `Selected matches where both teams consistently score, based on recent form showing high goal-scoring patterns and defensive vulnerabilities.`
    } else {
      return `Selected matches where at least one team has shown strong defensive form with frequent clean sheets.`
    }
  }

  if (marketType.includes('Over 1.5 Goals')) {
    return `Selected matches based on teams with consistent goal production, where both sides have scored at least 2 goals combined in the majority of recent matches.`
  }

  if (marketType.includes('Under 4.5 Goals')) {
    return `Selected matches featuring defensively stable teams with low-scoring patterns in recent fixtures.`
  }

  if (marketType === '1X') {
    return `Selected matches where the home team has shown strong home form or where draws are common, providing defensive stability.`
  }

  if (marketType === 'X2') {
    return `Selected matches where the away team has strong form or where the home team has struggled, reducing reliance on a single outcome.`
  }

  return null
}

function generateGenericExplanation(selections: ScoredMarket[]): string {
  const avgRisk = selections.reduce((sum, s) => sum + s.riskScore, 0) / selections.length
  
  if (avgRisk <= 25) {
    return `Selection based on teams with defensive stability and consistent goal production in recent matches.`
  } else if (avgRisk <= 50) {
    return `Targeting teams with strong recent form and favorable matchups based on historical data and current standings.`
  } else {
    return `Selected matches based on statistical analysis of team form, goal trends, and league positions.`
  }
}

