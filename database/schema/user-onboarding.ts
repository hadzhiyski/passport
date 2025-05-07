import {
  boolean,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { auditTimestamps } from './timestamps';

export const userOnboardingTable = pgTable(
  'user_onboarding',
  {
    userId: varchar().notNull(),
    completed: boolean().notNull().default(false),
    currentStep: varchar().notNull().default('welcome'),
    completedAt: timestamp({ mode: 'date' }),
    ...auditTimestamps,
  },
  (table) => [primaryKey({ columns: [table.userId] })],
);
