import { z } from 'zod';

// Define form validation schema
export const petFormSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  sex: z.enum(['male', 'female']),
  species: z.enum(['dog', 'cat']),
  breed: z.string().min(1, 'Breed is required'),
  colors: z.string().optional(),
  notes: z.string().optional(),
  passportSerialNumber: z.string(),
  passportIssueDate: z.coerce.date(),
});

// Sub-schemas for micro steps
export const basicInfoSchema = petFormSchema.pick({
  name: true,
  dob: true,
  sex: true,
  species: true,
});

export const characteristicsSchema = petFormSchema.pick({
  breed: true,
  colors: true,
  notes: true,
});

export const passportSchema = petFormSchema.pick({
  passportSerialNumber: true,
  passportIssueDate: true,
});

export type PetFormValues = z.infer<typeof petFormSchema>;
export type BasicInfoValues = z.infer<typeof basicInfoSchema>;
export type CharacteristicsValues = z.infer<typeof characteristicsSchema>;
export type PassportValues = z.infer<typeof passportSchema>;
