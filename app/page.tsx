import { getUser } from '@passport/app/actions/auth';
import { Button } from '@passport/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@passport/components/ui/card';
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
                <Button asChild>
                  <Link href='/dashboard'>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant='ghost'>
                    <Link href='/login'>Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link href='/signup'>Sign up</Link>
                  </Button>
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
            <Card className='max-w-md mx-auto'>
              <CardHeader>
                <CardTitle className='text-green-600'>
                  You&apos;re logged in!
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-muted-foreground'>
                  Welcome back,{' '}
                  {user.user_metadata?.display_name ||
                    user.user_metadata?.full_name ||
                    user.email}
                  !
                </p>
                <Button asChild size='lg'>
                  <Link href='/dashboard'>Go to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className='max-w-md mx-auto'>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-muted-foreground'>
                  Join us today and get access to your personal dashboard
                </p>
                <div className='space-y-3'>
                  <Button asChild size='lg' className='w-full'>
                    <Link href='/signup'>Create Account</Link>
                  </Button>
                  <Button
                    asChild
                    variant='outline'
                    size='lg'
                    className='w-full'
                  >
                    <Link href='/login'>Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
