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
import { pets } from './pets';
import { vets } from './vets';

export const treatmentType = pgEnum('treatment_type', [
  'ectoparasites', // fleas, ticks, mites
  'endoparasites', // worms
]);

export const antiParasiteTreatments = pgTable(
  'anti_parasite_treatments',
  {
    id: serial().notNull(),
    name: varchar({ length: 255 }).notNull(),
    manufacturer: varchar({ length: 255 }),
    administeredOn: date({ mode: 'date' }).notNull(),
    validUntil: date({ mode: 'date' }).notNull(),
    type: treatmentType().notNull(),
    vetId: integer(),
    petId: integer().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
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
