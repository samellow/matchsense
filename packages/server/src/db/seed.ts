import { pool } from './connection.js'

const seedData = {
  users: [
    { email: 'john@example.com', name: 'John Doe' },
    { email: 'jane@example.com', name: 'Jane Smith' },
    { email: 'bob@example.com', name: 'Bob Johnson' },
  ],
}

async function seed() {
  console.log('🌱 Seeding database...\n')

  try {
    // Clear existing data
    await pool.query('DELETE FROM users')
    console.log('🗑️  Cleared existing data')

    // Insert seed data
    for (const user of seedData.users) {
      await pool.query(
        'INSERT INTO users (email, name) VALUES ($1, $2)',
        [user.email, user.name]
      )
      console.log(`✅ Created user: ${user.name}`)
    }

    console.log('\n✨ Seeding completed!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seed()

