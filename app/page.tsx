import { LandingPage } from '@passport/components/home/landing';
import { getUser } from '@passport/user';

export default async function Home() {
  const user = await getUser();

  return user ? <>Welcome back!</> : <LandingPage />;
}
