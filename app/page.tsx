import { getUser } from '@passport/app/actions/auth';
import Link from 'next/link';

// Force dynamic rendering and no caching for this page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Home() {
  const user = await getUser();

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>
                Passport App
              </h1>
            </div>
            <div className='flex items-center space-x-4'>
              {user ? (
                <Link
                  href='/dashboard'
                  className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium'
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href='/login'
                    className='text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Sign in
                  </Link>
                  <Link
                    href='/signup'
                    className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium'
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-6'>
            Welcome to Passport App
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            Your secure digital companion for seamless access
          </p>

          {user ? (
            <div className='bg-white rounded-lg shadow-md p-6 max-w-md mx-auto'>
              <h2 className='text-2xl font-bold text-green-600 mb-4'>
                You&apos;re logged in!
              </h2>
              <p className='text-gray-600 mb-4'>
                Welcome back,{' '}
                {user.user_metadata?.display_name ||
                  user.user_metadata?.full_name ||
                  user.email}
                !
              </p>
              <Link
                href='/dashboard'
                className='inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium'
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className='bg-white rounded-lg shadow-md p-6 max-w-md mx-auto'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Get Started
              </h2>
              <p className='text-gray-600 mb-6'>
                Join us today and get access to your personal dashboard
              </p>
              <div className='space-y-3'>
                <Link
                  href='/signup'
                  className='block w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium text-center'
                >
                  Create Account
                </Link>
                <Link
                  href='/login'
                  className='block w-full border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-md font-medium text-center'
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
