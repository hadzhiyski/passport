'use client';

import { Button } from '@passport/components/ui/button';
import { useOnboardingDataStore } from '@passport/onboarding/onboarding-data-store';
import { formatPetNameForDisplay } from '@passport/onboarding/utils';
import { User } from '@passport/user';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface CompleteStepProps {
  user: User;
  onComplete: () => void;
  isUpdating?: boolean;
}

export function CompleteStep({
  user,
  onComplete,
  isUpdating = false,
}: CompleteStepProps) {
  // Get the pet's name from the onboarding data store
  const { petData } = useOnboardingDataStore();

  // Format pet name for display using utility function
  const petName = formatPetNameForDisplay(petData.name);

  return (
    <div className='space-y-6 text-center'>
      <div className='flex justify-center'>
        <div className='flex items-center justify-center h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-900'>
          <CheckCircle className='h-12 w-12 text-emerald-600 dark:text-emerald-400' />
        </div>
      </div>

      <div className='space-y-2'>
        <h2 className='text-2xl font-bold'>
          You&apos;re all set, {user.name.split(' ')[0]}!
        </h2>
        <p className='text-muted-foreground'>
          Your Passport account is ready to use. You can now start managing your
          pets&apos; health records.
        </p>
      </div>

      <div className='bg-slate-50 dark:bg-slate-900 rounded-lg p-5 space-y-4 text-left max-w-lg mx-auto'>
        <h3 className='text-lg font-medium'>What&apos;s next?</h3>

        <ul className='list-disc pl-5 space-y-3'>
          <li>
            <span className='font-medium'>Add pet medical records</span> -
            Upload vaccination information and health records
          </li>
          <li>
            <span className='font-medium'>Record treatments</span> - Track
            parasitic treatments and medications
          </li>
          <li>
            <span className='font-medium'>Log veterinary visits</span> - Keep a
            record of clinical examinations
          </li>
          <li>
            <span className='font-medium'>Set reminders</span> - Never miss a
            vaccination or treatment date
          </li>
        </ul>
      </div>

      <div className='pt-6'>
        <Button
          onClick={onComplete}
          size='lg'
          className='gap-2'
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Redirecting...
            </>
          ) : (
            <>
              Explore {petName}&apos;s Digital Passport
              <ArrowRight className='h-4 w-4' />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
