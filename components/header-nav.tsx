import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@passport/components/ui/navigation-menu';
import { db } from '@passport/database';
import { ownersTable } from '@passport/database/schema/owners';
import { passportsTable } from '@passport/database/schema/passports';
import { petsTable } from '@passport/database/schema/pets';
import { cn } from '@passport/lib/utils';
import { eq, or } from 'drizzle-orm';
import { PawPrint } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import AuthButtons from './auth/auth-buttons';
import { MobileNavSheet } from './mobile-nav-sheet';
import { NavUser } from './nav-user';
import { PetQuickNavLinks } from './pet-quick-nav-links';
import { Separator } from './ui/separator';

export async function HeaderNav() {
  const { getUser } = await import('@passport/user');
  const user = await getUser();

  const pets = user
    ? await db
        .select({
          id: petsTable.id,
          name: petsTable.name,
          species: petsTable.species,
        })
        .from(petsTable)
        .innerJoin(passportsTable, eq(petsTable.id, passportsTable.petId))
        .leftJoin(
          ownersTable,
          or(
            eq(ownersTable.id, passportsTable.owner1Id),
            eq(ownersTable.id, passportsTable.owner2Id),
          ),
        )
        .where(eq(ownersTable.externalId, user.id))
    : [];

  return (
    <div className={'flex w-full items-center justify-between'}>
      <div className='flex items-center gap-2'>
        <Link href='/' className='flex items-center gap-2'>
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
            <PawPrint size={16} />
          </div>
          <span className='font-semibold'>Passport</span>
        </Link>

        {user ? (
          <>
            <div className='hidden md:flex items-center ml-4'>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Pets</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className='p-4 md:w-[400px] lg:w-[500px]'>
                        <div className='grid gap-3 md:grid-cols-2'>
                          <div>
                            <Link
                              href='/pets'
                              className={cn(
                                'flex h-32 w-full select-none flex-col justify-between rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md',
                              )}
                            >
                              <div className='text-sm font-medium'>
                                All Pets
                              </div>
                              <p className='text-xs leading-tight text-muted-foreground'>
                                View and manage all your pets in one place
                              </p>
                            </Link>
                          </div>
                          <div>
                            <Link
                              href='/pets/add'
                              className={cn(
                                'flex h-32 w-full select-none flex-col justify-between rounded-md bg-gradient-to-b from-muted/10 to-background p-4 no-underline outline-none focus:shadow-md hover:bg-accent/10 border border-border/40 transition-colors',
                              )}
                            >
                              <div className='text-sm font-medium'>Add Pet</div>
                              <p className='text-xs leading-tight text-muted-foreground'>
                                Register a new pet
                              </p>
                            </Link>
                          </div>
                        </div>

                        <Separator className='my-4' />

                        <div>
                          <div className='flex flex-col'>
                            <span className='text-xs font-medium mb-2 text-muted-foreground'>
                              My Pets
                            </span>
                            <Suspense
                              fallback={
                                <div className='text-xs text-muted-foreground'>
                                  Loading pets...
                                </div>
                              }
                            >
                              <PetQuickNavLinks pets={pets} />
                            </Suspense>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className='md:hidden ml-2'>
              <MobileNavSheet pets={pets} />
            </div>
          </>
        ) : null}
      </div>

      <div className='flex items-center gap-2'>
        <div className='flex items-center'>
          {user ? <NavUser user={user} /> : <AuthButtons />}
        </div>
      </div>
    </div>
  );
}
