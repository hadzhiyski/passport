'use server';

import { db } from '@passport/database';
import { ownersTable } from '@passport/database/schema/owners';
import { passportsTable } from '@passport/database/schema/passports';
import { petMarkingsTable } from '@passport/database/schema/pet-markings';
import { veterinariansTable } from '@passport/database/schema/veterinarians';
import { VETERINARIAN_ID_1 } from '@passport/treatments/constants';
import { getUserOwnerId } from '@passport/user';
import { eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { AddPassportValues } from './schema';

export async function addPassport(petId: string, data: AddPassportValues) {
  const user = await getUserOwnerId();
  if (!user) {
    throw new Error('User not found');
  }

  await db.insert(passportsTable).values({
    petId,
    serialNumber: data.serialNumber,
    issueDate: data.issueDate,
    issuedBy: VETERINARIAN_ID_1,
    owner1Id: user,
  });
}

export async function fetchOnboardingPassport(petId: string) {
  return db
    .select({
      serialNumber: passportsTable.serialNumber,
      issueDate: passportsTable.issueDate,
    })
    .from(passportsTable)
    .where(eq(passportsTable.petId, petId));
}

export async function fetchPassport(petId: string) {
  const owner1Table = alias(ownersTable, 'owner1');
  const owner2Table = alias(ownersTable, 'owner2');
  const passportSelect = db
    .select({
      id: passportsTable.id,
      serialNumber: passportsTable.serialNumber,
      issueDate: passportsTable.issueDate,
      marking: {
        code: petMarkingsTable.code,
        type: petMarkingsTable.type,
        place: petMarkingsTable.place,
        applicationDate: petMarkingsTable.applicationDate,
      },
      owner1: {
        id: owner1Table.id,
        name: sql`concat_ws(' ', ${owner1Table.firstname}, ${owner1Table.lastname})`.mapWith(
          String,
        ),
      },
      owner2: {
        id: owner2Table.id,
        name: sql`concat_ws(' ', ${owner2Table.firstname}, ${owner2Table.lastname})`.mapWith(
          String,
        ),
      },
      vet: {
        id: veterinariansTable.id,
        name: veterinariansTable.name,
      },
    })
    .from(passportsTable)
    .innerJoin(
      veterinariansTable,
      eq(passportsTable.issuedBy, veterinariansTable.id),
    )
    .innerJoin(owner1Table, eq(passportsTable.owner1Id, owner1Table.id))
    .leftJoin(owner2Table, eq(passportsTable.owner2Id, owner2Table.id))
    .leftJoin(petMarkingsTable, eq(passportsTable.petId, petMarkingsTable.id))
    .where(eq(passportsTable.petId, petId));

  return passportSelect;
}
