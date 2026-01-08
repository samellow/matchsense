import type { EnrichedFixture, MarketOdds } from '../types/fixture.js'
import type { ScoredMarket } from '../types/market.js'
import { RISK_SCORING_WEIGHTS, CONFIDENCE_THRESHOLDS } from '../config/scoring.js'

export function scoreMarkets(fixtures: EnrichedFixture[]): ScoredMarket[] {
  const scoredMarkets: ScoredMarket[] = []

  for (const fixture of fixtures) {
    for (const market of fixture.availableMarkets) {
      const score = calculateRiskScore(fixture, market)
      const confidence = determineConfidence(score)
      
      scoredMarkets.push({
        fixtureId: fixture.fixtureId,
        homeTeam: fixture.homeTeam.name,
        awayTeam: fixture.awayTeam.name,
        league: fixture.league.name,
        leagueId: fixture.league.id,
        market: market.normalizedMarket as any,
        odds: market.odds,
        riskScore: score.total,
        confidence,
        reasoning: {
          formScore: score.form,
          goalTrendScore: score.goals,
          defensiveScore: score.defensive,
          positionScore: score.position,
          h2hScore: score.h2h,
          oddsScore: score.odds,
        },
      })
    }
  }

  return scoredMarkets.sort((a, b) => a.riskScore - b.riskScore) // Lower = safer
}

function calculateRiskScore(fixture: EnrichedFixture, market: MarketOdds): {
  total: number
  form: number
  goals: number
  defensive: number
  position: number
  h2h: number
  odds: number
} {
  const formScore = scoreRecentForm(fixture, market) * RISK_SCORING_WEIGHTS.RECENT_FORM
  const goalScore = scoreGoalTrends(fixture, market) * RISK_SCORING_WEIGHTS.GOAL_TRENDS
  const defensiveScore = scoreDefensiveStability(fixture, market) * RISK_SCORING_WEIGHTS.DEFENSIVE_STABILITY
  const positionScore = scoreLeaguePosition(fixture, market) * RISK_SCORING_WEIGHTS.LEAGUE_POSITION_GAP
  const h2hScore = scoreHistoricalMatchup(fixture, market) * RISK_SCORING_WEIGHTS.HISTORICAL_MATCHUP
  const oddsScore = scoreOddsStability(market.odds) * RISK_SCORING_WEIGHTS.ODDS_STABILITY

  const total = formScore + goalScore + defensiveScore + positionScore + h2hScore + oddsScore

  return {
    total: Math.round(total),
    form: Math.round(formScore),
    goals: Math.round(goalScore),
    defensive: Math.round(defensiveScore),
    position: Math.round(positionScore),
    h2h: Math.round(h2hScore),
    odds: Math.round(oddsScore),
  }
}

function scoreRecentForm(fixture: EnrichedFixture, market: MarketOdds): number {
  const homeForm = fixture.homeTeamStats
  const awayForm = fixture.awayTeamStats

  if (homeForm.recentMatches < 5 || awayForm.recentMatches < 5) {
    return 50 // Neutral score if insufficient data
  }

  // Calculate form consistency (win rate stability)
  const homeWinRate = homeForm.wins / homeForm.recentMatches
  const awayWinRate = awayForm.wins / awayForm.recentMatches
  const homeFormVariance = calculateFormVariance(homeForm)
  const awayFormVariance = calculateFormVariance(awayForm)

  // Lower variance = better (lower risk score)
  let score = (homeFormVariance + awayFormVariance) / 2

  // Adjust based on market type
  if (market.normalizedMarket.includes('1X')) {
    // Home team or draw - favor strong home form
    if (homeWinRate > 0.6) score *= 0.7
    else if (homeWinRate < 0.3) score *= 1.3
  } else if (market.normalizedMarket.includes('X2')) {
    // Draw or away - favor strong away form
    if (awayWinRate > 0.5) score *= 0.7
    else if (awayWinRate < 0.2) score *= 1.3
  }

  return Math.min(100, Math.max(0, score))
}

function calculateFormVariance(stats: any): number {
  // Simple variance calculation based on wins/draws/losses distribution
  const total = stats.wins + stats.draws + stats.losses
  if (total === 0) return 50

  // More consistent results (many wins or many losses) = lower variance
  const winRate = stats.wins / total
  const drawRate = stats.draws / total
  const lossRate = stats.losses / total

  // Calculate variance from even distribution
  const variance = Math.abs(winRate - 0.33) + Math.abs(drawRate - 0.33) + Math.abs(lossRate - 0.33)
  
  // Invert: high variance = bad, so return (1 - variance) * 100
  return (1 - variance) * 100
}

