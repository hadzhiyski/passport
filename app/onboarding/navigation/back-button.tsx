import { Button } from '@passport/components/ui/button';
import { OnboardingStep } from '@passport/onboarding';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface BackButtonProps {
  currentStep: OnboardingStep;
  isUpdating: boolean;
  onNavigateBack: () => void;
}

/**
 * Back navigation button for the onboarding flow
 * Allows users to navigate to previous step or micro step
 */
export function BackButton({
  currentStep,
  isUpdating,
  onNavigateBack,
}: BackButtonProps) {
  const showBackButton = currentStep !== 'welcome';

  if (!showBackButton) return null;

  return (
    <Button
      onClick={onNavigateBack}
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
          <ArrowLeft className='h-4 w-4' />
          Go Back
        </>
      )}
    </Button>
  );
}
