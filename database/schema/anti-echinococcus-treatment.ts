import {
  date,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { petsTable } from './pet';
import { auditTimestamps } from './timestamps';
import { veterinarianTable } from './veterinarian';

export const antiEchinococcusTreatmentTable = pgTable(
  'anti_echinococcus_treatments',
  {
    id: serial().notNull(),
    name: varchar({ length: 255 }).notNull(),
    manufacturer: varchar({ length: 255 }).notNull(),
    administeredOn: date().notNull(),
    administeredBy: integer(),
    petId: integer().notNull(),
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
