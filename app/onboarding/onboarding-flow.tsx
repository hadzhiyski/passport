'use client';

import { Card } from '@passport/components/ui/card';
import { getNextStep, OnboardingStep } from '@passport/onboarding';
import {
  completeOnboarding,
  updateOnboardingStep,
} from '@passport/onboarding/actions';
import { useOnboardingNavigationStore } from '@passport/onboarding/navigation-store';
import { User } from '@passport/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BackButton } from './navigation/back-button';
import { SkipButton } from './navigation/skip-button';
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
  // Use our Zustand store for navigation
  const {
    currentMainStep,
    currentMicroStep,
    goToStep,
    goToPreviousStep,
    goToNextMicroStep,
    resetNavigation,
  } = useOnboardingNavigationStore();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Initialize the store with the server-provided initial step only on first mount
  useEffect(() => {
    // Only initialize on first render to avoid clearing history
    const { currentMainStep: existingMainStep } =
      useOnboardingNavigationStore.getState();
    if (existingMainStep !== initialStep) {
      resetNavigation(initialStep);
    }
    // Mark as initialized to prevent flickering
    setIsInitialized(true);
  }, [initialStep, resetNavigation]);

  // Don't render anything until we've initialized the navigation store
  if (!isInitialized) {
    return (
      <div className='flex flex-col space-y-6'>
        <div className='h-8'></div> {/* Placeholder for nav height */}
        <Card className='p-6 shadow-lg flex justify-center items-center min-h-[400px]'>
          <div className='text-center'>
            <div className='inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4'></div>
            <p className='text-muted-foreground'>Loading your progress...</p>
          </div>
        </Card>
      </div>
    );
  }

  /**
   * Handles completion of the current step and navigation to the next step
   */
  const handleCompleteStep = async (nextStep: OnboardingStep) => {
    try {
      setIsUpdating(true);
      const result = await updateOnboardingStep(user.id, nextStep);

      if (result.success) {
        // Update our navigation store
        goToStep(nextStep);
      } else {
        console.error('Error updating onboarding step:', result.error);
      }
    } catch (error) {
      console.error('Error updating onboarding step:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handles navigation to the previous step or micro step
   */
  const handleNavigateBack = async () => {
    const didNavigateBack = goToPreviousStep();
    if (didNavigateBack) {
      // If the main step changed, update it on the server
      const { currentMainStep: previousMainStep } =
        useOnboardingNavigationStore.getState();
      if (previousMainStep !== currentMainStep) {
        try {
          setIsUpdating(true);
          await updateOnboardingStep(user.id, previousMainStep);
        } catch (error) {
          console.error('Error updating onboarding step:', error);
        } finally {
          setIsUpdating(false);
        }
      }
    }
  };

  /**
   * Handles navigation to the next micro step or main step if at the last micro step
   */
  const handleNextMicroStep = () => {
    const movedToNextMicro = goToNextMicroStep();
    if (!movedToNextMicro) {
      // If we couldn't move to next micro step, go to next main step
      handleCompleteStep(getNextStep(currentMainStep));
    }
    return movedToNextMicro;
  };

  const renderCurrentStep = () => {
    if (currentMainStep === 'welcome') {
      return (
        <WelcomeStep
          user={user}
          onComplete={() => handleCompleteStep('profile')}
          isUpdating={isUpdating}
        />
      );
    }

    if (currentMainStep === 'profile') {
      return (
        <ProfileStep
          onComplete={() => handleCompleteStep('pets')}
          isUpdating={isUpdating}
          microStep={currentMicroStep}
          onNextMicroStep={handleNextMicroStep}
        />
      );
    }

    if (currentMainStep === 'pets') {
      return (
        <PetsStep
          onComplete={() => handleCompleteStep('complete')}
          isUpdating={isUpdating}
          microStep={currentMicroStep}
          onNextMicroStep={handleNextMicroStep}
        />
      );
    }

    if (currentMainStep === 'complete') {
      return (
        <CompleteStep
          user={user}
          onComplete={async () => {
            try {
              setIsUpdating(true);
              await completeOnboarding(user.id);
              router.push('/pets');
            } catch (error) {
              console.error('Error completing onboarding:', error);
              setIsUpdating(false);
            }
          }}
          isUpdating={isUpdating}
        />
      );
    }

    return null;
  };

  return (
    <div className='flex flex-col space-y-6 relative'>
      {isUpdating && (
        <div className='absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4'></div>
            <p className='text-muted-foreground'>Processing...</p>
          </div>
        </div>
      )}

      <div className='grid grid-cols-3 items-center'>
        <div className='justify-self-start'>
          <BackButton
            currentStep={currentMainStep}
            isUpdating={isUpdating}
            onNavigateBack={handleNavigateBack}
          />
        </div>
        <div className='justify-self-center'>
          <OnboardingStepsNav currentStep={currentMainStep} />
        </div>
        <div className='justify-self-end'>
          <SkipButton
            currentStep={currentMainStep}
            isUpdating={isUpdating}
            onClick={() => handleCompleteStep(getNextStep(currentMainStep))}
          />
        </div>
      </div>

      <Card className='p-6 shadow-lg'>{renderCurrentStep()}</Card>
    </div>
  );
}
