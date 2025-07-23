import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

//PostgreSQL connection config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://username:password@localhost:5432/smartagro',
});

const db = drizzle(pool);

export default db;
