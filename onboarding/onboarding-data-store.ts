import { PetFormValues } from '@passport/pets/schema';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * The onboarding data store interface
 */
export interface OnboardingDataState {
  // Pet data collected during onboarding
  petData: {
    name: string | null;
    // We can add other fields from PetFormValues as needed
  };

  // Actions
  /**
   * Update the pet data
   */
  updatePetData: (data: Partial<PetFormValues>) => void;

  /**
   * Reset the store data
   */
  resetData: () => void;
}

/**
 * Initial state values
 */
const initialState = {
  petData: {
    name: null,
  },
};

/**
 * Zustand store for onboarding data
 * Stores data collected during the onboarding process
 */
export const useOnboardingDataStore = create<OnboardingDataState>()(
  persist(
    (set) => ({
      ...initialState,

      updatePetData: (data) => {
        set((state) => ({
          petData: {
            ...state.petData,
            ...(data.name !== undefined ? { name: data.name } : {}),
            // Add other fields as needed
          },
        }));
      },

      resetData: () => {
        set(initialState);
      },
    }),
    {
      name: 'onboarding-data',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
