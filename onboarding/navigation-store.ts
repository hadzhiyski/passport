import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ONBOARDING_STEPS_ORDER, OnboardingStep, STEPS_CONFIG } from './models';

/**
 * Helper function to get available micro steps for a main step
 */
function getAvailableMicroSteps(step: OnboardingStep): string[] | null {
  const microSteps = STEPS_CONFIG[step]?.microSteps;
  return microSteps ? Object.keys(microSteps) : null;
}

/**
 * The navigation store state
 */
export interface OnboardingNavigationState {
  // Current state
  currentMainStep: OnboardingStep;
  currentMicroStep: string | null;

  // Actions - Main navigation
  /**
   * Navigate to a specific step and optionally a micro step
   * @param mainStep The main onboarding step to navigate to
   * @param microStep Optional micro step to navigate to (defaults to first micro step if available)
   */
  goToStep: (mainStep: OnboardingStep, microStep?: string | null) => void;

  /**
   * Navigate to the next main step
   * If there are micro steps in the next main step, it will navigate to the first micro step
   */
  goToNextStep: () => void;

  /**
   * Navigate to the previous step or micro step
   * If at the first micro step of a main step, goes to the previous main step's last micro step
   * @returns true if navigation was successful, false otherwise
   */
  goToPreviousStep: () => boolean;

  // Actions - Micro step navigation
  /**
   * Navigate to the next micro step within the current main step
   * @returns true if navigation was successful, false if already at the last micro step
   */
  goToNextMicroStep: () => boolean;

  /**
   * Navigate to the previous micro step within the current main step
   * @returns true if navigation was successful, false if already at the first micro step
   */
  goToPreviousMicroStep: () => boolean;

  // Reset functionality
  /**
   * Reset navigation to an initial step or the default first step
   * @param initialStep Optional starting step (defaults to first step in onboarding)
   */
  resetNavigation: (initialStep?: OnboardingStep) => void;

  // Helper methods
  /**
   * Get the index of the current main step in the onboarding steps order
   */
  getCurrentMainStepIndex: () => number;

  /**
   * Get the index of the current micro step in the available micro steps
   */
  getCurrentMicroStepIndex: () => number;

  /**
   * Get all available micro steps for the current main step
   */
  getAvailableMicroSteps: () => string[] | null;

  /**
   * Check if the user is at the last step in the onboarding flow
   */
  isLastStep: () => boolean;

  /**
   * Check if the user is at the first step in the onboarding flow
   */
  isFirstStep: () => boolean;
}

const INITIAL_MAIN_STEP = ONBOARDING_STEPS_ORDER[0];

/**
 * Zustand store for onboarding navigation
 * Manages both main steps and micro steps with localStorage persistence
 */
