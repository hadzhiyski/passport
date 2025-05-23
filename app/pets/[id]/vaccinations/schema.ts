import { vaccinationTypeEnum } from '@passport/database/schema/vaccinations';
import { z } from 'zod';

const baseVaccinationsSchema = z.object({
  name: z.string().trim().min(1, 'Vaccination name cannot be empty'),
  manufacturer: z.string().trim().min(1, 'Manufacturer name cannot be empty'),
  lotNumber: z.string().trim().min(1, 'Lot number cannot be empty'),
  expiryDate: z.coerce.date({
    required_error: 'Expiry date is required',
    invalid_type_error: 'Expiry date must be a valid date',
  }),
  administeredOn: z.coerce.date({
    required_error: 'Administration date is required',
    invalid_type_error: 'Administration date must be a valid date',
  }),
  administeredBy: z.string().trim().min(1, 'Administrator ID cannot be empty'),
  validFrom: z.coerce
    .date({
      invalid_type_error: 'Valid from date must be a valid date',
    })
    .nullable(),
  validUntil: z.coerce.date({
    required_error: 'Valid until date is required',
    invalid_type_error: 'Valid until date must be a valid date',
  }),
  petId: z.string().trim().min(1, 'Pet ID cannot be empty'),
  type: z.enum(vaccinationTypeEnum.enumValues, {
    required_error: 'Vaccination type is required',
    invalid_type_error: "Vaccination type must be either 'rabies' or 'other'",
  }),
});

function rabiesVaccinationValidFromCheck(
  data: z.infer<typeof baseVaccinationsSchema>,
) {
  return data.type === 'rabies' && data.validFrom === null
    ? {
        message: 'Valid From date is required for rabies vaccinations',
        path: ['validFrom'],
      }
    : true;
}

export const vaccinationsInsertSchema = baseVaccinationsSchema.refine(
  rabiesVaccinationValidFromCheck,
);

export const vaccinationsUpdateSchema = baseVaccinationsSchema
  .extend({
    id: z.string().trim().min(1, 'Vaccination ID cannot be empty'),
  })
  .refine(rabiesVaccinationValidFromCheck);

export type VaccinationData = z.infer<typeof vaccinationsInsertSchema>;
export type VaccinationUpdateData = z.infer<typeof vaccinationsUpdateSchema>;
