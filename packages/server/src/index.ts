import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { pool, testConnection } from './db/connection.js'
import apiRouter from './routes/api.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', apiRouter)

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    const dbConnected = await testConnection()
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'error',
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...')
  await pool.end()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down...')
  await pool.end()
  process.exit(0)
})

