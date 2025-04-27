'use server';

import { db } from '@passport/database';
import { petsTable } from '@passport/database/schema/pets';
import { vaccinationsTable } from '@passport/database/schema/vaccinations';
import { handleZodError } from '@passport/lib/actions/error-handlers';
import { ActionResponse } from '@passport/lib/actions/types';
import { format } from 'date-fns';
import { revalidatePath } from 'next/cache';
import {
  VaccinationData,
  vaccinationsInsertSchema,
  vaccinationsUpdateSchema,
} from './schema';

/**
 * Formats a Date object to a string in the format 'YYYY-MM-DD' for PostgreSQL.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export async function addVaccination(
  data: VaccinationData,
): Promise<ActionResponse> {
  const validationResult = await vaccinationsInsertSchema.safeParseAsync(data);

  if (!validationResult.success) {
    console.error('Validation failed:', validationResult.error);
    return handleZodError(validationResult.error);
  }

  try {
    const validatedData = validationResult.data;

    await db.insert(vaccinationsTable).values({
      name: validatedData.name,
      manufacturer: validatedData.manufacturer,
      lotNumber: validatedData.lotNumber,
      expiryDate: formatDate(validatedData.expiryDate),
      administeredOn: formatDate(validatedData.administeredOn),
      administeredBy: validatedData.administeredBy,
      validFrom: validatedData.validFrom
        ? formatDate(validatedData.validFrom)
        : null,
      validUntil: formatDate(validatedData.validUntil),
      petId: petsTable.id.mapToDriverValue(validatedData.petId) as number,
      type: validatedData.type,
    });

    revalidatePath(`/pets/${validatedData.petId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to add vaccination:', error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export async function editVaccination(
  data: VaccinationData,
): Promise<ActionResponse> {
  const validationResult = await vaccinationsUpdateSchema.safeParseAsync(data);

  if (!validationResult.success) {
    console.error('Validation failed:', validationResult.error);
    return handleZodError(validationResult.error);
  }

  try {
    const validatedData = validationResult.data;

    await db.update(vaccinationsTable).set({
      id: validatedData.id,
      name: validatedData.name,
      manufacturer: validatedData.manufacturer,
      lotNumber: validatedData.lotNumber,
      expiryDate: formatDate(validatedData.expiryDate),
      administeredOn: formatDate(validatedData.administeredOn),
      administeredBy: validatedData.administeredBy,
      validFrom: validatedData.validFrom
        ? formatDate(validatedData.validFrom)
        : null,
      validUntil: formatDate(validatedData.validUntil),
      petId: petsTable.id.mapToDriverValue(validatedData.petId) as number,
      type: validatedData.type,
    });

    revalidatePath(`/pets/${validatedData.petId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to update vaccination:', error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
