import { antiParasiteTreatmentTable } from '@passport/database/schema/anti-parasite-treatment';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const baseSchema = createInsertSchema(antiParasiteTreatmentTable);

export const treatmentInsertSchema = baseSchema.extend({
  petId: z.string().trim().min(1, 'Pet ID cannot be empty'),
  name: z.string().trim().min(1, 'Treatment name cannot be empty'),
  manufacturer: z.string().trim().nullable(),
});
