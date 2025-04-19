'use server';

import { db } from '@passport/database';
import { petsTable } from '@passport/database/schema/pet';
import { vaccinationsTable } from '@passport/database/schema/vaccination';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { vaccinationsInsertSchema } from './schema';

export async function addVaccination(
  data: z.infer<typeof vaccinationsInsertSchema>,
) {
  try {
    // Validate the data against the schema
    const validatedData = vaccinationsInsertSchema.parse(data);

    // Insert the vaccination record into the database
    const [newVaccination] = await db
      .insert(vaccinationsTable)
      .values({
        name: validatedData.name,
        manufacturer: validatedData.manufacturer,
        lotNumber: validatedData.lotNumber,
        expiryDate: validatedData.expiryDate,
        administeredOn: validatedData.administeredOn,
        administeredBy: validatedData.administeredBy,
        validFrom: validatedData.validFrom,
        validUntil: validatedData.validUntil,
        petId: petsTable.id.mapToDriverValue(validatedData.petId) as number,
        type: validatedData.type,
      })
      .returning();

    // Revalidate the vaccinations list path to reflect the changes
    revalidatePath(`/pets/${validatedData.petId}`);

    return { success: true, data: newVaccination };
  } catch (error) {
    console.error('Failed to add vaccination:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
