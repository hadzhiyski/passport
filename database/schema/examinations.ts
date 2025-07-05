import {
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { pets } from './pets';
import { vets } from './vets';

export const examinations = pgTable(
  'examinations',
  {
    id: serial().notNull(),
    declaration: text().notNull(),
    date: timestamp({ mode: 'date' }).notNull(),
    vetId: integer().notNull(),
    petId: integer().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({ columns: [table.vetId], foreignColumns: [vets.id] })
      .onUpdate('restrict')
      .onDelete('restrict'),
    foreignKey({ columns: [table.petId], foreignColumns: [pets.id] })
      .onUpdate('restrict')
      .onDelete('restrict'),
  ],
);
