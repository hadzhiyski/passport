import {
  pgTable,
  primaryKey,
  text,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { auditTimestamps } from './timestamps';
import { serialSqid } from './types/serial-sqid';

export const ownersTable = pgTable(
  'owners',
  {
    id: serialSqid('owners').notNull(),
    externalId: varchar({ length: 255 }),
    firstname: varchar({ length: 255 }).notNull(),
    lastname: varchar({ length: 255 }).notNull(),
    address: text().notNull(),
    city: varchar({ length: 255 }).notNull(),
    country: varchar({ length: 255 }).notNull(),
    postcode: varchar({ length: 255 }),
    phone: varchar({ length: 255 }),
    ...auditTimestamps,
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    unique().on(table.externalId),
  ],
);
