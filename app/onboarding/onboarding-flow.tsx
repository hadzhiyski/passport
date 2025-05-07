'use client';

import { Card } from '@passport/components/ui/card';
import { ONBOARDING_STEPS_ORDER, OnboardingStep } from '@passport/onboarding';
import { updateOnboardingStep } from '@passport/onboarding/actions';
import { User } from '@passport/user';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

  const handleCompleteStep = async (
    step: OnboardingStep,
    nextStep: OnboardingStep,
  ) => {
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

  const currentStepIndex = ONBOARDING_STEPS_ORDER.indexOf(currentStep);

  return (
    <div className='flex flex-col space-y-6'>
      <div className='flex justify-end mb-6'>
        <div className='flex items-center gap-2'>
          {ONBOARDING_STEPS_ORDER.slice(0, -1).map((step, index) => (
            <div
              key={step}
              className={`flex items-center ${index > 0 ? 'ml-2' : ''}`}
            >
              {index > 0 && (
                <div
                  className={`h-0.5 w-8 mr-2 ${
                    index <= currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
              <div
                className={`flex items-center justify-center rounded-full h-8 w-8 ${
                  index < currentStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStepIndex
                      ? 'border-2 border-primary text-primary'
                      : 'border-2 border-gray-200 text-gray-400'
                }`}
              >
                {index < currentStepIndex ? (
                  <CheckCircle size={16} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className='p-6 shadow-lg'>
        {currentStep === 'welcome' && (
          <WelcomeStep
            user={user}
            onComplete={() => handleCompleteStep(currentStep, 'profile')}
            isUpdating={isUpdating}
          />
        )}

        {currentStep === 'profile' && (
          <ProfileStep
            onComplete={() => handleCompleteStep(currentStep, 'pets')}
            isUpdating={isUpdating}
          />
        )}

        {currentStep === 'pets' && (
          <PetsStep
            onComplete={() => handleCompleteStep(currentStep, 'complete')}
            isUpdating={isUpdating}
          />
        )}

        {currentStep === 'complete' && (
          <CompleteStep
            user={user}
            onComplete={() => router.push('/pets')}
            isUpdating={isUpdating}
          />
        )}
      </Card>
    </div>
  );
}
