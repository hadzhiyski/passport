import { sql } from 'drizzle-orm';
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
import { pets } from './pets';
import { vets } from './vets';

export const vaxType = pgEnum('vax_type', ['rabies', 'other']);

export const vaxes = pgTable(
  'vaxes',
  {
    id: serial().notNull(),
    name: varchar({ length: 255 }).notNull(),
    manufacturer: varchar({ length: 255 }).notNull(),
    lotNumber: varchar({ length: 255 }).notNull(),
    expiryDate: date({ mode: 'date' }).notNull(),
    administeredOn: date({ mode: 'date' }).notNull(),
    vetId: integer().notNull(),
    validFrom: date({ mode: 'date' }),
    validUntil: date({ mode: 'date' }).notNull(),
    petId: integer().notNull(),
    type: vaxType().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    check(
      'rabies_required_valid_from',
      sql`(${table.type} = 'rabies' AND ${table.validFrom} IS NOT NULL) OR (${table.type} != 'rabies')`,
    ),
    foreignKey({ columns: [table.petId], foreignColumns: [pets.id] })
      .onUpdate('restrict')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.vetId],
      foreignColumns: [vets.id],
    })
      .onUpdate('restrict')
      .onDelete('restrict'),
  ],
);
