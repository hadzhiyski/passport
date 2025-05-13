import { PetHero } from '@passport/components/pets/details/layout';
import { PassportSkeleton } from '@passport/components/pets/details/loaders';
import { PassportSection } from '@passport/components/pets/details/sections';
import { Card, CardContent, CardHeader } from '@passport/components/ui/card';
import { db } from '@passport/database';
import { petsTable } from '@passport/database/schema/pets';
import { fetchPassport } from '@passport/passports/pet-details';
import { eq } from 'drizzle-orm';
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
    })
    .from(petsTable)
    .where(eq(petsTable.id, id));

  if (petSelect.length === 0) {
    return notFound();
  }
  const pet = petSelect[0];

  const passport = fetchPassport(id);

  return (
    <div className='container mx-auto px-4 py-4'>
      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='w-full lg:w-80 xl:w-96 flex-shrink-0'>
          <Card className='overflow-hidden shadow-lg border-border rounded-xl'>
            <CardHeader>
              <PetHero pet={pet} />
            </CardHeader>
            <CardContent>
              {pet.notes ? (
                <div className='text-sm mb-4'>
                  <div className='flex flex-col'>
                    <div className='flex items-center'>
                      <div className='flex items-center gap-2 text-card-foreground font-semibold'>
                        <span>Notes</span>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>{pet.notes}</p>
                  </div>
                </div>
              ) : null}

              <Suspense fallback={<PassportSkeleton />}>
                <PassportSection petId={id} query={passport} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div className='flex-1'>
          <Card className='overflow-hidden shadow-lg border-border rounded-xl'>
            <CardContent className='p-0'>
              <div className='p-4'>{page.children}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
