import {
  date,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { petsTable } from './pet';
import { auditTimestamps } from './timestamps';
import { veterinarianTable } from './veterinarian';

export const vaccinationTypeEnum = pgEnum('vaccination_type', [
  'rabies',
  'other',
]);

export const vaccinationsTable = pgTable(
  'vaccinations',
  {
    id: serial().notNull(),
    name: varchar({ length: 255 }).notNull(),
    manufacturer: varchar({ length: 255 }).notNull(),
    lotNumber: varchar({ length: 255 }).notNull(),
    expiryDate: date().notNull(),
    administeredOn: date().notNull(),
    administeredBy: integer().notNull(),
    validFrom: date().notNull(),
    validUntil: date().notNull(),
    petId: integer().notNull(),
    type: vaccinationTypeEnum().notNull(),
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
