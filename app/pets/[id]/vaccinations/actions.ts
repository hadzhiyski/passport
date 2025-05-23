'use server';

import { db } from '@passport/database';
import { vaccinationsTable } from '@passport/database/schema/vaccinations';
import { handleZodError } from '@passport/lib/actions/error-handlers';
import { ActionResponse } from '@passport/lib/actions/types';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import {
  VaccinationData,
  vaccinationsInsertSchema,
  vaccinationsUpdateSchema,
} from './schema';

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
      expiryDate: validatedData.expiryDate,
      administeredOn: validatedData.administeredOn,
      administeredBy: validatedData.administeredBy,
      validFrom: validatedData.validFrom ? validatedData.validFrom : null,
      validUntil: validatedData.validUntil,
      petId: validatedData.petId,
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

    await db
      .update(vaccinationsTable)
      .set({
        name: validatedData.name,
        manufacturer: validatedData.manufacturer,
        lotNumber: validatedData.lotNumber,
        expiryDate: validatedData.expiryDate,
        administeredOn: validatedData.administeredOn,
        administeredBy: validatedData.administeredBy,
        validFrom: validatedData.validFrom ? validatedData.validFrom : null,
        validUntil: validatedData.validUntil,
        petId: validatedData.petId,
        type: validatedData.type,
      })
      .where(eq(vaccinationsTable.id, validatedData.id));

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
