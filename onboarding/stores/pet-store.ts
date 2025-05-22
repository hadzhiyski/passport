'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { fetchOnboardingPet, insertPet } from '../steps/pets/actions';
import {
  BasicInfoValues,
  CharacteristicsValues,
  PetFormValues,
} from '../steps/pets/schema';

type PetState = {
  petId: string | null;
  basic: BasicInfoValues | null;
  characteristics: CharacteristicsValues | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
};

type PetActions = {
  fetchPet: (petId: string | null) => Promise<void>;
  storeBasicData: (data: BasicInfoValues) => void;
  storeCharacteristicsData: (data: CharacteristicsValues) => void;
  submitPet: () => Promise<string | null>;
  reset: () => void;
};

const initialState: PetState = {
  petId: null,
  basic: null,
  characteristics: null,
  isLoading: false,
  error: null,
  isSubmitting: false,
};

export const usePetStore = create<PetState & PetActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchPet: async (petId) => {
        if (!petId) return;

        try {
          set({ isLoading: true, error: null });

          const pet = await fetchOnboardingPet(petId);

          if (pet) {
            set({
              petId: pet.id,
              basic: {
                name: pet.name,
                dob: String(pet.dob), // Convert date to string
                sex: pet.sex,
              },
              characteristics: {
                species: pet.species,
                breed: pet.breed,
                colors: pet.colors,
                notes: pet.notes || undefined,
              },
            });
          }
        } catch (err) {
          console.error('Error fetching pet data:', err);
          set({ error: 'Failed to load pet data' });
        } finally {
          set({ isLoading: false });
        }
      },

      storeBasicData: (data) => {
        set({ basic: data });
      },

      storeCharacteristicsData: (data) => {
        set({ characteristics: data });
      },

      submitPet: async () => {
        const { basic, characteristics } = get();

        if (!basic) {
          set({ error: 'Basic pet information not found' });
          return null;
        }

        try {
          set({ isSubmitting: true, error: null });

          // Validate that required fields are present
          if (
            !characteristics ||
            !characteristics.species ||
            !characteristics.breed
          ) {
            set({ error: 'Species and breed are required' });
            return null;
          }

          // Create the complete pet data object combining basic and characteristics
          const petData: PetFormValues = {
            name: basic.name,
            dob: basic.dob,
            sex: basic.sex,
            species: characteristics.species,
            breed: characteristics.breed,
            colors: characteristics.colors,
            notes: characteristics.notes,
          };

          // Use the insertPet action to save the pet data
          const { id } = await insertPet(petData);

          // Store the pet ID in the state
          set({ petId: id });

          return id;
        } catch (error) {
          console.error('Error saving pet information:', error);
          set({ error: 'An unexpected error occurred' });
          return null;
        } finally {
          set({ isSubmitting: false });
        }
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'pet-data',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
