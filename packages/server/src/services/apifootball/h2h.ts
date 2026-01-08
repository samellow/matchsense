import { apiFootballClient } from './client.js'
import type { ApiFootballResponse, HeadToHead } from '../../types/api-football.js'

export async function getHeadToHead(
  team1Id: number,
  team2Id: number,
  last: number = 5
): Promise<HeadToHead[]> {
  try {
    const response = await apiFootballClient.get<ApiFootballResponse<HeadToHead>>('/fixtures/headtohead', {
      h2h: `${team1Id}-${team2Id}`,
      last: last,
    })
    
    return response.response || []
  } catch (error) {
    console.error(`Error fetching H2H for teams ${team1Id} vs ${team2Id}:`, error)
    return []
  }
}

