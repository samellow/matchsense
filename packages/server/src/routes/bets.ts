import { Router } from 'express'
import { runBetGenerationEngine } from '../services/betEngine.js'
import { memoryCache } from '../services/cache/memoryCache.js'
import { formatDateISO } from '../utils/dateUtils.js'
import { getToday } from '../utils/dateUtils.js'

const router = Router()

// Generate bets for today
router.post('/generate', async (_req, res) => {
  try {
    const result = await runBetGenerationEngine()
    
    // Cache the result
    const today = getToday()
    const cacheKey = `bets:${formatDateISO(today)}`
    memoryCache.set(cacheKey, result, 3600) // Cache for 1 hour
    
    res.json(result)
  } catch (error: any) {
    console.error('Error generating bets:', error)
    res.status(500).json({ 
      error: 'Failed to generate bets',
      message: error.message 
    })
  }
})

// Get today's generated bets
router.get('/today', async (_req, res) => {
  try {
    const today = getToday()
    const cacheKey = `bets:${formatDateISO(today)}`
    const cached = memoryCache.get(cacheKey)
    
    if (cached) {
      return res.json(cached)
    }
    
    // If not cached, generate them
    const result = await runBetGenerationEngine()
    memoryCache.set(cacheKey, result, 3600)
    
    res.json(result)
  } catch (error: any) {
    console.error('Error fetching today\'s bets:', error)
    res.status(500).json({ 
      error: 'Failed to fetch bets',
      message: error.message 
    })
  }
})

// Get historical bets (placeholder - would require database storage)
router.get('/history', async (_req, res) => {
  try {
    // For now, return empty array
    // In production, this would query the database
    res.json([])
  } catch (error: any) {
    console.error('Error fetching bet history:', error)
    res.status(500).json({ 
      error: 'Failed to fetch bet history',
      message: error.message 
    })
  }
})

export default router

