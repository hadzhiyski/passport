import { Avatar, AvatarFallback } from '@passport/components/ui/avatar';
import { Badge } from '@passport/components/ui/badge';
import { getInitials } from '@passport/lib/pet/initials';
import { getSpeciesColor } from '@passport/lib/pet/utils';
import { getHumanReadeableAge } from '@passport/lib/utils';
import { format } from 'date-fns';
import {
  CalendarIcon,
  MarsIcon,
  PaletteIcon,
  PawPrintIcon,
  VenusIcon,
} from 'lucide-react';

export interface PetHeroProps {
  pet: {
    name: string;
    species: string;
    breed?: string;
    sex?: string;
    colors?: string[];
    dob: string;
  };
}

export function PetHero({ pet }: PetHeroProps) {
  const petAge = getHumanReadeableAge(pet.dob);

  return (
    <div className='p-4 bg-card'>
      <div className='flex flex-col md:flex-row items-center md:items-start gap-5'>
        <Avatar
          className={`h-24 w-24 ring-4 ring-primary/20 ${getSpeciesColor(pet.species)}`}
        >
          <AvatarFallback className='text-2xl font-bold text-white'>
            {getInitials(pet.name)}
          </AvatarFallback>
        </Avatar>

        <div className='text-center md:text-left flex-1'>
          <div className='mb-2'>
            <h1 className='text-3xl font-bold text-card-foreground'>
              {pet.name}
            </h1>
            {pet.breed && (
              <p className='text-sm mt-1 text-muted-foreground capitalize'>
                {pet.breed}
              </p>
            )}
          </div>

          <div className='flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-2 mt-3'>
            <Badge
              variant='outline'
              className='px-2.5 py-0.5 border-primary/20 text-primary'
            >
              <PawPrintIcon className='h-3.5 w-3.5 mr-1.5' />
              <span className='capitalize'>{pet.species}</span>
            </Badge>

            {pet.sex && (
              <Badge
                variant='outline'
                className='px-2.5 py-0.5 border-primary/20 text-primary'
              >
                {pet.sex.toLowerCase() === 'male' ? (
                  <MarsIcon className='h-3.5 w-3.5 mr-1.5' />
                ) : (
                  <VenusIcon className='h-3.5 w-3.5 mr-1.5' />
                )}
                <span className='capitalize'>{pet.sex}</span>
              </Badge>
            )}

            {pet.dob && (
              <Badge
                variant='outline'
                className='px-2.5 py-0.5 border-primary/20 text-primary'
                title={pet.dob ? format(new Date(pet.dob), 'MMMM d, yyyy') : ''}
              >
                <CalendarIcon className='h-3.5 w-3.5 mr-1.5' />
                {petAge} old
              </Badge>
            )}
          </div>

          {pet.colors && pet.colors.length > 0 && (
            <div className='mt-4'>
              <div className='flex items-center gap-1.5 mb-2 text-sm text-muted-foreground'>
                <PaletteIcon className='h-4 w-4' />
                <span>Coat Colors</span>
              </div>
              <div className='flex flex-wrap gap-1.5'>
                {pet.colors.map((color, i) => (
                  <Badge
                    key={i}
                    variant='outline'
                    className='capitalize text-xs font-medium px-2.5 py-0.5 border-primary/20 text-primary'
                  >
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
