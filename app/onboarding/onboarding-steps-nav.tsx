'use client';

import {
  ONBOARDING_STEPS_ORDER,
  OnboardingStep,
  STEPS_CONFIG,
} from '@passport/onboarding';
import {
  useOnboardingNavigationStore,
  useMicroStepsWithLabels,
} from '@passport/onboarding/navigation-store';
import { CheckCircle } from 'lucide-react';

interface OnboardingStepsNavProps {
  currentStep: OnboardingStep;
}

/**
 * Navigation component that displays the onboarding progress with main steps and micro steps
 */
export function OnboardingStepsNav({ currentStep }: OnboardingStepsNavProps) {
  const { currentMicroStep, getCurrentMicroStepIndex } =
    useOnboardingNavigationStore();

  // The micro steps with their labels for better rendering
  const microStepsWithLabels = useMicroStepsWithLabels();

  const currentStepIndex = ONBOARDING_STEPS_ORDER.indexOf(currentStep);
  const activeMicroStepIndex = getCurrentMicroStepIndex();

  return (
    <div className='flex justify-end'>
      <div className='flex flex-col'>
        <div className='flex items-center gap-2'>
          {ONBOARDING_STEPS_ORDER.slice(0, -1).map((step, index) => {
            const isCurrentStep = index === currentStepIndex;
            const isPastStep = index < currentStepIndex;

            return (
              <div key={step} className='flex items-center'>
                {index > 0 && (
                  <div
                    className={`h-0.5 w-8 ${
                      index <= currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}

                <div
                  className={`flex items-center justify-center rounded-full h-8 w-8 
                    ${
                      isPastStep
                        ? 'bg-primary text-primary-foreground'
                        : isCurrentStep
                          ? 'border-2 border-primary text-primary'
                          : 'border-2 border-gray-200 text-gray-400'
                    }`}
                  title={STEPS_CONFIG[step].label}
                >
                  {isPastStep ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {currentMicroStep && microStepsWithLabels && (
          <div className='flex justify-center mt-1.5'>
            <div className='flex items-center space-x-2'>
              {microStepsWithLabels.map(({ name, label }, microIndex) => (
                <div key={name} className='flex flex-col items-center'>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      microIndex === activeMicroStepIndex
                        ? 'bg-primary'
                        : microIndex < activeMicroStepIndex
                          ? 'bg-primary/60'
                          : 'bg-gray-300'
                    }`}
                    title={label}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
