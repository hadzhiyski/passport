import {
  date,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { petsTable } from './pet';
import { auditTimestamps } from './timestamps';
import { veterinarianTable } from './veterinarian';

export const antiParasiteTreatmentTable = pgTable(
  'anti_parasite_treatments',
  {
    id: serial().notNull(),
    name: varchar({ length: 255 }).notNull(),
    manufacturer: varchar({ length: 255 }),
    administeredOn: timestamp().notNull(),
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
      foreignColumns: [veterinarianTable.id],
    })
      .onUpdate('restrict')
      .onDelete('cascade'),
  ],
);
