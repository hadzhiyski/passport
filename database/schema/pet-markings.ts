import {
  date,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  varchar,
} from 'drizzle-orm/pg-core';
import { pets } from './pets';

export const petMarkingType = pgEnum('pet_marking_type', [
  'microchip',
  'tattoo',
]);

export const petMarkings = pgTable(
  'pet_markings',
  {
    id: integer().notNull(),
    code: varchar({ length: 255 }).notNull(),
    place: varchar({ length: 255 }).notNull(),
    type: petMarkingType().notNull().default('microchip'),
    applicationDate: date({ mode: 'date' }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({ columns: [table.id], foreignColumns: [pets.id] })
      .onUpdate('restrict')
      .onDelete('restrict'),
  ],
);
