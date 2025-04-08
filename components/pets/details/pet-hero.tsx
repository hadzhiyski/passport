import { Avatar, AvatarFallback } from '@passport/components/ui/avatar';
import { Badge } from '@passport/components/ui/badge';
import { getSpeciesColor } from '@passport/lib/pet/utils';
import { MarsIcon, PawPrintIcon, VenusIcon } from 'lucide-react';

export interface PetHeroProps {
  pet: {
    name: string;
    species: string;
    breed?: string;
    sex?: string;
    colors?: string[];
  };
}

export function PetHero({ pet }: PetHeroProps) {
  return (
    <div className='relative'>
      <div className='absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-700/90 mix-blend-multiply' />

      <div className='relative px-8 py-10 text-white'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
          <Avatar
            className={`h-28 w-28 rounded-full ring-4 ring-white/30 ${getSpeciesColor(pet.species)}`}
          >
            <AvatarFallback className='text-3xl font-bold text-white'>
              {pet.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className='text-center md:text-left flex-1'>
            <h1 className='text-4xl font-bold'>{pet.name}</h1>
            <div className='flex flex-wrap justify-center md:justify-start items-center gap-2 mt-2'>
              <Badge
                variant='outline'
                className='text-white border-white/30 /10 px-3 py-1 text-sm'
              >
                <PawPrintIcon className='h-3.5 w-3.5 mr-1 opacity-80' />
                {pet.species}
              </Badge>
              {pet.breed && (
                <Badge
                  variant='outline'
                  className='text-white border-white/30 /10 px-3 py-1 text-sm'
                >
                  {pet.breed}
                </Badge>
              )}

              <Badge
                variant='outline'
                className='text-white border-white/30 /10 px-3 py-1 text-sm'
              >
                {pet.sex?.toLowerCase() === 'male' ? (
                  <MarsIcon className='h-3.5 w-3.5 mr-1 opacity-80' />
                ) : pet.sex?.toLowerCase() === 'female' ? (
                  <VenusIcon className='h-3.5 w-3.5 mr-1 opacity-80' />
                ) : null}
                {pet.sex || 'Unknown'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
