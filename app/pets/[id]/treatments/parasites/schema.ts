import { z } from 'zod';

export const treatmentInsertSchema = z.object({
  name: z.string().trim().min(1, 'Treatment name cannot be empty'),
  manufacturer: z.string().trim().optional(),
  administeredOn: z.coerce.date({
    required_error: 'Administration date is required',
    invalid_type_error: 'Administration date must be a valid date',
  }),
  administeredBy: z.string().trim().min(1, 'Administrator ID cannot be empty'),
  validUntil: z.coerce.date({
    required_error: 'Valid until date is required',
    invalid_type_error: 'Valid until date must be a valid date',
  }),
  petId: z.string().trim().min(1, 'Pet ID cannot be empty'),
});

export const treatmentUpdateSchema = treatmentInsertSchema.extend({
  id: z.number().int().positive('Treatment ID must be a positive integer'),
});

export type TreatmentData = z.infer<typeof treatmentInsertSchema>;
export type TreatmentUpdateData = z.infer<typeof treatmentUpdateSchema>;
