import type { Fixture } from '../types/api-football.js'
import type { EnrichedFixture, MatchResult, TeamFormStats, MarketOdds } from '../types/fixture.js'
import { getTeamForm } from './apifootball/statistics.js'
import { getLeagueStandings } from './apifootball/standings.js'
import { getHeadToHead } from './apifootball/h2h.js'
import { getFixtureOdds } from './apifootball/odds.js'
import { memoryCache } from './cache/memoryCache.js'
import { isAllowedMarket, normalizeMarketName } from '../config/markets.js'

export async function enrichFixture(fixture: Fixture): Promise<EnrichedFixture | null> {
  const cacheKey = `enriched:${fixture.fixture.id}`
  const cached = memoryCache.get<EnrichedFixture>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const homeTeamId = fixture.teams.home.id
    const awayTeamId = fixture.teams.away.id
    const leagueId = fixture.league.id

    // Fetch all data in parallel (with caching)
    const [homeForm, awayForm, standings, h2h, odds] = await Promise.all([
      fetchTeamForm(homeTeamId),
      fetchTeamForm(awayTeamId),
      fetchStandings(leagueId),
      fetchH2H(homeTeamId, awayTeamId),
      fetchOdds(fixture.fixture.id),
    ])

    // Process form data
    const homeTeamForm = processFormData(homeForm, homeTeamId)
    const awayTeamForm = processFormData(awayForm, awayTeamId)
    const homeTeamStats = calculateFormStats(homeTeamForm)
    const awayTeamStats = calculateFormStats(awayTeamForm)

    // Process standings
    const homeStanding = standings?.league.standings[0]?.find(
      s => s.team.id === homeTeamId
    )
    const awayStanding = standings?.league.standings[0]?.find(
      s => s.team.id === awayTeamId
    )

    // Process H2H
    const h2hMatches = processH2HData(h2h, homeTeamId, awayTeamId)

    // Process odds and filter markets
    const availableMarkets = processOdds(odds)

    const enriched: EnrichedFixture = {
      fixtureId: fixture.fixture.id,
      homeTeam: {
        id: fixture.teams.home.id,
        name: fixture.teams.home.name,
        logo: fixture.teams.home.logo,
      },
      awayTeam: {
        id: fixture.teams.away.id,
        name: fixture.teams.away.name,
        logo: fixture.teams.away.logo,
      },
      league: {
        id: fixture.league.id,
        name: fixture.league.name,
        country: fixture.league.country,
        round: fixture.league.round,
      },
      date: fixture.fixture.date,
      timestamp: fixture.fixture.timestamp,
      venue: fixture.fixture.venue.name,
      homeTeamForm: homeTeamForm,
      awayTeamForm: awayTeamForm,
      homeTeamStats: homeTeamStats,
      awayTeamStats: awayTeamStats,
      standings: homeStanding && awayStanding ? {
        home: {
          rank: homeStanding.rank,
          points: homeStanding.points,
          goalsDiff: homeStanding.goalsDiff,
          form: homeStanding.form,
          homeStats: homeStanding.home,
          awayStats: homeStanding.away,
        },
        away: {
          rank: awayStanding.rank,
          points: awayStanding.points,
          goalsDiff: awayStanding.goalsDiff,
          form: awayStanding.form,
          homeStats: awayStanding.home,
          awayStats: awayStanding.away,
        },
      } : undefined,
      headToHead: h2hMatches,
      availableMarkets: availableMarkets,
    }

    // Cache for 30 minutes
    memoryCache.set(cacheKey, enriched, 1800)
    return enriched
  } catch (error) {
    console.error(`Error enriching fixture ${fixture.fixture.id}:`, error)
    return null
  }
}

async function fetchTeamForm(teamId: number): Promise<any[]> {
  const cacheKey = `team-form:${teamId}`
  const cached = memoryCache.get<any[]>(cacheKey)
  if (cached) {
    return cached
  }

  const form = await getTeamForm(teamId, 10)
  memoryCache.set(cacheKey, form, 1800)
  return form
}

async function fetchStandings(leagueId: number): Promise<any> {
  const cacheKey = `standings:${leagueId}`
  const cached = memoryCache.get<any>(cacheKey)
  if (cached) {
    return cached
  }

  const standings = await getLeagueStandings(leagueId)
  if (standings) {
    memoryCache.set(cacheKey, standings, 3600) // Standings change less frequently
  }
  return standings
}

