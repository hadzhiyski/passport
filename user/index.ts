import { db } from '@passport/database';
import { userOnboardingTable } from '@passport/database/schema/user-onboarding';
import { auth0 } from '@passport/lib/auth0';
import { startUserOnboarding } from '@passport/onboarding/actions';
import { getOwnerNameByExternalId } from '@passport/owners/actions';
import { eq, sql } from 'drizzle-orm';
import { User, UserWithOnboarding } from './models';

export async function getUserId(): Promise<string | undefined> {
  const session = await auth0.getSession();
  const user = session?.user;
  if (!user || !user.sub) {
    return undefined;
  }
  return user.sub;
}

export async function getUser(): Promise<User | undefined> {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user || !user.name || !user.email) {
    return undefined;
  }

  const ownerName = await getOwnerNameByExternalId(user.sub);
  const name = ownerName || user.name;

  return {
    id: user.sub,
    name,
    initials: name
      .split(' ')
      .map((n) => n[0])
      .join(''),
    email: user.email,
    picture: user.picture || '',
  };
}

export async function getOnboardingUser(): Promise<
  UserWithOnboarding | undefined
> {
  const user = await getUser();
  if (!user) {
    return undefined;
  }

  const { journey, ...onboarding } = await db.query.userOnboardingTable
    .findFirst({
      columns: {
        completed: true,
        currentStep: true,
      },
      extras: {
        journey: sql`'existing-user'`.mapWith(String).as('journey'),
      },
      where: eq(userOnboardingTable.userId, user.id),
    })
    .then(
      (onboarding) =>
        onboarding || {
          currentStep: 'welcome',
          completed: false,
          journey: 'new-user',
        },
    );

  if (journey === 'new-user') {
    await startUserOnboarding(user.id);
  }

  return {
    ...user,
    onboarding,
  };
}

export * from './models';
