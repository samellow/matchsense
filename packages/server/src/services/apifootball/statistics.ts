import { apiFootballClient } from './client.js'
import type { ApiFootballResponse, TeamStatistics } from '../../types/api-football.js'

export async function getTeamStatistics(
  fixtureId: number,
  teamId: number
): Promise<TeamStatistics | null> {
  try {
    const response = await apiFootballClient.get<ApiFootballResponse<TeamStatistics>>('/fixtures/statistics', {
      fixture: fixtureId,
      team: teamId,
    })
    
    return response.response?.[0] || null
  } catch (error) {
    console.error(`Error fetching statistics for fixture ${fixtureId}, team ${teamId}:`, error)
    return null
  }
}

export async function getTeamForm(teamId: number, last: number = 10): Promise<any[]> {
  try {
    const response = await apiFootballClient.get<ApiFootballResponse<any>>('/fixtures', {
      team: teamId,
      last: last,
    })
    
    return response.response || []
  } catch (error) {
    console.error(`Error fetching form for team ${teamId}:`, error)
    return []
  }
}

