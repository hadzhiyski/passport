'use server';

import { db } from '@passport/database';
import { antiParasiteTreatmentsTable } from '@passport/database/schema/anti-parasite-treatments';
import { petsTable } from '@passport/database/schema/pets';
import { handleZodError } from '@passport/lib/actions/error-handlers';
import { ActionResponse } from '@passport/lib/actions/types';
import { format } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { treatmentInsertSchema, TreatmentData } from './schema';

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

    await db.insert(antiParasiteTreatmentsTable).values({
      name: validatedData.name,
      manufacturer: validatedData.manufacturer,
      administeredOn: validatedData.administeredOn,
      administeredBy: validatedData.administeredBy,
      validUntil: validatedData.validUntil
        ? formatDate(validatedData.validUntil)
        : null,
      petId: petsTable.id.mapToDriverValue(validatedData.petId) as number,
    });

    revalidatePath(`/pets/${validatedData.petId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to add parasites treatment:', error);

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

    await db.update(antiParasiteTreatmentsTable).set({
      name: validatedData.name,
      manufacturer: validatedData.manufacturer,
      administeredOn: validatedData.administeredOn,
      administeredBy: validatedData.administeredBy,
      validUntil: validatedData.validUntil
        ? formatDate(validatedData.validUntil)
        : null,
      petId: petsTable.id.mapToDriverValue(validatedData.petId) as number,
    });

    revalidatePath(`/pets/${validatedData.petId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to edit parasites treatment:', error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
