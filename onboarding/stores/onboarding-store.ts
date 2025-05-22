'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { usePetStore } from './pet-store';
import { useProfileStore } from './profile-store';
import { usePassportStore } from './passport-store';

/**
 * This store acts as a lightweight coordinator for the onboarding flow.
 * It doesn't store much data itself, but provides convenient methods to access
 * and coordinate between the domain-specific stores.
 */
type OnboardingState = {
  completedSteps: {
    profile: boolean;
    pet: boolean;
    passport: boolean;
  };
};

type OnboardingActions = {
  markStepComplete: (step: keyof OnboardingState['completedSteps']) => void;
  resetOnboarding: () => void;
  getPetName: () => string | null;
  initializeOnboardingData: (petId?: string | null) => Promise<void>;
  isStepCompleted: (step: keyof OnboardingState['completedSteps']) => boolean;
};

const initialState: OnboardingState = {
  completedSteps: {
    profile: false,
    pet: false,
    passport: false,
  },
};

export const useOnboardingDataStore = create<
  OnboardingState & OnboardingActions
>()(
  persist(
    (set, get) => ({
      ...initialState,
      markStepComplete: (step) => {
        set((state) => ({
          completedSteps: {
            ...state.completedSteps,
            [step]: true,
          },
        }));
      },

      initializeOnboardingData: async (petId = null) => {
        // Initialize all data in parallel for a better user experience
        const profilePromise = useProfileStore.getState().fetchProfile();

        // Only fetch pet and passport data if a petId is provided (for editing flow)
        const promises = [profilePromise];

        if (petId) {
          const petPromise = usePetStore.getState().fetchPet(petId);
          const passportPromise = usePassportStore
            .getState()
            .fetchPassport(petId);
          promises.push(petPromise, passportPromise);
        }

        try {
          await Promise.all(promises);
        } catch (error) {
          console.error('Error initializing onboarding data:', error);
        }
      },
      resetOnboarding: () => {
        // Reset this store
        set(initialState);

        // Reset domain-specific stores
        usePetStore.getState().reset();
        useProfileStore.getState().reset();
        usePassportStore.getState().reset();
      },

      getPetName: () => {
        const petStore = usePetStore.getState();
        return petStore.basic?.name || null;
      },

      isStepCompleted: (step) => {
        // Access the state directly rather than through the getter to avoid circular reference
        return get().completedSteps[step];
      },
    }),
    {
      name: 'onboarding-data',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
