import { LandingPage } from '@passport/components/home/landing';
import { getUser } from '@passport/user';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const user = await getUser();

  if (user) {
    redirect('/pets');
  }

  return <LandingPage />;
}
