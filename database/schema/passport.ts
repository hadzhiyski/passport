import {
  date,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { ownerTable } from './owner';
import { petsTable } from './pet';
import { auditTimestamps, softDeleteTimestamps } from './timestamps';
import { veterinarianTable } from './veterinarian';

export const passportTable = pgTable(
  'passports',
  {
    id: serial().notNull(),
    serialNumber: varchar({ length: 255 }).notNull(),
    issueDate: date().notNull(),
    issuedBy: integer().notNull(),
    petId: integer().notNull(),
    owner1Id: integer().notNull(),
    owner2Id: integer(),
    ...auditTimestamps,
    ...softDeleteTimestamps,
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({ columns: [table.petId], foreignColumns: [petsTable.id] })
      .onUpdate('restrict')
      .onDelete('cascade'),
    foreignKey({ columns: [table.owner1Id], foreignColumns: [ownerTable.id] })
      .onUpdate('restrict')
      .onDelete('cascade'),
    foreignKey({ columns: [table.owner2Id], foreignColumns: [ownerTable.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.issuedBy],
      foreignColumns: [veterinarianTable.id],
    })
      .onUpdate('restrict')
      .onDelete('cascade'),
  ],
);
