import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  BasicInfoValues,
  CharacteristicsValues,
  PassportValues,
} from './steps/pets/schema';
import { AddressInfoValues, PersonalInfoValues } from './steps/profile/schema';

export type OnboardingDataState = {
  petId: string | null;
  steps: {
    profile: {
      personal: PersonalInfoValues | null;
      address: AddressInfoValues | null;
    };
    pet: {
      basic: BasicInfoValues | null;
      characteristics: CharacteristicsValues | null;
    };
    passport: PassportValues | null;
  };
};

export type OnboardingState = OnboardingDataState & {
  storeProfilePersonalData: (data: PersonalInfoValues) => void;
  storeProfileAddressData: (data: AddressInfoValues) => void;
  storePetBasicData: (data: BasicInfoValues) => void;
  storePetCharacteristicsData: (data: CharacteristicsValues) => void;
  storePetPassportData: (data: PassportValues) => void;
  storePetId: (id: string) => void;
  reset: () => void;
};

/**
 * Initial state values
 */
const initialState: OnboardingDataState = {
  petId: null,
  steps: {
    profile: {
      personal: null,
      address: null,
    },
    pet: {
      basic: null,
      characteristics: null,
    },
    passport: null,
  },
};

/**
 * Zustand store for onboarding data
 * Stores data collected during the onboarding process
 */
export const useOnboardingDataStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      storeProfilePersonalData: (data) => {
        set((state) => ({
          steps: {
            ...state.steps,
            profile: {
              ...state.steps.profile,
              personal: data,
            },
          },
        }));
      },
      storeProfileAddressData: (data) => {
        set((state) => ({
          steps: {
            ...state.steps,
            profile: {
              ...state.steps.profile,
              address: data,
            },
          },
        }));
      },
      storePetBasicData: (data) => {
        set((state) => ({
          steps: {
            ...state.steps,
            pet: {
              ...state.steps.pet,
              basic: data,
            },
          },
        }));
      },
      storePetCharacteristicsData: (data) => {
        set((state) => ({
          steps: {
            ...state.steps,
            pet: {
              ...state.steps.pet,
              characteristics: data,
            },
          },
        }));
      },
      storePetPassportData: (data) => {
        set((state) => ({
          steps: {
            ...state.steps,
            passport: data,
          },
        }));
      },

      storePetId: (id) => {
        set(() => ({
          petId: id,
        }));
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'onboarding-data',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
