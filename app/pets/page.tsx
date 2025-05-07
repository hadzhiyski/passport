import { PetCardSkeleton } from '@passport/components/pets/index/loaders/pet-card-skeleton';
import { PetsGrid } from '@passport/components/pets/index/pets-grid';
import { FilterOptions } from '@passport/components/pets/index/ui/filter-options';
import { SortOptions } from '@passport/components/pets/index/ui/sort-options';
import { SearchInput } from '@passport/components/search-input';
import { Button } from '@passport/components/ui/button';
import { getOnboardingUser } from '@passport/user';
import { CircleX, PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function PetsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getOnboardingUser();

  // If no user is logged in, redirect to login
  if (!user) {
    redirect('/auth/login');
  }

  // If user hasn't completed onboarding, redirect to the onboarding flow
  if (!user.onboarding.completed) {
    redirect('/onboarding');
  }

  const resolvedParams = await searchParams;
  const sortBy =
    typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'name';
  const filterStatus =
    typeof resolvedParams.status === 'string' ? resolvedParams.status : 'all';
  const filterSpecies =
    typeof resolvedParams.species === 'string' ? resolvedParams.species : 'all';
  const searchQuery =
    typeof resolvedParams.q === 'string' ? resolvedParams.q : '';

  const pageQuery = {
    sort: sortBy,
    status: filterStatus,
    species: filterSpecies,
    q: searchQuery,
  };

  return (
    <div className='container max-w-5xl mx-auto px-4 py-8'>
      <div className='flex flex-col gap-6 mb-8'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <h1 className='text-2xl font-bold text-foreground'>My Pets</h1>
          <Button asChild>
            <Link href='/pets/add'>
              <PlusCircleIcon className='h-5 w-5 mr-2' />
              Add Pet
            </Link>
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <SearchInput
            placeholder='Search by pet name or breed...'
            defaultValue={searchQuery}
            delay={400}
          />
          <div className='flex gap-2 self-end sm:self-auto'>
            <FilterOptions
              status={filterStatus}
              species={filterSpecies}
              pageQuery={pageQuery}
            />
            <SortOptions sort={sortBy} pageQuery={pageQuery} />

            <Button
              variant='outline'
              size='sm'
              asChild
              className='gap-1'
              disabled={
                filterStatus === 'all' &&
                filterSpecies === 'all' &&
                sortBy === 'name' &&
                !searchQuery
              }
            >
              <Link href='/pets'>
                <CircleX className='h-4 w-4 mr-1' />
                Clear
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Suspense fallback={<PetCardSkeleton />}>
        <PetsGrid
          sortBy={sortBy}
          filterStatus={filterStatus}
          filterSpecies={filterSpecies}
          searchQuery={searchQuery}
        />
      </Suspense>
    </div>
  );
}
