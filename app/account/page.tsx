import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@passport/components/ui/avatar';
import { Button } from '@passport/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@passport/components/ui/card';
import { Separator } from '@passport/components/ui/separator';
import { auth0 } from '@passport/lib/auth0';
import { LogOut, UserIcon } from 'lucide-react';
import Link from 'next/link';

export default async function AccountPage() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div className='container py-16 flex flex-col items-center'>
        <Card className='max-w-md w-full'>
          <CardContent className='py-12 text-center space-y-4'>
            <UserIcon className='h-12 w-12 mx-auto text-slate-300' />
            <h1 className='text-2xl font-bold'>Account Access</h1>
            <p className='text-muted-foreground'>
              Please log in to view your account information.
            </p>
            <Button asChild className='mt-4'>
              <a href='/auth/login'>Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
    : user.nickname?.substring(0, 2) || '??';

  return (
    <div className='container max-w-4xl mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
        <h1 className='text-3xl font-bold'>Account</h1>
        <Button
          asChild
          variant='outline'
          className='text-red-600 border-red-200 mt-4 md:mt-0'
        >
          <Link href='/auth/logout'>
            <LogOut className='h-4 w-4 mr-2' />
            Log Out
          </Link>
        </Button>
      </div>

      <Card className='overflow-hidden shadow-lg border-0 rounded-xl mb-6'>
        <CardHeader className='p-6 flex justify-between items-center border-b'>
          <div className='flex gap-4 items-center'>
            <Avatar className='h-16 w-16 rounded-xl border-2 shadow-sm'>
              <AvatarImage
                src={user.picture}
                alt={user.name || user.nickname}
              />
              <AvatarFallback className='text-lg bg-primary text-primary-foreground'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className='text-2xl font-semibold'>{user.name}</h2>
              <p className='text-muted-foreground'>{user.email}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-6'>
          <div className='space-y-6'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 text-primary p-2 rounded-full'>
                <UserIcon className='h-5 w-5' />
              </div>
              <h3 className='text-lg font-medium'>Personal Information</h3>
            </div>

            <Separator />

            <div className='bg-card rounded-xl p-6 border'>
              <div className='space-y-6'>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Full Name
                  </p>
                  <p className='font-medium text-lg'>{user.name}</p>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Email Address
                  </p>
                  <div className='flex items-center gap-2'>
                    <p className='font-medium text-lg'>{user.email}</p>
                    {user.email_verified && (
                      <span className='bg-emerald-50 text-emerald-600 text-xs px-2 py-0.5 rounded-full border border-emerald-100 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-800'>
                        verified
                      </span>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Given Name
                    </p>
                    <p className='font-medium'>
                      {user.given_name || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Family Name
                    </p>
                    <p className='font-medium'>
                      {user.family_name || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground mb-1'>Nickname</p>
                  <p className='font-medium'>
                    {user.nickname || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className='px-6 py-4 text-sm text-muted-foreground border-t'>
          <p>Contact support for more account management options</p>
        </CardFooter>
      </Card>
    </div>
  );
}
