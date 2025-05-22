'use server';

import { db } from '@passport/database';
import { ownersTable } from '@passport/database/schema/owners';
import { eq } from 'drizzle-orm';

export async function getOwnerNameByExternalId(
  externalId: string,
): Promise<string | null> {
  return await db
    .select({
      firstname: ownersTable.firstname,
      lastname: ownersTable.lastname,
    })
    .from(ownersTable)
    .where(eq(ownersTable.externalId, externalId))
    .limit(1)
    .then((result) => {
      if (result.length === 0) {
        return null;
      }
      const owner = result[0];
      return `${owner.firstname} ${owner.lastname}`;
    });
}
