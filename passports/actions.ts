'use server';

import { db } from '@passport/database';
import { passportsTable } from '@passport/database/schema/passports';
import { VETERINARIAN_ID_1 } from '@passport/treatments/constants';
import { getUserOwnerId } from '@passport/user';
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