export const useOnboardingNavigationStore = create<OnboardingNavigationState>()(
  persist(
    (set, get) => {
      // Initialize with first main step and its first micro step (if any)
      const microSteps = getAvailableMicroSteps(INITIAL_MAIN_STEP);
      const initialMicroStep =
        microSteps && microSteps.length > 0 ? microSteps[0] : null;

      return {
        // Initial state
        currentMainStep: INITIAL_MAIN_STEP,
        currentMicroStep: initialMicroStep,

        // Actions
        goToStep: (mainStep, microStep) => {
          const availableMicroSteps = getAvailableMicroSteps(mainStep);

          // If microStep isn't specified but the step has micro steps, use the first one
          const targetMicroStep =
            microStep !== undefined
              ? microStep
              : availableMicroSteps && availableMicroSteps.length > 0
                ? availableMicroSteps[0]
                : null;

          set({
            currentMainStep: mainStep,
            currentMicroStep: targetMicroStep,
          });
        },

        goToNextStep: () => {
          const { currentMainStep } = get();
          const currentIndex = ONBOARDING_STEPS_ORDER.indexOf(currentMainStep);

          if (currentIndex < ONBOARDING_STEPS_ORDER.length - 1) {
            const nextMainStep = ONBOARDING_STEPS_ORDER[currentIndex + 1];
            get().goToStep(nextMainStep);
          }
        },

        goToPreviousStep: () => {
          const { currentMainStep, currentMicroStep } = get();
          const availableMicroSteps = getAvailableMicroSteps(currentMainStep);

          // First check if we can go to previous micro step within current main step
          if (currentMicroStep && availableMicroSteps) {
            const currentMicroIndex =
              availableMicroSteps.indexOf(currentMicroStep);
            if (currentMicroIndex > 0) {
              set({
                currentMicroStep: availableMicroSteps[currentMicroIndex - 1],
              });
              return true;
            }
          }

          // If we're at the first micro step (or no micro steps), go to previous main step
          const currentMainIndex =
            ONBOARDING_STEPS_ORDER.indexOf(currentMainStep);
          if (currentMainIndex > 0) {
            const prevMainStep = ONBOARDING_STEPS_ORDER[currentMainIndex - 1];
            const prevMicroSteps = getAvailableMicroSteps(prevMainStep);

            // If the previous step has micro steps, go to the last one
            const targetMicroStep = prevMicroSteps
              ? prevMicroSteps[prevMicroSteps.length - 1]
              : null;

            set({
              currentMainStep: prevMainStep,
              currentMicroStep: targetMicroStep,
            });
            return true;
          }

          return false;
        },

        goToNextMicroStep: () => {
          const { currentMainStep, currentMicroStep } = get();
          const availableMicroSteps = getAvailableMicroSteps(currentMainStep);

          if (!availableMicroSteps || !currentMicroStep) return false;

          const currentIndex = availableMicroSteps.indexOf(currentMicroStep);
          if (currentIndex < availableMicroSteps.length - 1) {
            set({
              currentMicroStep: availableMicroSteps[currentIndex + 1],
            });
            return true;
          }

          // If we're already at the last micro step, return false
          return false;
        },

        goToPreviousMicroStep: () => {
          const { currentMainStep, currentMicroStep } = get();
          const availableMicroSteps = getAvailableMicroSteps(currentMainStep);

          if (!availableMicroSteps || !currentMicroStep) return false;

          const currentIndex = availableMicroSteps.indexOf(currentMicroStep);
          if (currentIndex > 0) {
            set({
              currentMicroStep: availableMicroSteps[currentIndex - 1],
            });
            return true;
          }

          return false;
        },

        resetNavigation: (initialStep = INITIAL_MAIN_STEP) => {
          const microSteps = getAvailableMicroSteps(initialStep);
          const initialMicroStep =
            microSteps && microSteps.length > 0 ? microSteps[0] : null;

          set({
            currentMainStep: initialStep,
            currentMicroStep: initialMicroStep,
          });
        },

        // Helper functions for derived state
        getCurrentMainStepIndex: () => {
          const { currentMainStep } = get();
          return ONBOARDING_STEPS_ORDER.indexOf(currentMainStep);
        },

        getCurrentMicroStepIndex: () => {
          const { currentMainStep, currentMicroStep } = get();
          const availableMicroSteps = getAvailableMicroSteps(currentMainStep);

          return currentMicroStep && availableMicroSteps
            ? availableMicroSteps.indexOf(currentMicroStep)
            : -1;
        },

        getAvailableMicroSteps: () => {
          const { currentMainStep } = get();
          return getAvailableMicroSteps(currentMainStep);
        },

        isLastStep: () => {
          const currentMainIndex = get().getCurrentMainStepIndex();
          const { currentMicroStep } = get();
          const availableMicroSteps = get().getAvailableMicroSteps();

          const isLastMainStep =
            currentMainIndex === ONBOARDING_STEPS_ORDER.length - 1;

          // If there are no micro steps, or we're at the last micro step, and we're at the last main step
          const isLastMicroStep =
            !availableMicroSteps ||
            !currentMicroStep ||
            availableMicroSteps.indexOf(currentMicroStep) ===
              availableMicroSteps.length - 1;

          return isLastMainStep && isLastMicroStep;
        },

        isFirstStep: () => {
          const currentMainIndex = get().getCurrentMainStepIndex();
          const currentMicroIndex = get().getCurrentMicroStepIndex();

          // First step overall if we're at the first main step and either no micro steps or at the first micro step
          return currentMainIndex === 0 && currentMicroIndex <= 0;
        },
      };
    },
    {
      name: 'onboarding-navigation',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/**
 * A hook that returns the currently active micro step name and label
 * @returns The active micro step name and label, or null if no active micro step
 */
export function useActiveMicroStep(): { name: string; label: string } | null {
  const { currentMainStep, currentMicroStep } = useOnboardingNavigationStore();

  if (!currentMicroStep) return null;

  const microStepsConfig = STEPS_CONFIG[currentMainStep].microSteps;
  if (!microStepsConfig) return null;

  const label = microStepsConfig[currentMicroStep]?.label;

  return { name: currentMicroStep, label };
}

/**
 * A hook that returns all micro steps for the current main step with their labels
 * @returns Array of micro step objects with name and label, or null if no micro steps
 */
export function useMicroStepsWithLabels(): Array<{
  name: string;
  label: string;
}> | null {
  const { currentMainStep } = useOnboardingNavigationStore();
  const microSteps = getAvailableMicroSteps(currentMainStep);

  if (!microSteps) return null;

  const microStepsConfig = STEPS_CONFIG[currentMainStep].microSteps;
  if (!microStepsConfig) return null;

  return microSteps.map((name) => ({
    name,
    label: microStepsConfig[name]?.label,
  }));
}
