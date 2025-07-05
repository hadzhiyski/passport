import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { PASSPORT_SCHEMA } from './schema';

const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,
  max: 3,
});

export const db = drizzle(pool, {
  casing: 'snake_case',
  logger: true,
  schema: PASSPORT_SCHEMA,
});
