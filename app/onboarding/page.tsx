import { getOnboardingUser } from '@passport/user';
import { redirect } from 'next/navigation';
import { OnboardingFlow } from './onboarding-flow';

export default async function OnboardingPage() {
  const user = await getOnboardingUser();

  // If no user is logged in, redirect to login
  if (!user) {
    redirect('/auth/login');
  }

  // If onboarding is already complete, redirect to main app
  if (user.onboarding.completed) {
    redirect('/pets');
  }

  return (
    <div className='container max-w-5xl mx-auto px-4 py-8'>
      <OnboardingFlow user={user} currentStep={user.onboarding.currentStep} />
    </div>
  );
}
