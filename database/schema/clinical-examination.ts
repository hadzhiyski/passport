import {
  date,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  serial,
} from 'drizzle-orm/pg-core';
import { petsTable } from './pet';
import { auditTimestamps } from './timestamps';
import { veterinarianTable } from './veterinarian';

export const clinicalExaminationTable = pgTable(
  'clinical_examinations',
  {
    id: serial().notNull(),
    date: date().notNull(),
    veterinarianId: integer().notNull(),
    petId: integer().notNull(),
    ...auditTimestamps,
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({ columns: [table.petId], foreignColumns: [petsTable.id] })
      .onUpdate('restrict')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.veterinarianId],
      foreignColumns: [veterinarianTable.id],
    })
      .onUpdate('restrict')
      .onDelete('cascade'),
  ],
);
