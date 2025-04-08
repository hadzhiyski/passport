import {
  date,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { auditTimestamps } from './timestamps';
import { serialSqid } from './types/serial-sqid';

export const petSpecies = pgEnum('pet_species', ['dog', 'cat']);
export const petSex = pgEnum('pet_sex', ['male', 'female']);

export const petsTable = pgTable(
  'pets',
  {
    id: serialSqid().notNull(),
    name: varchar({ length: 255 }).notNull(),
    dob: date().notNull(),
    sex: petSex().notNull(),
    species: petSpecies().notNull(),
    breed: varchar({ length: 255 }).notNull(),
    colors: varchar({ length: 255 }).array().notNull().default([]),
    notes: text(),
    ...auditTimestamps,
  },
  (table) => [primaryKey({ columns: [table.id] })],
);
