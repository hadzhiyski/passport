import {
  date,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { owners } from './owners';
import { pets } from './pets';
import { vets } from './vets';

export const passports = pgTable(
  'passports',
  {
    id: serial().notNull(),
    serialNumber: varchar({ length: 255 }).notNull(),
    issueDate: date({ mode: 'date' }).notNull(),
    issuedBy: integer().notNull(),
    petId: integer().notNull(),
    owner1Id: integer().notNull(),
    owner2Id: integer(),
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({ columns: [table.petId], foreignColumns: [pets.id] })
      .onUpdate('restrict')
      .onDelete('restrict'),
    foreignKey({ columns: [table.owner1Id], foreignColumns: [owners.id] })
      .onUpdate('restrict')
      .onDelete('restrict'),
    foreignKey({ columns: [table.owner2Id], foreignColumns: [owners.id] })
      .onUpdate('restrict')
      .onDelete('restrict'),
    foreignKey({ columns: [table.issuedBy], foreignColumns: [vets.id] })
      .onUpdate('restrict')
      .onDelete('restrict'),
  ],
);
