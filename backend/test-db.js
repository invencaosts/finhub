import pg from 'pg'

const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'finhub_bd',
})

async function test() {
  try {
    await client.connect()
    console.log('Connection successful!')
    await client.end()
  } catch (err) {
    console.error('Connection failed:', err.message)
    process.exit(1)
  }
}

test()
