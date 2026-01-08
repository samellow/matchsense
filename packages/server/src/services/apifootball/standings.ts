import { apiFootballClient } from './client.js'
import type { ApiFootballResponse, Standing } from '../../types/api-football.js'

export async function getLeagueStandings(
  leagueId: number,
  season?: number
): Promise<Standing | null> {
  const currentSeason = season || new Date().getFullYear()
  
  try {
    const response = await apiFootballClient.get<ApiFootballResponse<Standing>>('/standings', {
      league: leagueId,
      season: currentSeason,
    })
    
    return response.response?.[0] || null
  } catch (error) {
    console.error(`Error fetching standings for league ${leagueId}:`, error)
    return null
  }
}

