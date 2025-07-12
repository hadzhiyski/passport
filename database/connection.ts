import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import postgres from 'postgres';
import { PASSPORT_SCHEMA } from './schema';

export type Schema = typeof PASSPORT_SCHEMA;
export type Database = PostgresJsDatabase<Schema>;

let _db: PostgresJsDatabase<Schema> | undefined;

export function getDb(): PostgresJsDatabase<Schema> {
  if (_db) {
    return _db;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set in environment variables.');
  }

  const connection = postgres(databaseUrl, {
    prepare: false,
  });

  _db = drizzle(connection, {
    casing: 'snake_case',
    logger: true,
    schema: PASSPORT_SCHEMA,
  });

  return _db;
}
