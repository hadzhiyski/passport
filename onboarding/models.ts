export const ONBOARDING_STEPS = [
  'welcome',
  'profile',
  'pet',
  'complete',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const ONBOARDING_STEPS_ORDER: OnboardingStep[] = [
  'welcome',
  'profile',
  'pet',
  'complete',
];

export interface Step {
  label: string;
  canSkip?: boolean;
}

export type StepConfig = Step & {
  microSteps?: {
    [key: string]: Step;
  };
};

// Configuration for steps, including micro steps
export const STEPS_CONFIG: Record<OnboardingStep, StepConfig> = {
  welcome: { label: 'Welcome' },
  profile: {
    label: 'Profile',
    microSteps: {
      personal: { label: 'Personal Info' },
      address: { label: 'Address Info' },
    },
  },
  pet: {
    label: 'Pet',
    microSteps: {
      basic: { label: 'Basic Information' },
      characteristics: { label: 'Physical Characteristics' },
      passport: { label: 'Passport Details', canSkip: true },
    },
  },
  complete: { label: 'Complete' },
};
