'use client';

import { Card } from '@passport/components/ui/card';

import {
  usePetStore,
  usePassportStore,
  useOnboardingDataStore,
} from '@passport/onboarding/stores';
import {
  BasicInfoValues,
  CharacteristicsValues,
  PassportValues,
} from '@passport/onboarding/steps/pets/schema';
import { Cat, Dog, PawPrint } from 'lucide-react';
import { PetBasicMicroStep } from './micro-steps/basic';
import { PetCharacteristicsMicroStep } from './micro-steps/characteristics';
import { PetPassportMicroStep } from './micro-steps/passport';

interface PetsStepProps {
  onComplete: () => void;
  isUpdating?: boolean;
  microStep: string | null;
  onNextMicroStep: () => void;
}

export function PetStep({
  onComplete,
  isUpdating = false,
  microStep,
  onNextMicroStep,
}: PetsStepProps) {
  // Use the dedicated pet and passport stores
  const {
    basic,
    characteristics,
    isSubmitting: isPetSubmitting,
    storeBasicData,
    storeCharacteristicsData,
    submitPet,
  } = usePetStore();

  const {
    data: passportData,
    isSubmitting: isPassportSubmitting,
    storePassportData,
    submitPassport,
  } = usePassportStore();

  // Combined submission state
  const isSubmitting = isPetSubmitting || isPassportSubmitting;

  const onBasicInfoSubmit = (data: BasicInfoValues) => {
    storeBasicData(data);
    onNextMicroStep();
  };

  const onCharacteristicsSubmit = async (data: CharacteristicsValues) => {
    storeCharacteristicsData(data);

    // Submit pet data and get pet ID
    const petId = await submitPet();
    if (petId) {
      onNextMicroStep();
    }
  };

  // Handle passport info submission and complete the pets step
  const onPassportSubmit = async (data: PassportValues) => {
    storePassportData(data);

    // Get the current pet ID from the pet store
    const { petId } = usePetStore.getState();
    if (!petId) {
      console.error('Pet ID is required');
      return;
    }

    // Submit passport data
    const success = await submitPassport(petId);
    if (success) {
      // Mark the pet step as complete
      const { markStepComplete } = useOnboardingDataStore.getState();
      markStepComplete('pet');

      // Move to the next main step
      onComplete();
    }
  };

  // Get the appropriate icon based on the current micro step
  const getStepIcon = () => {
    switch (microStep) {
      case 'basic':
        return <PawPrint className='h-12 w-12 text-primary' />;
      case 'characteristics':
        return <Dog className='h-12 w-12 text-primary' />;
      case 'passport':
        return <Cat className='h-12 w-12 text-primary' />;
      default:
        return <PawPrint className='h-12 w-12 text-primary' />;
    }
  };

  // Get the appropriate heading based on the current micro step
  const getStepHeading = () => {
    switch (microStep) {
      case 'basic':
        return 'Tell us about your furry friend';
      case 'characteristics':
        return 'Physical Characteristics';
      case 'passport':
        return 'Passport Details';
      default:
        return 'Add Your Pet';
    }
  };

  // Get the appropriate description based on the current micro step
  const getStepDescription = () => {
    switch (microStep) {
      case 'basic':
        return "Let's get to know your pet a little better!";
      case 'characteristics':
        return "Tell us about your pet's physical characteristics.";
      case 'passport':
        return 'If your pet has a passport, please enter the details.';
      default:
        return "Let's get your pet set up in Passport.";
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-center'>
        <div className='flex items-center justify-center h-24 w-24 rounded-full bg-primary/10'>
          {getStepIcon()}
        </div>
      </div>

      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold'>{getStepHeading()}</h2>
        <p className='text-muted-foreground'>{getStepDescription()}</p>
      </div>

      <Card className='border-0 p-6'>
        {microStep === 'basic' && (
          <PetBasicMicroStep
            values={basic}
            onSubmit={onBasicInfoSubmit}
            isSubmitting={isSubmitting}
            isUpdating={isUpdating}
          />
        )}

        {microStep === 'characteristics' && (
          <PetCharacteristicsMicroStep
            values={characteristics}
            onSubmit={onCharacteristicsSubmit}
            isSubmitting={isSubmitting}
            isUpdating={isUpdating}
          />
        )}

        {microStep === 'passport' && (
          <PetPassportMicroStep
            name={basic?.name || null}
            values={passportData}
            onSubmit={onPassportSubmit}
            isSubmitting={isSubmitting}
            isUpdating={isUpdating}
          />
        )}
      </Card>
    </div>
  );
}
