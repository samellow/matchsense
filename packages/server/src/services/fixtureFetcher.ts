import { getFixturesByDate } from './apifootball/fixtures.js'
import { LEAGUE_IDS, EXCLUDED_FIXTURE_TYPES } from '../config/leagues.js'
import type { Fixture } from '../types/api-football.js'
import { getToday, formatDateISO } from '../utils/dateUtils.js'

export async function fetchTodayFixtures(): Promise<Fixture[]> {
  const today = getToday()
  const cacheKey = `fixtures:${formatDateISO(today)}`
  
  // Check cache first
  const { memoryCache } = await import('./cache/memoryCache.js')
  const cached = memoryCache.get<Fixture[]>(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch all fixtures
  const allFixtures = await getFixturesByDate(today, LEAGUE_IDS)
  
  // Filter fixtures
  const filteredFixtures = allFixtures.filter(fixture => {
    // Exclude finished matches
    if (fixture.fixture.status.short !== 'NS' && fixture.fixture.status.short !== 'TBD') {
      return false
    }
    
    // Exclude excluded fixture types (check round/league name)
    const round = fixture.league.round?.toLowerCase() || ''
    const isExcluded = EXCLUDED_FIXTURE_TYPES.some(excluded => 
      round.includes(excluded.toLowerCase())
    )
    if (isExcluded) {
      return false
    }
    
    // Ensure we have both teams
    if (!fixture.teams.home.id || !fixture.teams.away.id) {
      return false
    }
    
    return true
  })

  // Cache for 1 hour
  memoryCache.set(cacheKey, filteredFixtures, 3600)
  
  return filteredFixtures
}

export function filterFixturesWithSufficientData(fixtures: Fixture[]): Fixture[] {
  // Basic check - we'll do more thorough checks in data enrichment
  // For now, just ensure we have valid team IDs and league info
  return fixtures.filter(fixture => {
    return (
      fixture.teams.home.id > 0 &&
      fixture.teams.away.id > 0 &&
      fixture.league.id > 0 &&
      fixture.fixture.id > 0
    )
  })
}

