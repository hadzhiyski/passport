'use server';

import { db } from '@passport/database';
import { ownersTable } from '@passport/database/schema/owners';
import { passportsTable } from '@passport/database/schema/passports';
import { petsTable } from '@passport/database/schema/pets';
import { auth0 } from '@passport/lib/auth0';
import { VETERINARIAN_ID_1 } from '@passport/treatments/constants';
import { getUserOwnerId } from '@passport/user';
import { eq } from 'drizzle-orm';
import { PetFormValues } from './schema';

export async function insertPet(pet: PetFormValues) {
  const session = await auth0.getSession();
  if (!session) {
    throw new Error('User not authenticated');
  }
  const owner1 = await db.query.ownersTable.findFirst({
    where: eq(ownersTable.externalId, session.user.sub),
    columns: {
      id: true,
    },
  });

  if (!owner1) {
    throw new Error('Owner not found');
  }

  const [{ id }] = await db
    .insert(petsTable)
    .values({
      name: pet.name,
      dob: pet.dob,
      breed: pet.breed,
      sex: pet.sex,
      species: pet.species,
      notes: pet.notes,
      colors: pet.colors,
      createdAt: new Date(),
      noPassportOwnerId: owner1.id,
    })
    .returning({
      id: petsTable.id,
    });
  return { id };
}

export async function insertPassport(
  petId: string,
  passport: {
    serialNumber: string;
    issueDate: Date;
  },
) {
  try {
    const ownerId = await getUserOwnerId();
    if (!ownerId) {
      throw new Error('User not authenticated');
    }

    await db.insert(passportsTable).values({
      issueDate: passport.issueDate,
      serialNumber: passport.serialNumber,
      petId,
      owner1Id: ownerId,
      issuedBy: VETERINARIAN_ID_1,
      createdAt: new Date(),
    });
    await db
      .update(petsTable)
      .set({
        noPassportOwnerId: null,
      })
      .where(eq(petsTable.id, petId));

    return { success: true as const };
  } catch (err) {
    console.error('Error inserting passport:', err);
    return { success: false as const, error: 'Failed to add passport' };
  }
}
