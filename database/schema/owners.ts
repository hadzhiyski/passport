import {
  pgTable,
  primaryKey,
  serial,
  text,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const owners = pgTable(
  'owners',
  {
    id: serial().notNull(),
    externalId: varchar({ length: 255 }),
    firstname: varchar({ length: 255 }).notNull(),
    lastname: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }),
    address: text().notNull(),
    city: varchar({ length: 255 }).notNull(),
    country: varchar({ length: 255 }).notNull(),
    postcode: varchar({ length: 255 }),
    phone: varchar({ length: 255 }),
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    unique().on(table.externalId),
  ],
);
