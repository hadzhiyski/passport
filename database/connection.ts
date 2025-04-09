import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

dotenvExpand.expand(dotenv.config());

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
});

export const db = drizzle(pool, {
  casing: 'snake_case',
  logger: true,
});
