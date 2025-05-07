import { LandingPage } from '@passport/components/home/landing';
import { getOnboardingUser } from '@passport/user';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const user = await getOnboardingUser();

  if (user) {
    // If the user hasn't completed onboarding, redirect to the onboarding flow
    if (!user.onboarding.completed) {
      redirect('/onboarding');
    }
    // Otherwise, redirect to the pets page as before
    redirect('/pets');
  }

  return <LandingPage />;
}
