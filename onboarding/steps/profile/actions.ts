'use server';

import { User } from '@auth0/nextjs-auth0/types';
import { db } from '@passport/database';
import { ownersTable } from '@passport/database/schema/owners';
import { auth0 } from '@passport/lib/auth0';
import { TrueMap } from '@passport/shared/types';
import { capitalizeFirstLetter } from '@passport/shared/utils';
import { eq } from 'drizzle-orm';

export type OwnerProfileData = Omit<
  typeof ownersTable.$inferSelect,
  'id' | 'createdAt' | 'updatedAt' | 'externalId'
>;

const selectOwnerColumns: TrueMap<OwnerProfileData> = {
  firstname: true,
  lastname: true,
  address: true,
  city: true,
  country: true,
  postcode: true,
  phone: true,
};

export async function upsertOwnerProfile(profileData: OwnerProfileData) {
  const session = await auth0.getSession();

  if (!session?.user) {
    return { success: false, error: 'User not authenticated' };
  }

  const externalId = session.user.sub;

  try {
    // Check if owner already exists in the database
    const existingOwner = await db.query.ownersTable.findFirst({
      where: eq(ownersTable.externalId, externalId),
    });

    if (existingOwner) {
      // Update existing owner
      await db
        .update(ownersTable)
        .set({
          firstname: profileData.firstname,
          lastname: profileData.lastname,
          address: profileData.address,
          city: profileData.city,
          country: profileData.country,
          postcode: profileData.postcode || null,
          phone: profileData.phone || null,
          updatedAt: new Date(),
        })
        .where(eq(ownersTable.externalId, externalId));
    } else {
      // Create new owner
      await db.insert(ownersTable).values({
        externalId,
        firstname: profileData.firstname,
        lastname: profileData.lastname,
        address: profileData.address,
        city: profileData.city,
        country: profileData.country,
        postcode: profileData.postcode,
        phone: profileData.phone,
        createdAt: new Date(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating owner profile:', error);
    return {
      success: false,
      error: 'Failed to update profile',
    };
  }
}

export async function tryGetOrAssumeOwnerProfile(): Promise<
  | {
      success: true;
      profile: OwnerProfileData;
    }
  | {
      success: false;
      error: string;
    }
> {
  const session = await auth0.getSession();

  if (!session?.user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const externalId = session.user.sub;
    const profile = await db.query.ownersTable.findFirst({
      columns: selectOwnerColumns,
      where: eq(ownersTable.externalId, externalId),
    });

    const nameInfo = extractNameInfo(session.user);
    return {
      success: true,
      profile: profile || {
        firstname: nameInfo.firstname,
        lastname: nameInfo.lastname,
        address: '',
        city: '',
        country: '',
        postcode: null,
        phone: null,
      },
    };
  } catch (error) {
    console.error('Error getting owner profile:', error);
    return {
      success: false,
      error: 'Failed to get profile',
    };
  }
}

function extractNameInfo(user: User) {
  let firstname = '';
  let lastname = '';

  if (user.name) {
    if (user.name.includes('@')) {
      const localPart = user.name.split('@')[0];
      const nameParts = localPart.split(/[._-]/);

      if (nameParts.length > 1) {
        firstname = capitalizeFirstLetter(nameParts[0]);
        lastname = capitalizeFirstLetter(nameParts.slice(1).join(' '));
      } else {
        firstname = capitalizeFirstLetter(localPart);
        lastname = user.family_name || ''; // Handle case where family_name might be undefined
      }
    } else {
      const nameParts = user.name.split(' ');
      if (nameParts.length === 2) {
        firstname = nameParts[0];
        lastname = nameParts[1];
      } else if (nameParts.length > 2) {
        firstname = nameParts.slice(0, nameParts.length - 1).join(' ');
        lastname = nameParts[nameParts.length - 1];
      } else {
        firstname = user.name;
        lastname = '';
      }
    }
  } else if (user.nickname) {
    firstname = user.nickname;
    lastname = '';
  }

  if (firstname && firstname.includes('+')) {
    firstname = firstname.split('+')[0];
  }
  if (lastname && lastname.includes('+')) {
    lastname = lastname.split('+')[0];
  }

  return { firstname, lastname };
}
