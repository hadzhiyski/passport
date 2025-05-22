import { db } from '@passport/database';
import { ownersTable } from '@passport/database/schema/owners';
import { userOnboardingTable } from '@passport/database/schema/user-onboarding';
import { auth0 } from '@passport/lib/auth0';
import { isOnboardingStep } from '@passport/onboarding';
import { getOwnerNameByExternalId } from '@passport/owners/actions';
import { eq } from 'drizzle-orm';
import { User, UserWithOnboarding } from './models';

export async function getUserId(): Promise<string | undefined> {
  const session = await auth0.getSession();
  const user = session?.user;
  if (!user || !user.sub) {
    return undefined;
  }
  return user.sub;
}

export async function getUserOwnerId(): Promise<string | null> {
  const session = await auth0.getSession();
  const user = session?.user;
  if (!user || !user.sub) {
    return null;
  }
  return db
    .select({ id: ownersTable.id })
    .from(ownersTable)
    .where(eq(ownersTable.externalId, user.sub))
    .limit(1)
    .then((result) => {
      if (result.length === 0) {
        return null;
      }
      return result[0].id;
    });
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

  const onboarding = await db
    .select({
      completed: userOnboardingTable.completed,
      currentStep: userOnboardingTable.currentStep,
    })
    .from(userOnboardingTable)
    .where(eq(userOnboardingTable.userId, user.id))
    .limit(1)
    .then((result) => {
      if (result.length === 0) {
        return {
          completed: false,
          currentStep: 'welcome',
        } satisfies UserWithOnboarding['onboarding'];
      }
      const onboarding = result[0];
      if (!isOnboardingStep(onboarding.currentStep)) {
        throw new Error(`Invalid onboarding step: ${onboarding.currentStep}`);
      }
      return {
        completed: onboarding.completed,
        currentStep: onboarding.currentStep,
      } satisfies UserWithOnboarding['onboarding'];
    });

  return {
    ...user,
    onboarding,
  };
}

export * from './models';
