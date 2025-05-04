import { db } from '@passport/database';
import { ownersTable } from '@passport/database/schema/owners';
import { passportsTable } from '@passport/database/schema/passports';
import { petsTable } from '@passport/database/schema/pets';
import { getInitials } from '@passport/lib/pet/initials';
import { eq, or } from 'drizzle-orm';
import PetNavItem from './pets-nav-item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ListFilter, MoreHorizontal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import Link from 'next/link';

export interface PetsNavProps {
  ownerId: string;
}

const MAX_VISIBLE_PETS = 3;

export async function PetsNav({ ownerId }: PetsNavProps) {
  const pets = await db
    .select({
      id: petsTable.id,
      name: petsTable.name,
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
    .where(eq(ownersTable.externalId, ownerId));

  if (pets.length === 0) return null;

  const visiblePets = pets.slice(0, MAX_VISIBLE_PETS);
  const additionalPets =
    pets.length > MAX_VISIBLE_PETS ? pets.slice(MAX_VISIBLE_PETS) : [];
  const totalPets = pets.length;

  return (
    <nav className='flex items-center space-x-3' aria-label='Pets navigation'>
      {visiblePets.map((pet) => (
        <PetNavItem key={pet.id} pet={pet} />
      ))}

      {additionalPets.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className='cursor-pointer hover:opacity-80'>
                    <AvatarFallback className='bg-muted'>
                      <MoreHorizontal size={16} />
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <span>
                    {additionalPets.length} more{' '}
                    {additionalPets.length === 1 ? 'pet' : 'pets'}
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='max-h-60 overflow-y-auto'>
            {additionalPets.map((pet) => (
              <DropdownMenuItem key={pet.id} asChild>
                <Link
                  href={`/pets/${pet.id}`}
                  className='flex items-center gap-2'
                >
                  <Avatar className='h-6 w-6'>
                    <AvatarFallback className='text-xs'>
                      {getInitials(pet.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{pet.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}

            <DropdownMenuItem className='mt-1 border-t pt-1' asChild>
              <Link
                href='/pets'
                className='flex items-center gap-2 text-sm text-muted-foreground'
              >
                <ListFilter size={14} />
                <span>View All Pets ({totalPets})</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href='/pets'>
              <Avatar className='cursor-pointer hover:opacity-80'>
                <AvatarFallback className='bg-muted'>
                  <ListFilter size={16} />
                </AvatarFallback>
              </Avatar>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <span>View All Pets</span>
          </TooltipContent>
        </Tooltip>
      )}
    </nav>
  );
}
