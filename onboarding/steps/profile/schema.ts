import { z } from 'zod';

export const profileFormSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postcode: z.string().nullable(),
  phone: z.string().nullable(),
});

export const personalInfoSchema = profileFormSchema.pick({
  firstname: true,
  lastname: true,
  phone: true,
});

export const addressInfoSchema = profileFormSchema.pick({
  address: true,
  city: true,
  country: true,
  postcode: true,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type AddressInfoValues = z.infer<typeof addressInfoSchema>;
