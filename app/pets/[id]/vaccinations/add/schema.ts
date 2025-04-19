import { vaccinationsTable } from '@passport/database/schema/vaccination';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const baseSchema = createInsertSchema(vaccinationsTable);

export const vaccinationsInsertSchema = baseSchema
  .extend({
    petId: z.string().trim().min(1, 'Pet ID cannot be empty'),
    name: z.string().trim().min(1, 'Vaccination name cannot be empty'),
    manufacturer: z.string().trim().min(1, 'Manufacturer name cannot be empty'),
    lotNumber: z.string().trim().min(1, 'Lot number cannot be empty'),
  })
  .refine(
    (data) => {
      // For rabies vaccinations, validFrom is required
      return (
        data.type !== 'rabies' ||
        (data.type === 'rabies' && data.validFrom !== null)
      );
    },
    {
      message: 'Valid From date is required for rabies vaccinations',
      path: ['validFrom'],
    },
  );
