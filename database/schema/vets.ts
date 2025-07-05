import {
  pgTable,
  primaryKey,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

export const vets = pgTable(
  'vets',
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
  },
  (table) => [primaryKey({ columns: [table.id] })],
);
