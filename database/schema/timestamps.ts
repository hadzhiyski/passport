import { timestamp } from 'drizzle-orm/pg-core';

export const auditTimestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp(),
};

export const softDeleteTimestamps = {
  deletedAt: timestamp(),
};
