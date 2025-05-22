'use client';

import { Card } from '@passport/components/ui/card';
import {
  useProfileStore,
  useOnboardingDataStore,
} from '@passport/onboarding/stores';
import {
  AddressInfoValues,
  PersonalInfoValues,
} from '@passport/onboarding/steps/profile/schema';
import { Loader2, MapPin, UserCircle } from 'lucide-react';
import { useEffect } from 'react';
import { ProfileAddressMicroStep } from './micro-steps/address';
import { ProfilePersonalMicroStep } from './micro-steps/personal';

interface ProfileStepProps {
  onComplete: () => void;
  isUpdating?: boolean;
  microStep: string | null;
  onNextMicroStep: () => void;
}

export function ProfileStep({
  onComplete,
  isUpdating = false,
  microStep,
  onNextMicroStep,
}: ProfileStepProps) {
  const {
    personal,
    address,
    isLoading,
    error,
    isSubmitting,
    fetchProfile,
    storePersonalData,
    storeAddressData,
    submitProfile,
  } = useProfileStore();

  useEffect(() => {
    // Fetch profile data when component mounts
    fetchProfile();
  }, [fetchProfile]);

  // Handle personal info submission and transition to address step
  const onPersonalInfoSubmit = async (data: PersonalInfoValues) => {
    storePersonalData(data);
    onNextMicroStep();
  };

  // Handle address info submission and complete the profile step
  const onAddressInfoSubmit = async (data: AddressInfoValues) => {
    storeAddressData(data);

    // Submit the complete profile and move to next step if successful
    const success = await submitProfile();
    if (success) {
      // Mark the profile step as complete
      const { markStepComplete } = useOnboardingDataStore.getState();
      markStepComplete('profile');

      // Move to the next main step
      onComplete();
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-center'>
        <div className='flex items-center justify-center h-24 w-24 rounded-full bg-primary/10'>
          {microStep === 'personal' ? (
            <UserCircle className='h-12 w-12 text-primary' />
          ) : (
            <MapPin className='h-12 w-12 text-primary' />
          )}
        </div>
      </div>

      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold'>
          {microStep === 'personal'
            ? 'Tell us a bit about yourself'
            : 'Where can we find you?'}
        </h2>
        <p className='text-muted-foreground'>
          {microStep === 'personal'
            ? "We'll need this info for your pet's passport and to register you as their proud parent!"
            : 'Your address helps vets give location-based care recommendations for your furry friend.'}
        </p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
          {error}
        </div>
      )}

      <Card className='border-0 p-6'>
        {isLoading ? (
          <div className='flex justify-center items-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : null}
        {microStep === 'personal' ? (
          <ProfilePersonalMicroStep
            values={personal}
            onSubmit={onPersonalInfoSubmit}
            isSubmitting={isSubmitting}
            isUpdating={isUpdating}
          />
        ) : null}
        {microStep === 'address' ? (
          <ProfileAddressMicroStep
            values={address}
            onSubmit={onAddressInfoSubmit}
            isSubmitting={isSubmitting}
            isUpdating={isUpdating}
          />
        ) : null}
      </Card>
    </div>
  );
}
