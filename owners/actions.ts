'use server';

import { db } from '@passport/database';
import { ownersTable } from '@passport/database/schema/owners';
import { eq } from 'drizzle-orm';

export async function getOwnerNameByExternalId(
  externalId: string,
): Promise<string | undefined> {
  return db.query.ownersTable
    .findFirst({
      where: eq(ownersTable.externalId, externalId),
      columns: {
        firstname: true,
        lastname: true,
      },
    })
    .then((owner) =>
      owner ? `${owner.firstname} ${owner.lastname}` : undefined,
    );
}
