import { pool } from './connection.js'

const migrations = [
  {
    name: '001_create_users_table',
    up: `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `,
  },
  {
    name: '002_create_migrations_table',
    up: `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
]

async function runMigrations() {
  console.log('🔄 Running migrations...\n')

  try {
    // Ensure migrations table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Get executed migrations
    const result = await pool.query('SELECT name FROM migrations')
    const executedMigrations = new Set(result.rows.map((row) => row.name))

    // Run pending migrations
    for (const migration of migrations) {
      if (executedMigrations.has(migration.name)) {
        console.log(`⏭️  Skipping: ${migration.name} (already executed)`)
        continue
      }

      console.log(`▶️  Running: ${migration.name}`)
      await pool.query(migration.up)
      await pool.query('INSERT INTO migrations (name) VALUES ($1)', [migration.name])
      console.log(`✅ Completed: ${migration.name}`)
    }

    console.log('\n✨ All migrations completed!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigrations()

