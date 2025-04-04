import {
  pgTable,
  primaryKey,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { auditTimestamps } from './timestamps';

export const veterinarianTable = pgTable(
  'veterinarians',
  {
    id: serial().notNull(),
    name: varchar({ length: 255 }).notNull(),
    address: text().notNull(),
    postcode: varchar({ length: 255 }),
    city: varchar({ length: 255 }).notNull(),
    country: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 255 }),
    email: varchar({ length: 255 }),
    website: varchar({ length: 255 }),
    ...auditTimestamps,
  },
  (table) => [primaryKey({ columns: [table.id] })],
);
