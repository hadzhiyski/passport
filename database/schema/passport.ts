import { sql } from 'drizzle-orm';
import {
  date,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { ownerTable } from './owner';
import { petsTable } from './pet';
import { auditTimestamps, softDeleteTimestamps } from './timestamps';
import { serialSqid } from './types/serial-sqid';
import { veterinarianTable } from './veterinarian';

export const passportTable = pgTable(
  'passports',
  {
    id: serialSqid('passports').notNull(),
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
    uniqueIndex()
      .on(table.petId)
      .where(sql`${table.deletedAt} IS NULL`),
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
