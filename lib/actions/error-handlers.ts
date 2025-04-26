import { z } from 'zod';
import { ValidationErrors } from './types';

export function handleZodError(error: z.ZodError): {
  success: false;
  errors: ValidationErrors;
} {
  const errorsByPath = error.errors.reduce<Record<string, string[]>>(
    (acc, err) => {
      const key = err.path.join('.') || 'form';
      acc[key] = acc[key] || [];
      acc[key].push(err.message);
      return acc;
    },
    {},
  );

  return {
    success: false,
    errors: errorsByPath,
  };
}
