import { relations, sql } from 'drizzle-orm';
import {
  check,
  date,
  foreignKey,
  pgEnum,
  pgTable,
  primaryKey,
  varchar,
} from 'drizzle-orm/pg-core';
import { petsTable } from './pets';
import { auditTimestamps } from './timestamps';
import { integerSqid, serialSqid } from './types/sqid';
import { veterinariansTable } from './veterinarians';

export const vaccinationTypeEnum = pgEnum('vaccination_type', [
  'rabies',
  'other',
]);

export const vaccinationsTable = pgTable(
  'vaccinations',
  {
    id: serialSqid('vaccinations').notNull(),
    name: varchar({ length: 255 }).notNull(),
    manufacturer: varchar({ length: 255 }).notNull(),
    lotNumber: varchar({ length: 255 }).notNull(),
    expiryDate: date({ mode: 'date' }).notNull(),
    administeredOn: date({ mode: 'date' }).notNull(),
    administeredBy: integerSqid('veterinarians').notNull(),
    validFrom: date({ mode: 'date' }),
    validUntil: date({ mode: 'date' }).notNull(),
    petId: integerSqid('pets').notNull(),
    type: vaccinationTypeEnum().notNull(),
    ...auditTimestamps,
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    check(
      'rabies_required_valid_from',
      sql`(${table.type} = 'rabies' AND ${table.validFrom} IS NOT NULL) OR (${table.type} != 'rabies')`,
    ),
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
