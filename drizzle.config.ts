import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { defineConfig } from 'drizzle-kit';

dotenvExpand.expand(dotenv.config());

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './database/schema',
  out: './database/migrations',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  breakpoints: true,
});
