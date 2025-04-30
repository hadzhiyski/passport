'use server';

import { db } from '@passport/database';
import { antiEchinococcusTreatmentsTable } from '@passport/database/schema/anti-echinococcus-treatments';
import { formatDate } from '@passport/lib/actions/utils/date';
import { treatmentUpdateSchema } from '@passport/treatments/anti-echinococcus/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export async function updateEchinococcusTreatment(
  data: z.infer<typeof treatmentUpdateSchema>,
) {
  try {
    // Validate the incoming data
    const validatedData = treatmentUpdateSchema.parse(data);

    // Hard-code administeredBy value to 1 as per requirements
    const treatmentId = validatedData.id;

    // Update the treatment record
    await db
      .update(antiEchinococcusTreatmentsTable)
      .set({
        name: validatedData.name,
        manufacturer: validatedData.manufacturer,
        administeredOn: formatDate(validatedData.administeredOn),
        administeredBy: validatedData.administeredBy,
        validUntil: formatDate(validatedData.validUntil),
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
