import { antiEchinococcusTreatmentTable } from '@passport/database/schema/anti-echinococcus-treatment';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const baseSchema = createInsertSchema(antiEchinococcusTreatmentTable);

export const treatmentInsertSchema = baseSchema.extend({
  petId: z.string().trim().min(1, 'Pet ID cannot be empty'),
  name: z.string().trim().min(1, 'Treatment name cannot be empty'),
  // Manufacturer can be null based on the database schema
  manufacturer: z.string().trim().nullable(),
});
