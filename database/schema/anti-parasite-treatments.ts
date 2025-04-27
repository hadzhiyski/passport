import {
  date,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { petsTable } from './pets';
import { auditTimestamps } from './timestamps';
import { veterinariansTable } from './veterinarians';

export const antiParasiteTreatmentsTable = pgTable(
  'anti_parasite_treatments',
  {
    id: serial().notNull(),
    name: varchar({ length: 255 }).notNull(),
    manufacturer: varchar({ length: 255 }),
    administeredOn: date().notNull(),
    administeredBy: integer(),
    petId: integer().notNull(),
    validUntil: date(),
    ...auditTimestamps,
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({ columns: [table.petId], foreignColumns: [petsTable.id] })
      .onUpdate('restrict')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.administeredBy],
      foreignColumns: [veterinariansTable.id],
    })
      .onUpdate('restrict')
      .onDelete('cascade'),
  ],
);
