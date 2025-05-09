export const ONBOARDING_STEPS = [
  'welcome',
  'profile',
  'pets',
  'complete',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const ONBOARDING_STEPS_ORDER: OnboardingStep[] = [
  'welcome',
  'profile',
  'pets',
  'complete',
];

export interface StepConfig {
  label: string;
  microSteps?: {
    [key: string]: string;
  };
}

// Configuration for steps, including micro steps
export const STEPS_CONFIG: Record<OnboardingStep, StepConfig> = {
  welcome: { label: 'Welcome' },
  profile: {
    label: 'Profile',
    microSteps: {
      personal: 'Personal Info',
      address: 'Address Info',
    },
  },
  pets: { label: 'Pets' },
  complete: { label: 'Complete' },
};
