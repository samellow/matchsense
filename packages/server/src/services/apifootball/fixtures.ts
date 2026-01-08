import { apiFootballClient } from './client.js'
import type { ApiFootballResponse, Fixture } from '../../types/api-football.js'
import { format } from 'date-fns'

export async function getFixturesByDate(date: Date, leagueIds: number[]): Promise<Fixture[]> {
  const dateStr = format(date, 'yyyy-MM-dd')
  const allFixtures: Fixture[] = []

  // Fetch fixtures for each league (API-Football requires league ID)
  for (const leagueId of leagueIds) {
    try {
      const response = await apiFootballClient.get<ApiFootballResponse<Fixture>>('/fixtures', {
        date: dateStr,
        league: leagueId,
        season: new Date().getFullYear(),
      })
      
      if (response.response) {
        allFixtures.push(...response.response)
      }
    } catch (error) {
      console.error(`Error fetching fixtures for league ${leagueId}:`, error)
      // Continue with other leagues
    }
  }

  return allFixtures
}

export async function getFixtureById(fixtureId: number): Promise<Fixture | null> {
  try {
    const response = await apiFootballClient.get<ApiFootballResponse<Fixture>>('/fixtures', {
      id: fixtureId,
    })
    
    return response.response?.[0] || null
  } catch (error) {
    console.error(`Error fetching fixture ${fixtureId}:`, error)
    return null
  }
}

