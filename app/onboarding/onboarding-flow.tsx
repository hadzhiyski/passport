'use client';

import { Card } from '@passport/components/ui/card';
import { OnboardingStep } from '@passport/onboarding';
import { updateOnboardingStep } from '@passport/onboarding/actions';
import { MicroStepsProvider } from '@passport/onboarding/micro-steps';
import { User } from '@passport/user';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OnboardingStepsNav } from './onboarding-steps-nav';
import { CompleteStep } from './steps/complete-step';
import { PetsStep } from './steps/pets-step';
import { ProfileStep } from './steps/profile-step';
import { WelcomeStep } from './steps/welcome-step';

interface OnboardingFlowProps {
  user: User;
  currentStep: OnboardingStep;
}

export function OnboardingFlow({
  user,
  currentStep: initialStep,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleCompleteStep = async (nextStep: OnboardingStep) => {
    try {
      setIsUpdating(true);
      const result = await updateOnboardingStep(user.id, nextStep);

      if (result.success) {
        if (nextStep === 'complete') {
          router.push('/pets');
        } else {
          setCurrentStep(nextStep);
        }
      } else {
        console.error('Error updating onboarding step:', result.error);
      }
    } catch (error) {
      console.error('Error updating onboarding step:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Wrap specific steps that have micro steps with the provider
  const renderCurrentStep = () => {
    if (currentStep === 'welcome') {
      return (
        <WelcomeStep
          user={user}
          onComplete={() => handleCompleteStep('profile')}
          isUpdating={isUpdating}
        />
      );
    }

    if (currentStep === 'profile') {
      return (
        <ProfileStep
          onComplete={() => handleCompleteStep('pets')}
          isUpdating={isUpdating}
        />
      );
    }

    if (currentStep === 'pets') {
      return (
        <PetsStep
          onComplete={() => handleCompleteStep('complete')}
          isUpdating={isUpdating}
        />
      );
    }

    if (currentStep === 'complete') {
      return (
        <CompleteStep
          user={user}
          onComplete={() => router.push('/pets')}
          isUpdating={isUpdating}
        />
      );
    }

    return null;
  };

  return (
    <div className='flex flex-col space-y-6'>
      <MicroStepsProvider mainStep={currentStep}>
        <OnboardingStepsNav currentStep={currentStep} />
        <Card className='p-6 shadow-lg'>{renderCurrentStep()}</Card>
      </MicroStepsProvider>
    </div>
  );
}