function scoreGoalTrends(fixture: EnrichedFixture, market: MarketOdds): number {
  const homeStats = fixture.homeTeamStats
  const awayStats = fixture.awayTeamStats

  if (homeStats.recentMatches < 5 || awayStats.recentMatches < 5) {
    return 50
  }

  let score = 50 // Start neutral

  // Over 1.5 Goals
  if (market.normalizedMarket.includes('Over 1.5')) {
    const homeOver15Rate = homeStats.over15Goals / homeStats.recentMatches
    const awayOver15Rate = awayStats.over15Goals / awayStats.recentMatches
    const avgRate = (homeOver15Rate + awayOver15Rate) / 2
    
    // If both teams consistently score > 1.5, this is safer
    if (avgRate > 0.8) score = 20
    else if (avgRate > 0.6) score = 40
    else if (avgRate < 0.4) score = 80
  }

  // Both Teams To Score
  if (market.normalizedMarket.includes('Both Teams To Score')) {
    const homeBttsRate = homeStats.btts / homeStats.recentMatches
    const awayBttsRate = awayStats.btts / awayStats.recentMatches
    const avgRate = (homeBttsRate + awayBttsRate) / 2
    
    if (avgRate > 0.8) score = 20
    else if (avgRate > 0.6) score = 40
    else if (avgRate < 0.3) score = 80
  }

  // Under 4.5 Goals
  if (market.normalizedMarket.includes('Under 4.5')) {
    const homeOver25Rate = homeStats.over25Goals / homeStats.recentMatches
    const awayOver25Rate = awayStats.over25Goals / awayStats.recentMatches
    const avgRate = (homeOver25Rate + awayOver25Rate) / 2
    
    // Lower scoring teams = safer under bet
    if (avgRate < 0.3) score = 20
    else if (avgRate < 0.5) score = 40
    else if (avgRate > 0.7) score = 80
  }

  return score
}

function scoreDefensiveStability(fixture: EnrichedFixture, market: MarketOdds): number {
  const homeStats = fixture.homeTeamStats
  const awayStats = fixture.awayTeamStats

  if (homeStats.recentMatches < 5 || awayStats.recentMatches < 5) {
    return 50
  }

  // Calculate defensive consistency (goals against variance)
  const homeGoalsAgainstAvg = homeStats.goalsAgainstAverage
  const awayGoalsAgainstAvg = awayStats.goalsAgainstAverage

  // Lower goals against = more stable defense = lower risk
  let score = ((homeGoalsAgainstAvg + awayGoalsAgainstAvg) / 2) * 20

  // Clean sheets indicate defensive stability
  const homeCleanSheetRate = homeStats.cleanSheets / homeStats.recentMatches
  const awayCleanSheetRate = awayStats.cleanSheets / awayStats.recentMatches
  
  if ((homeCleanSheetRate + awayCleanSheetRate) / 2 > 0.4) {
    score *= 0.6 // Reduce risk if both teams keep clean sheets
  }

  return Math.min(100, Math.max(0, score))
}

function scoreLeaguePosition(fixture: EnrichedFixture, market: MarketOdds): number {
  if (!fixture.standings) {
    return 50 // Neutral if no standings data
  }

  const homeRank = fixture.standings.home.rank
  const awayRank = fixture.standings.away.rank
  const rankDiff = Math.abs(homeRank - awayRank)

  // Larger rank difference = more predictable = lower risk
  // But extreme differences might indicate other issues
  let score = 50

  if (rankDiff > 10) score = 20
  else if (rankDiff > 5) score = 35
  else if (rankDiff > 2) score = 50
  else score = 65

  // Adjust based on market
  if (market.normalizedMarket.includes('1X')) {
    // Favor home team if they're higher ranked
    if (homeRank < awayRank) score *= 0.8
  } else if (market.normalizedMarket.includes('X2')) {
    // Favor away team if they're higher ranked
    if (awayRank < homeRank) score *= 0.8
  }

  return Math.min(100, Math.max(0, score))
}

function scoreHistoricalMatchup(fixture: EnrichedFixture, market: MarketOdds): number {
  if (fixture.headToHead.length < 3) {
    return 50 // Need at least 3 H2H matches for meaningful data
  }

  let score = 50

  // Analyze H2H patterns
  if (market.normalizedMarket.includes('1X')) {
    // Check how often home team won or drew
    const homeWinsOrDraws = fixture.headToHead.filter(m => m.homeWinner || 
      (m.homeScore === m.awayScore)).length
    const rate = homeWinsOrDraws / fixture.headToHead.length
    
    if (rate > 0.8) score = 20
    else if (rate > 0.6) score = 40
    else if (rate < 0.3) score = 80
  } else if (market.normalizedMarket.includes('X2')) {
    // Check how often away team won or drew
    const awayWinsOrDraws = fixture.headToHead.filter(m => !m.homeWinner || 
      (m.homeScore === m.awayScore)).length
    const rate = awayWinsOrDraws / fixture.headToHead.length
    
    if (rate > 0.8) score = 20
    else if (rate > 0.6) score = 40
    else if (rate < 0.3) score = 80
  } else if (market.normalizedMarket.includes('Both Teams To Score')) {
    // Check BTTS in H2H
    const bttsCount = fixture.headToHead.filter(m => 
      m.homeScore > 0 && m.awayScore > 0).length
    const rate = bttsCount / fixture.headToHead.length
    
    if (rate > 0.8) score = 20
    else if (rate < 0.3) score = 80
  }

  return Math.min(100, Math.max(0, score))
}

function scoreOddsStability(odds: number): number {
  // Odds closer to 1.0 = more likely = lower risk
  // But odds too close to 1.0 might not meet our targets
  // Optimal odds for low risk: 1.2 - 1.5
  
  if (odds < 1.1) return 30 // Very likely, but low odds
  if (odds >= 1.1 && odds <= 1.5) return 20 // Sweet spot
  if (odds > 1.5 && odds <= 2.0) return 35
  if (odds > 2.0 && odds <= 3.0) return 50
  if (odds > 3.0 && odds <= 5.0) return 70
  return 85 // Very unlikely
}

function determineConfidence(totalScore: number): 'Low' | 'Medium' | 'High' {
  if (totalScore <= CONFIDENCE_THRESHOLDS.HIGH) return 'High'
  if (totalScore <= CONFIDENCE_THRESHOLDS.MEDIUM) return 'Medium'
  return 'Low'
}

