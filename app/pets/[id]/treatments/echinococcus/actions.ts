'use server';

import { db } from '@passport/database';
import { antiEchinococcusTreatmentsTable } from '@passport/database/schema/anti-echinococcus-treatments';
import { handleZodError } from '@passport/lib/actions/error-handlers';
import { ActionResponse } from '@passport/lib/actions/types';
import {
  TreatmentData,
  treatmentInsertSchema,
} from '@passport/treatments/anti-echinococcus/schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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

    await db.insert(antiEchinococcusTreatmentsTable).values({
      name: validatedData.name,
      manufacturer: validatedData.manufacturer,
      administeredOn: validatedData.administeredOn,
      administeredBy: validatedData.administeredBy,
      validUntil: validatedData.validUntil,
      petId: validatedData.petId,
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

    await db.update(antiEchinococcusTreatmentsTable).set({
      name: validatedData.name,
      manufacturer: validatedData.manufacturer,
      administeredOn: validatedData.administeredOn,
      administeredBy: validatedData.administeredBy,
      validUntil: validatedData.validUntil,
      petId: validatedData.petId,
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
