import { fetchTodayFixtures } from './fixtureFetcher.js'
import { enrichFixtures } from './dataEnrichment.js'
import { scoreMarkets } from './riskScoring.js'
import { generateBets } from './betGenerator.js'
import type { BetGenerationResult } from '../types/bet.js'

export async function runBetGenerationEngine(): Promise<BetGenerationResult> {
  try {
    console.log('Starting bet generation engine...')

    // Step 1: Fetch fixtures
    console.log('Fetching today\'s fixtures...')
    const fixtures = await fetchTodayFixtures()
    console.log(`Found ${fixtures.length} fixtures`)

    if (fixtures.length === 0) {
      return {
        date: new Date().toISOString().split('T')[0],
        lowRisk: null,
        mediumRisk: null,
      }
    }

    // Step 2: Enrich fixtures with data
    console.log('Enriching fixtures with statistics...')
    const enrichedFixtures = await enrichFixtures(fixtures)
    console.log(`Enriched ${enrichedFixtures.length} fixtures`)

    if (enrichedFixtures.length === 0) {
      return {
        date: new Date().toISOString().split('T')[0],
        lowRisk: null,
        mediumRisk: null,
      }
    }

    // Step 3: Score markets
    console.log('Scoring markets...')
    const scoredMarkets = scoreMarkets(enrichedFixtures)
    console.log(`Scored ${scoredMarkets.length} markets`)

    if (scoredMarkets.length === 0) {
      return {
        date: new Date().toISOString().split('T')[0],
        lowRisk: null,
        mediumRisk: null,
      }
    }

    // Step 4: Generate bets
    console.log('Generating bets...')
    const result = await generateBets(scoredMarkets)
    console.log('Bet generation complete')

    return result
  } catch (error) {
    console.error('Error in bet generation engine:', error)
    throw error
  }
}

