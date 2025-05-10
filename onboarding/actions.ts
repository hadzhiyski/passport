'use server';

import { db } from '@passport/database';
import { userOnboardingTable } from '@passport/database/schema/user-onboarding';
import { eq } from 'drizzle-orm';
import { OnboardingStep } from './models';

export async function startUserOnboarding(userId: string) {
  await db.insert(userOnboardingTable).values({
    userId,
    completed: false,
    currentStep: 'welcome',
    createdAt: new Date(),
  });
}

// Update the current onboarding step for a user
export async function updateOnboardingStep(
  userId: string,
  step: OnboardingStep,
) {
  try {
    await db
      .update(userOnboardingTable)
      .set({
        currentStep: step,
        updatedAt: new Date(),
      })
      .where(eq(userOnboardingTable.userId, userId));

    // Return a simple serializable object
    return {
      success: true,
      step,
    };
  } catch (error) {
    // Return a simple error object that can be serialized
    console.error('Error updating onboarding step:', error);
    return {
      success: false,
      error: 'Failed to update onboarding step',
    };
  }
}

export async function completeOnboarding(userId: string) {
  try {
    await db
      .update(userOnboardingTable)
      .set({
        completed: true,
        currentStep: 'complete',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userOnboardingTable.userId, userId));

    return { success: true };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return {
      success: false,
      error: 'Failed to complete onboarding',
    };
  }
}
