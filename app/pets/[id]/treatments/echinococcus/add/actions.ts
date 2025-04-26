'use server';

import { db } from '@passport/database';
import { antiEchinococcusTreatmentTable } from '@passport/database/schema/anti-echinococcus-treatment';
import { petsTable } from '@passport/database/schema/pet';
import { ActionResponse } from '@passport/lib/actions/types';
import { handleZodError } from '@passport/lib/actions/error-handlers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { treatmentInsertSchema } from './schema';

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
      validUntil: validatedData.validUntil,
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
