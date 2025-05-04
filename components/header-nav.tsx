import { getUser } from '@passport/user';
import { PawPrint } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import AuthButtons from './auth/auth-buttons';
import { NavUser } from './nav-user';
import { PetsNav } from './pets-nav';
import { Separator } from './ui/separator';

export async function HeaderNav() {
  const user = await getUser();

  return (
    <div className={'flex w-full items-center justify-between'}>
      <div className='flex items-center gap-2'>
        <Link href='/' className='flex items-center gap-2'>
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
            <PawPrint size={16} />
          </div>
          <span className='font-semibold'>Passport</span>
        </Link>
      </div>

      <div className='flex items-center gap-2 h-10'>
        {user && (
          <div className='flex items-center'>
            <Suspense fallback={<div>Loading...</div>}>
              <PetsNav ownerId={user.id} />
            </Suspense>
          </div>
        )}
        <Separator orientation='vertical' className='ml-4' />
        <div className='flex items-center'>
          {user ? <NavUser user={user} /> : <AuthButtons />}
        </div>
      </div>
    </div>
  );
}
