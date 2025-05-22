'use client';

import { fetchOnboardingPassport } from '@passport/passports/actions';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { insertPassport } from '../steps/pets/actions';
import { PassportValues } from '../steps/pets/schema';

type PassportState = {
  data: PassportValues | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
};

type PassportActions = {
  fetchPassport: (petId: string | null) => Promise<void>;
  storePassportData: (data: PassportValues) => void;
  submitPassport: (petId: string) => Promise<boolean>;
  reset: () => void;
};

const initialState: PassportState = {
  data: null,
  isLoading: false,
  error: null,
  isSubmitting: false,
};

export const usePassportStore = create<PassportState & PassportActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchPassport: async (petId) => {
        if (!petId) return;

        try {
          set({ isLoading: true, error: null });

          const passportResult = await fetchOnboardingPassport(petId);

          if (passportResult && passportResult.length > 0) {
            const passport = passportResult[0];
            set({
              data: {
                passportSerialNumber: passport.serialNumber,
                passportIssueDate: passport.issueDate,
              },
            });
          }
        } catch (err) {
          console.error('Error fetching passport data:', err);
          set({ error: 'Failed to load passport data' });
        } finally {
          set({ isLoading: false });
        }
      },

      storePassportData: (data) => {
        set({ data });
      },

      submitPassport: async (petId) => {
        const { data } = get();

        if (!data) {
          set({ error: 'Passport information not found' });
          return false;
        }

        try {
          set({ isSubmitting: true, error: null });

          // Prepare the passport data for submission
          const passportData = {
            serialNumber: data.passportSerialNumber,
            issueDate: data.passportIssueDate,
          };

          // Call the insertPassport action to save the passport data
          const result = await insertPassport(petId, passportData);

          // Handle the response
          if (!result.success) {
            set({
              error: result.error || 'Failed to save passport information',
            });
            return false;
          }

          return true;
        } catch (error) {
          console.error('Error saving passport information:', error);
          set({ error: 'An unexpected error occurred' });
          return false;
        } finally {
          set({ isSubmitting: false });
        }
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'passport-data',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
