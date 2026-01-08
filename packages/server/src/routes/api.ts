import { Router } from 'express'
import { pool } from '../db/connection.js'

const router = Router()

// Example: Get all users
router.get('/users', async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, created_at FROM users ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Example: Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Example: Create user
router.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' })
    }
    
    const result = await pool.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, email, name, created_at',
      [email, name]
    )
    
    res.status(201).json(result.rows[0])
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' })
    }
    console.error('Error creating user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

