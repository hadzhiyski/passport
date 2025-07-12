import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Oops! Something went wrong
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            We couldn&apos;t verify your account. The confirmation link might
            have expired or already been used.
          </p>
          <div className='mt-6'>
            <Link
              href='/login'
              className='font-medium text-indigo-600 hover:text-indigo-500'
            >
              Try signing in again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
