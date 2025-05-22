import { ONBOARDING_STEPS, OnboardingStep } from './models';

export function isOnboardingStep(step: string): step is OnboardingStep {
  return ONBOARDING_STEPS.includes(step as OnboardingStep);
}

export function getNextStep(currentStep: OnboardingStep): OnboardingStep {
  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);

  if (currentIndex === -1 || currentIndex >= ONBOARDING_STEPS.length - 1) {
    return 'complete';
  }

  return ONBOARDING_STEPS[currentIndex + 1];
}

export * from './models';
export * from './stores';
export * from './hooks';
