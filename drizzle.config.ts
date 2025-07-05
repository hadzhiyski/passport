import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

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
