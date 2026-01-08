/**
 * Internal fixture types
 */

export interface EnrichedFixture {
  fixtureId: number
  homeTeam: {
    id: number
    name: string
    logo: string
  }
  awayTeam: {
    id: number
    name: string
    logo: string
  }
  league: {
    id: number
    name: string
    country: string
    round: string
  }
  date: string
  timestamp: number
  venue: string
  
  // Enriched data
  homeTeamForm: MatchResult[]
  awayTeamForm: MatchResult[]
  homeTeamStats: TeamFormStats
  awayTeamStats: TeamFormStats
  standings?: {
    home: StandingEntry
    away: StandingEntry
  }
  headToHead: HeadToHeadMatch[]
  availableMarkets: MarketOdds[]
}

export interface MatchResult {
  fixtureId: number
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  date: string
  league: string
}

export interface TeamFormStats {
  recentMatches: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalsForAverage: number
  goalsAgainstAverage: number
  cleanSheets: number
  btts: number // Both teams to score count
  over15Goals: number
  over25Goals: number
}

export interface StandingEntry {
  rank: number
  points: number
  goalsDiff: number
  form: string
  homeStats: MatchStats
  awayStats: MatchStats
}

export interface MatchStats {
  played: number
  win: number
  draw: number
  lose: number
  goalsFor: number
  goalsAgainst: number
}

export interface HeadToHeadMatch {
  fixtureId: number
  date: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  homeWinner: boolean
}

export interface MarketOdds {
  marketId: number
  marketName: string
  selection: string
  odds: number
  normalizedMarket: string
}

