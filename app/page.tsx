import { auth0 } from '../lib/auth0';

export default async function Home() {
  const session = await auth0.getSession();

  return (
    <>
      <h1>Welcome to the App</h1>
      <p>{session ? 'You are logged in' : 'You are not logged in'}</p>
    </>
  );
}
