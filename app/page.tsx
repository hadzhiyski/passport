import { auth0 } from '../lib/auth0';

export default async function Home() {
  const session = await auth0.getSession();

  return (
    <>
      <h1>Welcome to My Page</h1>

      {session ? (
        <div>
          <a href='/auth/logout'>Logout</a>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      ) : (
        <>
          <a href='/auth/login'>Login</a>
          <a href='/auth/login?screen_hint=signup'>Sign Up</a>
        </>
      )}
    </>
  );
}
