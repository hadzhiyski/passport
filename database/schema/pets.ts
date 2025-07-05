import {
  date,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

export const petSpecies = pgEnum('pet_species', ['dog', 'cat']);
export const petSex = pgEnum('pet_sex', ['male', 'female']);

export const pets = pgTable(
  'pets',
  {
    id: serial().notNull(),
    name: varchar({ length: 255 }).notNull(),
    dob: date().notNull(),
    sex: petSex().notNull(),
    species: petSpecies().notNull(),
    breed: varchar({ length: 255 }).notNull(),
    colors: varchar({ length: 255 }).array().notNull().default([]),
    notes: text(),
  },
  (table) => [primaryKey({ columns: [table.id] })],
);
