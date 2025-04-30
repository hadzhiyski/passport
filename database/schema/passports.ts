import { sql } from 'drizzle-orm';
import {
  date,
  foreignKey,
  pgTable,
  primaryKey,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { ownersTable } from './owners';
import { petsTable } from './pets';
import { auditTimestamps, softDeleteTimestamps } from './timestamps';
import { integerSqid, serialSqid } from './types/sqid';
import { veterinariansTable } from './veterinarians';

export const passportsTable = pgTable(
  'passports',
  {
    id: serialSqid('passports').notNull(),
    serialNumber: varchar({ length: 255 }).notNull(),
    issueDate: date().notNull(),
    issuedBy: integerSqid('veterinarians').notNull(),
    petId: integerSqid('pets').notNull(),
    owner1Id: integerSqid('owners').notNull(),
    owner2Id: integerSqid('owners'),
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
    foreignKey({ columns: [table.owner1Id], foreignColumns: [ownersTable.id] })
      .onUpdate('restrict')
      .onDelete('cascade'),
    foreignKey({ columns: [table.owner2Id], foreignColumns: [ownersTable.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.issuedBy],
      foreignColumns: [veterinariansTable.id],
    })
      .onUpdate('restrict')
      .onDelete('cascade'),
  ],
);
