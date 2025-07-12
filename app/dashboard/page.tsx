import { getUser, signOut } from '@passport/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>Dashboard</h1>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-700'>
                Welcome,{' '}
                {user.user_metadata?.display_name ||
                  user.user_metadata?.full_name ||
                  user.email}
              </span>
              <form action={signOut}>
                <button
                  type='submit'
                  className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium'
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center'>
            <div className='text-center'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Welcome to your Dashboard!
              </h2>
              <p className='text-gray-600'>
                Great to see you again! Everything is ready for you.
              </p>
              <div className='mt-6 p-4 bg-gray-100 rounded-md'>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Your Profile
                </h3>
                <p className='text-sm text-gray-600'>
                  Name:{' '}
                  {user.user_metadata?.display_name ||
                    user.user_metadata?.full_name ||
                    'Not set'}
                </p>
                <p className='text-sm text-gray-600'>Email: {user.email}</p>
                <p className='text-sm text-gray-600'>
                  Member since: {new Date(user.created_at).toLocaleDateString()}
                </p>
                <p className='text-sm text-gray-600'>
                  Account verified:{' '}
                  {user.email_confirmed_at ? '✅ Yes' : '⏳ Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
