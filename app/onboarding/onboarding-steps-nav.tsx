'use client';

import {
  ONBOARDING_STEPS_ORDER,
  OnboardingStep,
  STEPS_CONFIG,
} from '@passport/onboarding';
import { useMicroSteps } from '@passport/onboarding/micro-steps';
import { CheckCircle } from 'lucide-react';

interface OnboardingStepsNavProps {
  currentStep: OnboardingStep;
}

export function OnboardingStepsNav({ currentStep }: OnboardingStepsNavProps) {
  const { current, index, all } = useMicroSteps();
  const currentStepIndex = ONBOARDING_STEPS_ORDER.indexOf(currentStep);

  return (
    <div className='flex justify-end mb-6'>
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

        {current && (
          <div className='flex justify-center mt-1.5'>
            <div className='flex items-center space-x-2'>
              {(all || []).map((microStep, microIndex) => (
                <div key={microStep} className='flex flex-col items-center'>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      microIndex === index
                        ? 'bg-primary'
                        : microIndex < index
                          ? 'bg-primary/60'
                          : 'bg-gray-300'
                    }`}
                    title={STEPS_CONFIG[currentStep].microSteps?.[microStep]}
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
