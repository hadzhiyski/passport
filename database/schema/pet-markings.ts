import {
  date,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  varchar,
} from 'drizzle-orm/pg-core';
import { auditTimestamps } from './timestamps';
import { petsTable } from './pets';

export const petMarkingType = pgEnum('pet_marking_type', [
  'microchip',
  'tattoo',
]);

export const petMarkingsTable = pgTable(
  'pet_markings',
  {
    id: integer().notNull(),
    code: varchar({ length: 255 }).notNull(),
    place: varchar({ length: 255 }).notNull(),
    type: petMarkingType().notNull().default('microchip'),
    applicationDate: date().notNull(),
    ...auditTimestamps,
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({ columns: [table.id], foreignColumns: [petsTable.id] })
      .onUpdate('restrict')
      .onDelete('no action'),
  ],
);
