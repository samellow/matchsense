/**
 * Allowed and excluded markets configuration
 */

export const ALLOWED_MARKETS = {
  DOUBLE_CHANCE_1X: '1X',           // Home or Draw
  DOUBLE_CHANCE_X2: 'X2',           // Draw or Away
  OVER_15: 'Over 1.5 Goals',
  UNDER_45: 'Under 4.5 Goals',
  BTTS_YES: 'Both Teams To Score - Yes',
  BTTS_NO: 'Both Teams To Score - No',
  TEAM_SCORE_YES: 'Team To Score - Yes', // Generic team to score at least one goal
} as const

export const ALLOWED_MARKET_IDS = [
  1,   // 1X2
  2,   // Double Chance
  5,   // Over/Under
  8,   // Both Teams To Score
  12,  // Team To Score
] as const

export const EXCLUDED_MARKETS = [
  'Correct Score',
  'First Goal Scorer',
  'Anytime Goal Scorer',
  'First Card',
  'Corners',
  'Cards',
  'Player Statistics',
  'Special',
]

export function isAllowedMarket(marketName: string, marketId: number): boolean {
  // Check if market ID is in allowed list
  if (!ALLOWED_MARKET_IDS.includes(marketId as any)) {
    return false
  }
  
  // Check if market name contains excluded keywords
  const upperName = marketName.toUpperCase()
  return !EXCLUDED_MARKETS.some(excluded => 
    upperName.includes(excluded.toUpperCase())
  )
}

export function normalizeMarketName(marketName: string, selection: string): string {
  const upperName = marketName.toUpperCase()
  const upperSelection = selection.toUpperCase()
  
  // Double Chance
  if (upperName.includes('DOUBLE CHANCE') || upperName.includes('1X2')) {
    if (upperSelection === '1X' || (upperSelection.includes('HOME') && upperSelection.includes('DRAW'))) {
      return ALLOWED_MARKETS.DOUBLE_CHANCE_1X
    }
    if (upperSelection === 'X2' || (upperSelection.includes('AWAY') && upperSelection.includes('DRAW'))) {
      return ALLOWED_MARKETS.DOUBLE_CHANCE_X2
    }
  }
  
  // Over/Under
  if (upperName.includes('OVER') && upperSelection.includes('1.5')) {
    return ALLOWED_MARKETS.OVER_15
  }
  if (upperName.includes('UNDER') && upperSelection.includes('4.5')) {
    return ALLOWED_MARKETS.UNDER_45
  }
  
  // Both Teams To Score
  if (upperName.includes('BOTH TEAMS TO SCORE') || upperName.includes('BTTS')) {
    if (upperSelection === 'YES' || upperSelection === 'TRUE') {
      return ALLOWED_MARKETS.BTTS_YES
    }
    if (upperSelection === 'NO' || upperSelection === 'FALSE') {
      return ALLOWED_MARKETS.BTTS_NO
    }
  }
  
  // Team To Score
  if (upperName.includes('TEAM TO SCORE')) {
    return ALLOWED_MARKETS.TEAM_SCORE_YES
  }
  
  return marketName
}

