import { colorToHex } from '@passport/lib/pet/utils';
import { getHumanReadeableAge } from '@passport/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, MarsIcon, PaletteIcon, VenusIcon } from 'lucide-react';

export interface PetCardsProps {
  pet: {
    dob: string | null;
    sex: string | null;
    colors?: string[];
  };
}

export function PetCards({ pet }: PetCardsProps) {
  const petAge = getHumanReadeableAge(pet.dob);
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      <div className='rounded-xl p-5 border border-border bg-card/50 shadow-sm'>
        <div className='flex items-center gap-2 mb-1'>
          <div className='bg-primary/10 text-primary p-2 rounded-full'>
            <CalendarIcon className='h-5 w-5' />
          </div>
          <h3 className='font-medium text-card-foreground'>Birth Date</h3>
        </div>
        <div className='mt-3 text-card-foreground font-medium'>
          {pet.dob ? format(new Date(pet.dob), 'MMMM d, yyyy') : 'Unknown'}
        </div>
        {pet.dob && (
          <div className='mt-1 text-sm text-muted-foreground'>{petAge} old</div>
        )}
      </div>

      <div className='rounded-xl p-5 border border-border bg-card/50 shadow-sm'>
        <div className='flex items-center gap-2 mb-1'>
          <div className='bg-primary/10 text-primary p-2 rounded-full'>
            {pet.sex === 'male' ? <MarsIcon className='h-5 w-5' /> : null}
            {pet.sex === 'female' ? <VenusIcon className='h-5 w-5' /> : null}
          </div>
          <h3 className='font-medium text-card-foreground'>Sex</h3>
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <span className='text-card-foreground font-medium capitalize'>
            {pet.sex}
          </span>
        </div>
      </div>

      <div className='rounded-xl p-5 border border-border bg-card/50 shadow-sm'>
        <div className='flex items-center gap-2 mb-1'>
          <div className='bg-primary/10 text-primary p-2 rounded-full'>
            <PaletteIcon className='h-5 w-5' />
          </div>
          <h3 className='font-medium text-card-foreground'>Colors</h3>
        </div>
        <div className='mt-3'>
          <div className='flex flex-wrap gap-2'>
            {pet.colors?.map((color, i) => (
              <div
                key={i}
                className='flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/50'
              >
                <div
                  className='h-4 w-4 rounded-full ring-1 ring-border'
                  style={{ backgroundColor: colorToHex(color) }}
                />
                <span className='text-sm font-medium text-card-foreground capitalize'>
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
