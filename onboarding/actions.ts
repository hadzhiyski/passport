'use server';

import { db } from '@passport/database';
import { userOnboardingTable } from '@passport/database/schema/user-onboarding';
import { eq } from 'drizzle-orm';
import { OnboardingStep } from './models';

// Update the current onboarding step for a user
export async function updateOnboardingStep(
  userId: string,
  step: OnboardingStep,
) {
  await db
    .insert(userOnboardingTable)
    .values({
      userId,
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userOnboardingTable.userId,
      set: {
        currentStep: step,
        updatedAt: new Date(),
      },
    });
}

export async function completeOnboarding(userId: string) {
  await db
    .update(userOnboardingTable)
    .set({
      completed: true,
      currentStep: 'complete',
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userOnboardingTable.userId, userId));
}