async function fetchH2H(team1Id: number, team2Id: number): Promise<any[]> {
  const cacheKey = `h2h:${team1Id}:${team2Id}`
  const cached = memoryCache.get<any[]>(cacheKey)
  if (cached) {
    return cached
  }

  const h2h = await getHeadToHead(team1Id, team2Id, 5)
  memoryCache.set(cacheKey, h2h, 3600)
  return h2h
}

async function fetchOdds(fixtureId: number): Promise<any> {
  const cacheKey = `odds:${fixtureId}`
  const cached = memoryCache.get<any>(cacheKey)
  if (cached) {
    return cached
  }

  const odds = await getFixtureOdds(fixtureId)
  if (odds) {
    memoryCache.set(cacheKey, odds, 1800)
  }
  return odds
}

function processFormData(formData: any[], teamId: number): MatchResult[] {
  return formData
    .filter(match => match.fixture.status.short === 'FT') // Only finished matches
    .slice(0, 10)
    .map(match => ({
      fixtureId: match.fixture.id,
      homeTeam: match.teams.home.name,
      awayTeam: match.teams.away.name,
      homeScore: match.goals.home || 0,
      awayScore: match.goals.away || 0,
      date: match.fixture.date,
      league: match.league.name,
    }))
}

function calculateFormStats(matches: MatchResult[]): TeamFormStats {
  if (matches.length === 0) {
    return {
      recentMatches: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalsForAverage: 0,
      goalsAgainstAverage: 0,
      cleanSheets: 0,
      btts: 0,
      over15Goals: 0,
      over25Goals: 0,
    }
  }

  let wins = 0
  let draws = 0
  let losses = 0
  let goalsFor = 0
  let goalsAgainst = 0
  let cleanSheets = 0
  let btts = 0
  let over15Goals = 0
  let over25Goals = 0

  for (const match of matches) {
    const isHome = match.homeTeam === matches[0].homeTeam || match.homeTeam === matches[0].awayTeam
    const teamScore = isHome ? match.homeScore : match.awayScore
    const opponentScore = isHome ? match.awayScore : match.homeScore

    goalsFor += teamScore
    goalsAgainst += opponentScore

    if (teamScore > opponentScore) wins++
    else if (teamScore === opponentScore) draws++
    else losses++

    if (opponentScore === 0) cleanSheets++
    if (teamScore > 0 && opponentScore > 0) btts++
    if (teamScore + opponentScore > 1.5) over15Goals++
    if (teamScore + opponentScore > 2.5) over25Goals++
  }

  return {
    recentMatches: matches.length,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalsForAverage: goalsFor / matches.length,
    goalsAgainstAverage: goalsAgainst / matches.length,
    cleanSheets,
    btts,
    over15Goals,
    over25Goals,
  }
}

function processH2HData(h2hData: any[], homeTeamId: number, awayTeamId: number): any[] {
  return h2hData
    .filter(match => match.fixture.status.short === 'FT')
    .map(match => ({
      fixtureId: match.fixture.id,
      date: match.fixture.date,
      homeTeam: match.teams.home.name,
      awayTeam: match.teams.away.name,
      homeScore: match.goals.home || 0,
      awayScore: match.goals.away || 0,
      homeWinner: match.goals.home! > match.goals.away!,
    }))
}

function processOdds(oddsData: any): MarketOdds[] {
  if (!oddsData?.bookmakers || oddsData.bookmakers.length === 0) {
    return []
  }

  const markets: MarketOdds[] = []

  // Use the first bookmaker (usually the most reliable)
  const bookmaker = oddsData.bookmakers[0]

  for (const bet of bookmaker.bets || []) {
    if (!isAllowedMarket(bet.name, bet.id)) {
      continue
    }

    for (const value of bet.values || []) {
      const normalizedMarket = normalizeMarketName(bet.name, value.value)
      const odds = parseFloat(value.odd)

      if (odds > 0 && !isNaN(odds)) {
        markets.push({
          marketId: bet.id,
          marketName: bet.name,
          selection: value.value,
          odds: odds,
          normalizedMarket: normalizedMarket,
        })
      }
    }
  }

  return markets
}

export async function enrichFixtures(fixtures: Fixture[]): Promise<EnrichedFixture[]> {
  const enriched: EnrichedFixture[] = []

  // Process in batches to avoid overwhelming the API
  const batchSize = 5
  for (let i = 0; i < fixtures.length; i += batchSize) {
    const batch = fixtures.slice(i, i + batchSize)
    const results = await Promise.all(
      batch.map(fixture => enrichFixture(fixture))
    )
    
    for (const result of results) {
      if (result) {
        enriched.push(result)
      }
    }
  }

  return enriched
}

