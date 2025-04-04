import {
  pgTable,
  primaryKey,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

export const ownerTable = pgTable(
  'owners',
  {
    id: serial().notNull(),
    firstname: varchar({ length: 255 }).notNull(),
    lastname: varchar({ length: 255 }).notNull(),
    address: text().notNull(),
    city: varchar({ length: 255 }).notNull(),
    country: varchar({ length: 255 }).notNull(),
    postcode: varchar({ length: 255 }),
    phone: varchar({ length: 255 }),
  },
  (table) => [primaryKey({ columns: [table.id] })],
);
