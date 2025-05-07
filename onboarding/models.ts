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
