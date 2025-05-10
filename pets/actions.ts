'use server';

import { db } from '@passport/database';
import { ownersTable } from '@passport/database/schema/owners';
import { passportsTable } from '@passport/database/schema/passports';
import { petsTable } from '@passport/database/schema/pets';
import { auth0 } from '@passport/lib/auth0';
import { VETERINARIAN_ID_1 } from '@passport/treatments/constants';
import { eq } from 'drizzle-orm';
import { PetFormValues } from './schema';

export async function insertPet(pet: PetFormValues) {
  const session = await auth0.getSession();
  if (!session) {
    throw new Error('User not authenticated');
  }
  try {
    // Insert pet data into the database
    const [{ id }] = await db
      .insert(petsTable)
      .values({
        name: pet.name,
        dob: pet.dob,
        breed: pet.breed,
        sex: pet.sex,
        species: pet.species,
        notes: pet.notes,
        colors: [],
        createdAt: new Date(),
      })
      .returning({
        id: petsTable.id,
      });
    const owner1 = await db.query.ownersTable.findFirst({
      where: eq(ownersTable.externalId, session.user.sub),
      columns: {
        id: true,
      },
    });
    if (!owner1) {
      throw new Error('Owner not found');
    }
    await db.insert(passportsTable).values({
      issueDate: pet.passportIssueDate,
      serialNumber: pet.passportSerialNumber,
      petId: id,
      owner1Id: owner1.id,
      issuedBy: VETERINARIAN_ID_1,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (err) {
    console.error('Error inserting pet:', err);
    return { success: false, error: 'Failed to add pet' };
  }
}
