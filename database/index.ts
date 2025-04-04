import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import { drizzle } from 'drizzle-orm/node-postgres';

dotenvExpand.expand(dotenv.config());

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const db = drizzle(process.env.DATABASE_URL);
