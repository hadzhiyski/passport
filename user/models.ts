import { OnboardingStep } from '@passport/onboarding';

export type User = {
  id: string;
  name: string;
  initials: string;
  email: string;
  picture: string;
};

export type UserWithOnboarding = User & {
  onboarding: {
    completed: boolean;
    currentStep: OnboardingStep;
  };
};
