import { PassportLoadingSkeleton } from '@passport/components/pets/details/passport-loading';
import { PassportSection } from '@passport/components/pets/details/passport-section';
import { PetCards } from '@passport/components/pets/details/pet-cards';
import { PetHero } from '@passport/components/pets/details/pet-hero';
import { PetTabs } from '@passport/components/pets/details/pet-tabs';
import { Button } from '@passport/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@passport/components/ui/card';
import { Separator } from '@passport/components/ui/separator';
import { db } from '@passport/database';
import { petsTable } from '@passport/database/schema/pet';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import {
  ActivityIcon,
  ArrowLeftIcon,
  BookIcon,
  ClipboardIcon,
  EditIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function PetDetailsPage(page: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ vpage?: string }>;
}) {
  const { id } = await page.params;
  const { vpage } = await page.searchParams;
  const vaxPage = vpage ? parseInt(vpage) : 1;

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

  return (
    <div className='container max-w-4xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <Link
          href='/pets'
          className='text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors'
        >
          <ArrowLeftIcon className='h-4 w-4' />
          <span>Back to pets</span>
        </Link>

        <Button variant='outline' size='sm' className='flex items-center gap-1'>
          <EditIcon className='h-4 w-4' />
          <span>Edit Profile</span>
        </Button>
      </div>

      <Card className='overflow-hidden shadow-lg border-0 rounded-xl'>
        <CardHeader className='p-0'>
          <PetHero pet={pet} />
        </CardHeader>

        <CardContent className='p-6 lg:p-8 space-y-8'>
          <PetCards pet={pet} />

          {pet.notes && (
            <div className='bg-white rounded-xl p-6 border border-slate-200'>
              <div className='flex items-center gap-2 mb-3'>
                <div className='bg-purple-100 text-purple-600 p-2 rounded-full'>
                  <ClipboardIcon className='h-5 w-5' />
                </div>
                <h3 className='font-medium text-slate-800'>Notes</h3>
              </div>
              <Separator className='mb-4' />
              <div className='prose prose-slate max-w-none'>
                <p className='text-slate-700 leading-relaxed whitespace-pre-line'>
                  {pet.notes}
                </p>
              </div>
            </div>
          )}

          <div className='bg-white rounded-xl border border-slate-200 overflow-hidden'>
            <div className='flex items-center justify-between p-6 border-b border-slate-100'>
              <div className='flex items-center gap-2'>
                <div className='bg-blue-100 text-blue-600 p-2 rounded-full'>
                  <BookIcon className='h-5 w-5' />
                </div>
                <h3 className='font-medium text-slate-800'>Pet Passport</h3>
              </div>

              <Button
                variant='outline'
                size='sm'
                className='text-blue-600 border-blue-200'
              >
                View Details
              </Button>
            </div>

            <div className='p-6'>
              <Suspense fallback={<PassportLoadingSkeleton />}>
                <PassportSection petId={id} />
              </Suspense>
            </div>
          </div>

          <div className='bg-white rounded-xl border border-slate-200 overflow-hidden'>
            <div className='flex items-center justify-between p-6 border-b border-slate-100'>
              <div className='flex items-center gap-2'>
                <div className='bg-emerald-100 text-emerald-600 p-2 rounded-full'>
                  <ActivityIcon className='h-5 w-5' />
                </div>
                <h3 className='font-medium text-slate-800'>Health Records</h3>
              </div>

              <Button
                variant='outline'
                size='sm'
                className='text-emerald-600 border-emerald-200'
              >
                Add Record
              </Button>
            </div>

            <PetTabs id={id} vaxPage={vaxPage} />
          </div>
        </CardContent>

        <CardFooter className='bg-slate-50 px-8 py-4 text-sm text-slate-500 border-t border-slate-100'>
          <div className='flex flex-col sm:flex-row sm:justify-between w-full gap-2'>
            <span>
              Last updated:{' '}
              {pet.updatedAt
                ? format(new Date(pet.updatedAt), 'MMMM d, yyyy')
                : 'Unknown'}
            </span>
            <span className='text-slate-400'>Pet ID: {id}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
