'use server';

import { db } from '@passport/database';
import { antiEchinococcusTreatmentTable } from '@passport/database/schema/anti-echinococcus-treatment';
import { petsTable } from '@passport/database/schema/pet';
import { handleZodError } from '@passport/lib/actions/error-handlers';
import { ActionResponse } from '@passport/lib/actions/types';
import { format } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { TreatmentData, treatmentInsertSchema } from './schema';

/**
 * Formats a Date object to a string in the format 'YYYY-MM-DD' for PostgreSQL.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export async function addTreatment(
  data: z.infer<typeof treatmentInsertSchema>,
): Promise<ActionResponse> {
  const validationResult = await treatmentInsertSchema.safeParseAsync(data);

  if (!validationResult.success) {
    console.error('Validation failed:', validationResult.error);
    return handleZodError(validationResult.error);
  }

  try {
    const validatedData = validationResult.data;

    await db.insert(antiEchinococcusTreatmentTable).values({
      name: validatedData.name,
      manufacturer: validatedData.manufacturer,
      administeredOn: validatedData.administeredOn,
      administeredBy: validatedData.administeredBy,
      validUntil: formatDate(validatedData.validUntil),
      petId: petsTable.id.mapToDriverValue(validatedData.petId) as number,
    });

    revalidatePath(`/pets/${validatedData.petId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to add treatment:', error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export async function editTreatment(
  data: TreatmentData,
): Promise<ActionResponse> {
  const validationResult = await treatmentInsertSchema.safeParseAsync(data);

  if (!validationResult.success) {
    console.error('Validation failed:', validationResult.error);
    return handleZodError(validationResult.error);
  }

  try {
    const validatedData = validationResult.data;

    await db.update(antiEchinococcusTreatmentTable).set({
      name: validatedData.name,
      manufacturer: validatedData.manufacturer,
      administeredOn: validatedData.administeredOn,
      administeredBy: validatedData.administeredBy,
      validUntil: formatDate(validatedData.validUntil),
      petId: petsTable.id.mapToDriverValue(validatedData.petId) as number,
    });

    revalidatePath(`/pets/${validatedData.petId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to update treatment:', error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
