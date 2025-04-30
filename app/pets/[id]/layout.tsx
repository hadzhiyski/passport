import { PetCards } from '@passport/components/pets/details/pet-cards';
import { PetHero } from '@passport/components/pets/details/pet-hero';
import { Button } from '@passport/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@passport/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@passport/components/ui/collapsible';
import { Separator } from '@passport/components/ui/separator';
import { db } from '@passport/database';
import { petsTable } from '@passport/database/schema/pets';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ClipboardIcon,
  EditIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

          <Collapsible
            defaultOpen={Boolean(pet.notes)}
            className='bg-white rounded-xl p-6 border border-slate-200'
          >
            <CollapsibleTrigger className='w-full'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='bg-purple-100 text-purple-600 p-2 rounded-full'>
                    <ClipboardIcon className='h-5 w-5' />
                  </div>
                  <h3 className='font-medium text-slate-800'>Notes</h3>
                </div>
                <div className='text-slate-400'>
                  <ChevronDownIcon className='h-5 w-5 transition-transform duration-200 collapsible-icon' />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Separator className='mb-4' />
              <div className='prose prose-slate max-w-none'>
                <p className='text-slate-700 leading-relaxed whitespace-pre-line'>
                  {pet.notes || 'No notes available.'}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          {page.children}
        </CardContent>
        <CardFooter className='px-8 py-4 text-sm text-slate-500 border-t border-slate-100'>
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
