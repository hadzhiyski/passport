import {
  pgTable,
  primaryKey,
  serial,
  text,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { auditTimestamps } from './timestamps';

export const ownerTable = pgTable(
  'owners',
  {
    id: serial().notNull(),
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
