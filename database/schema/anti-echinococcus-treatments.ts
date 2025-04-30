import {
  date,
  foreignKey,
  pgTable,
  primaryKey,
  varchar,
} from 'drizzle-orm/pg-core';
import { petsTable } from './pets';
import { auditTimestamps } from './timestamps';
import { integerSqid, serialSqid } from './types/sqid';
import { veterinariansTable } from './veterinarians';

export const antiEchinococcusTreatmentsTable = pgTable(
  'anti_echinococcus_treatments',
  {
    id: serialSqid('anti_echinococcus_treatments').notNull(),
    name: varchar({ length: 255 }).notNull(),
    manufacturer: varchar({ length: 255 }),
    administeredOn: date({ mode: 'date' }).notNull(),
    administeredBy: integerSqid('veterinarians'),
    validUntil: date({ mode: 'date' }).notNull(),
    petId: integerSqid('pets').notNull(),
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
