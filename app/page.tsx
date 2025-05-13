import { LandingPage } from '@passport/components/home/landing';
import { getOnboardingUser } from '@passport/user';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const user = await getOnboardingUser();

  if (user) {
    if (!user.onboarding.completed) {
      redirect('/onboarding');
    }
    redirect('/pets');
  }

  return <LandingPage />;
}
