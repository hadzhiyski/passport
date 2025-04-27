import {
  check,
  date,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { petsTable } from './pets';
import { auditTimestamps } from './timestamps';
import { veterinariansTable } from './veterinarians';
import { sql } from 'drizzle-orm';

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
    validFrom: date(),
    validUntil: date().notNull(),
    petId: integer().notNull(),
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
