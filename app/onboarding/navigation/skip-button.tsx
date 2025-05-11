import { Button } from '@passport/components/ui/button';
import { OnboardingStep, STEPS_CONFIG } from '@passport/onboarding';
import { ArrowRight, Loader2 } from 'lucide-react';

export interface SkipButtonProps {
  currentStep: OnboardingStep;
  currentMicroStep: string | null;
  onClick: () => void;
  isUpdating: boolean;
}

export function SkipButton({
  currentStep,
  currentMicroStep,
  onClick,
  isUpdating,
}: SkipButtonProps) {
  const canSkipCurrentStep =
    STEPS_CONFIG[currentStep]?.canSkip ||
    (currentMicroStep &&
      STEPS_CONFIG[currentStep].microSteps &&
      STEPS_CONFIG[currentStep].microSteps[currentMicroStep]?.canSkip) ||
    false;
  return canSkipCurrentStep ? (
    <Button
      onClick={onClick}
      disabled={isUpdating}
      variant='ghost'
      className='gap-2'
    >
      {isUpdating ? (
        <>
          <Loader2 className='h-4 w-4 animate-spin' />
          Processing...
        </>
      ) : (
        <>
          I&apos;ll do this later
          <ArrowRight className='h-4 w-4' />
        </>
      )}
    </Button>
  ) : null;
}
