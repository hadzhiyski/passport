import {
  date,
  foreignKey,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { auditTimestamps } from './timestamps';
import { integerSqidNullable, serialSqid } from './types/sqid';
import { ownersTable } from './owners';

export const petSpecies = pgEnum('pet_species', ['dog', 'cat']);
export const petSex = pgEnum('pet_sex', ['male', 'female']);

export const petsTable = pgTable(
  'pets',
  {
    id: serialSqid('pets').notNull(),
    name: varchar({ length: 255 }).notNull(),
    dob: date().notNull(),
    sex: petSex().notNull(),
    species: petSpecies().notNull(),
    breed: varchar({ length: 255 }).notNull(),
    colors: varchar({ length: 255 }).array().notNull().default([]),
    notes: text(),
    noPassportOwnerId: integerSqidNullable('owners'),
    ...auditTimestamps,
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({
      columns: [table.noPassportOwnerId],
      foreignColumns: [ownersTable.id],
    }),
  ],
);
