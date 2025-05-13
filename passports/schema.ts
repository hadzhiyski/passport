import { z } from 'zod';

export const passportSerialNumberSchema = z
  .string()
  .trim()
  .regex(/^[A-Z]{2}(?: )?\d{2}[A-Z]{2}(?: )?\d{6}$/, {
    message:
      'Invalid code – must be 2 uppercase letters, optional single space, 2 digits, 2 uppercase letters, optional single space, then 6 digits.',
  });

export const addPassportSchema = z.object({
  serialNumber: passportSerialNumberSchema,
  issueDate: z.coerce.date(),
});

export type AddPassportValues = z.infer<typeof addPassportSchema>;
