'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  tryGetOrAssumeOwnerOnboardingProfile,
  upsertOwnerProfile,
} from '../steps/profile/actions';
import { AddressInfoValues, PersonalInfoValues } from '../steps/profile/schema';

type ProfileState = {
  personal: PersonalInfoValues | null;
  address: AddressInfoValues | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
};

type ProfileActions = {
  fetchProfile: () => Promise<void>;
  storePersonalData: (data: PersonalInfoValues) => void;
  storeAddressData: (data: AddressInfoValues) => void;
  submitProfile: () => Promise<boolean>;
  reset: () => void;
};

const initialState: ProfileState = {
  personal: null,
  address: null,
  isLoading: false,
  error: null,
  isSubmitting: false,
};

export const useProfileStore = create<ProfileState & ProfileActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const profile = await tryGetOrAssumeOwnerOnboardingProfile();

          const profileData = {
            firstname: profile.firstname,
            lastname: profile.lastname,
            address: profile.address,
            city: profile.city,
            country: profile.country,
            postcode: profile.postcode,
            phone: profile.phone,
          };

          set({
            personal: {
              firstname: profileData.firstname,
              lastname: profileData.lastname,
              phone: profileData.phone,
            },
            address: {
              address: profileData.address,
              city: profileData.city,
              country: profileData.country,
              postcode: profileData.postcode,
            },
          });
        } catch (err) {
          console.error('Error fetching profile data:', err);
          set({ error: 'Failed to load profile data' });
        } finally {
          set({ isLoading: false });
        }
      },

      storePersonalData: (data: PersonalInfoValues) => {
        set({ personal: data });
      },

      storeAddressData: (data: AddressInfoValues) => {
        set({ address: data });
      },

      submitProfile: async () => {
        const { personal, address } = get();

        if (!personal) {
          set({ error: 'Personal profile data not found' });
          return false;
        }

        try {
          set({ isSubmitting: true, error: null });

          const result = await upsertOwnerProfile({
            firstname: personal.firstname,
            lastname: personal.lastname,
            address: address?.address || '',
            city: address?.city || '',
            country: address?.country || '',
            postcode: address?.postcode || null,
            phone: personal.phone || null,
          });

          if (!result.success) {
            set({
              error: result.error || 'Failed to save profile information',
            });
            return false;
          }

          return true;
        } catch (error) {
          console.error('Error saving profile information:', error);
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
      name: 'profile-data',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
