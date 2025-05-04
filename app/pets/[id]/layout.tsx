import {
  PetHero,
  PetSectionNav,
} from '@passport/components/pets/details/layout';
import { PassportSkeleton } from '@passport/components/pets/details/loaders';
import { PassportSection } from '@passport/components/pets/details/sections';
import { PassportEditButton } from '@passport/components/pets/details/ui';
import { Card, CardContent, CardFooter } from '@passport/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@passport/components/ui/collapsible';
import { db } from '@passport/database';
import { petsTable } from '@passport/database/schema/pets';
import { fetchPassport } from '@passport/passports/pet-details';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import {
  ArrowLeftIcon,
  BookIcon,
  ChevronDownIcon,
  ClipboardIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function PetDetailsLayout(page: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await page.params;
  const petSelect = await db
    .select({
      name: petsTable.name,
      dob: petsTable.dob,
      sex: petsTable.sex,
      species: petsTable.species,
      breed: petsTable.breed,
      colors: petsTable.colors,
      notes: petsTable.notes,
      updatedAt: petsTable.updatedAt,
    })
    .from(petsTable)
    .where(eq(petsTable.id, id));

  if (petSelect.length === 0) {
    return notFound();
  }
  const pet = petSelect[0];

  const passportSelect = fetchPassport(id);

  return (
    <div className='container mx-auto px-4 py-4'>
      <div className='flex justify-between items-center mb-6'>
        <Link
          href='/pets'
          className='text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors'
        >
          <ArrowLeftIcon className='h-4 w-4' />
          <span>Back to pets</span>
        </Link>
      </div>

      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='w-full lg:w-80 xl:w-96 flex-shrink-0'>
          <div className='space-y-6 sticky top-6'>
            <Card className='overflow-hidden shadow-lg border-border rounded-xl'>
              <PetHero pet={pet} />
            </Card>

            <Card className='overflow-hidden shadow-lg border-border rounded-xl'>
              <div className='bg-card border-border'>
                <div className='flex items-center justify-between p-4 border-b border-border'>
                  <div className='flex items-center gap-2'>
                    <div className='bg-primary/10 text-primary p-2 rounded-full'>
                      <BookIcon className='h-5 w-5' />
                    </div>
                    <h3 className='font-medium text-card-foreground'>
                      Passport Details
                    </h3>
                  </div>
                  <Suspense>
                    <PassportEditButton petId={id} />
                  </Suspense>
                </div>
                <div className='p-4'>
                  <Suspense fallback={<PassportSkeleton />}>
                    <PassportSection query={passportSelect} />
                  </Suspense>
                </div>
              </div>
            </Card>

            {pet.notes ? (
              <Card className='overflow-hidden shadow-lg border-border rounded-xl'>
                <Collapsible defaultOpen={true}>
                  <CollapsibleTrigger className='w-full'>
                    <div className='flex items-center justify-between p-4 border-b border-border'>
                      <div className='flex items-center gap-2'>
                        <div className='text-primary p-2 rounded-full'>
                          <ClipboardIcon className='h-5 w-5' />
                        </div>
                        <h3 className='font-medium text-foreground'>Notes</h3>
                      </div>
                      <div>
                        <ChevronDownIcon className='h-5 w-5 transition-transform duration-200 collapsible-icon' />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className='p-4'>
                      <div className='prose prose-slate max-w-none dark:prose-invert'>
                        <p className='leading-relaxed whitespace-pre-line text-foreground'>
                          {pet.notes}
                        </p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ) : null}
          </div>
        </div>

        <div className='flex-1'>
          <Card className='overflow-hidden shadow-lg border-border rounded-xl'>
            <CardContent className='p-0'>
              <div
                id='section-navigation'
                className='sticky top-0 px-4 py-3 bg-background/95 backdrop-blur-sm z-10 border-b border-border'
              >
                <PetSectionNav petId={id} />
              </div>

              <div className='p-4'>{page.children}</div>
            </CardContent>
            <CardFooter className='px-4 py-4 text-sm border-t border-border'>
              <div className='flex flex-col sm:flex-row sm:justify-between w-full gap-2'>
                <span className='text-muted-foreground'>
                  Last updated:{' '}
                  {pet.updatedAt
                    ? format(new Date(pet.updatedAt), 'MMMM d, yyyy')
                    : 'Unknown'}
                </span>
                <span className='text-muted-foreground'>Pet ID: {id}</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
