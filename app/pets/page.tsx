import { Avatar, AvatarFallback } from '@passport/components/ui/avatar';
import { Button } from '@passport/components/ui/button';
import { Card, CardContent } from '@passport/components/ui/card';
import { db } from '@passport/database';
import { ownersTable } from '@passport/database/schema/owners';
import { passportsTable } from '@passport/database/schema/passports';
import { petsTable } from '@passport/database/schema/pets';
import { getSpeciesColor } from '@passport/lib/pet/utils';
import { getUser } from '@passport/user';
import { eq, or } from 'drizzle-orm';
import { Mars, PawPrintIcon, PlusCircleIcon, Venus } from 'lucide-react';
import Link from 'next/link';

export default async function PetIndexPage() {
  const user = await getUser();
  if (!user) {
    return (
      <div className='container py-16 flex flex-col items-center'>
        <h1 className='text-2xl font-bold text-foreground'>
          Please log in to view your pets.
        </h1>
      </div>
    );
  }

  const pets = await db
    .select({
      id: petsTable.id,
      name: petsTable.name,
      species: petsTable.species,
      breed: petsTable.breed,
      sex: petsTable.sex,
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
    .then((pets) =>
      pets.map((pet) => ({
        ...pet,
        avatar: {
          color: getSpeciesColor(pet.species),
          inititals: pet.name.substring(0, 2).toUpperCase(),
        },
      })),
    );

  return (
    <div className='container max-w-4xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-foreground'>My Pets</h1>
        <Button asChild>
          <Link href='/pets/add'>
            <PlusCircleIcon className='h-5 w-5 mr-2' />
            Add Pet
          </Link>
        </Button>
      </div>

      {pets.length === 0 ? (
        <div className='rounded-xl border border-border p-8 text-center'>
          <div className='bg-primary/10 text-primary p-3 rounded-full w-fit mx-auto mb-4'>
            <PawPrintIcon className='h-6 w-6' />
          </div>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            No pets found
          </h2>
          <p className='text-muted-foreground mb-6'>
            You haven&apos;t added any pets to your account yet.
          </p>
          <Button asChild>
            <Link href='/pets/add'>
              <PlusCircleIcon className='h-5 w-5 mr-2' />
              Add Your First Pet
            </Link>
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {pets.map((pet) => (
            <Link
              href={`/pets/${pet.id}`}
              key={pet.id}
              className='transition-transform hover:scale-[1.02]'
            >
              <Card className='h-full border-border overflow-hidden hover:shadow-md transition-shadow'>
                <CardContent>
                  <div className='flex items-center gap-4 pt-6'>
                    <Avatar className={`h-12 w-12 ${pet.avatar.color}`}>
                      <AvatarFallback className='text-white font-medium'>
                        {pet.avatar.inititals}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-semibold text-foreground'>
                          {pet.name}
                        </h2>
                        {pet.sex && (
                          <div
                            className={`rounded-full p-1.5 ${
                              pet.sex === 'male'
                                ? 'bg-primary/10 text-primary'
                                : pet.sex === 'female'
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {pet.sex === 'male' ? (
                              <Mars size={14} />
                            ) : pet.sex === 'female' ? (
                              <Venus size={14} />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <p className='text-muted-foreground text-sm'>
                        {pet.breed || pet.species}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
