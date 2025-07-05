import {
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
} from 'drizzle-orm/pg-core';
import { pets } from './pets';

export const others = pgTable(
  'others',
  {
    id: serial().notNull(),
    text: text().notNull(),
    petId: integer().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({ columns: [table.petId], foreignColumns: [pets.id] })
      .onUpdate('restrict')
      .onDelete('restrict'),
  ],
);
