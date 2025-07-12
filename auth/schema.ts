import { z } from 'zod';

// Auth validation schemas
export const signUpSchema = z
  .object({
    email: z
      .email('Please enter a valid email address')
      .min(1, 'Email is required'),
    displayName: z
      .string()
      .min(1, 'Please tell us your name')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .trim(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be less than 100 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const signInSchema = z.object({
  email: z
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

// Extract types from schemas
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;

// Server-side validation (without confirmPassword)
export const signUpServerSchema = signUpSchema.omit({ confirmPassword: true });
export type SignUpServerData = z.infer<typeof signUpServerSchema>;
