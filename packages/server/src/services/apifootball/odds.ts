import { apiFootballClient } from './client.js'
import type { ApiFootballResponse, Odds } from '../../types/api-football.js'

export async function getFixtureOdds(fixtureId: number): Promise<Odds | null> {
  try {
    const response = await apiFootballClient.get<ApiFootballResponse<Odds>>('/odds', {
      fixture: fixtureId,
    })
    
    return response.response?.[0] || null
  } catch (error) {
    console.error(`Error fetching odds for fixture ${fixtureId}:`, error)
    return null
  }
}

