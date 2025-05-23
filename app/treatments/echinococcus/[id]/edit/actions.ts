'use server';

import { db } from '@passport/database';
import { antiEchinococcusTreatmentsTable } from '@passport/database/schema/anti-echinococcus-treatments';
import { treatmentUpdateSchema } from '@passport/treatments/anti-echinococcus/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export async function updateEchinococcusTreatment(
  data: z.infer<typeof treatmentUpdateSchema>,
) {
  try {
    const validatedData = treatmentUpdateSchema.parse(data);

    const treatmentId = validatedData.id;

    await db
      .update(antiEchinococcusTreatmentsTable)
      .set({
        name: validatedData.name,
        manufacturer: validatedData.manufacturer,
        administeredOn: validatedData.administeredOn,
        administeredBy: validatedData.administeredBy,
        validUntil: validatedData.validUntil,
        updatedAt: new Date(),
      })
      .where(eq(antiEchinococcusTreatmentsTable.id, treatmentId));

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors };
    }
    console.error('Failed to update anti-echinococcus treatment:', error);
    throw new Error('Failed to update treatment');
  }
}
