import { date, foreignKey, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { petsTable } from './pets';
import { auditTimestamps } from './timestamps';
import { integerSqid, serialSqid } from './types/sqid';
import { veterinariansTable } from './veterinarians';

export const clinicalExaminationsTable = pgTable(
  'clinical_examinations',
  {
    id: serialSqid('clinical_examinations').notNull(),
    date: date().notNull(),
    veterinarianId: integerSqid('veterinarians').notNull(),
    petId: integerSqid('pets').notNull(),
    ...auditTimestamps,
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({ columns: [table.petId], foreignColumns: [petsTable.id] })
      .onUpdate('restrict')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.veterinarianId],
      foreignColumns: [veterinariansTable.id],
    })
      .onUpdate('restrict')
      .onDelete('cascade'),
  ],
);
