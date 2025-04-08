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
      <div className='bg-slate-50 rounded-xl p-5 border border-slate-100'>
        <div className='flex items-center gap-2 mb-1'>
          <div className='bg-blue-100 text-blue-600 p-2 rounded-full'>
            <CalendarIcon className='h-5 w-5' />
          </div>
          <h3 className='font-medium text-slate-700'>Birth Date</h3>
        </div>
        <div className='mt-3 text-slate-900 font-medium'>
          {pet.dob ? format(new Date(pet.dob), 'MMMM d, yyyy') : 'Unknown'}
        </div>
        {pet.dob && (
          <div className='mt-1 text-sm text-slate-500'>{petAge} old</div>
        )}
      </div>

      <div className='bg-slate-50 rounded-xl p-5 border border-slate-100'>
        <div className='flex items-center gap-2 mb-1'>
          <div className='bg-pink-100 text-pink-600 p-2 rounded-full'>
            {pet.sex === 'male' ? <MarsIcon className='h-5 w-5' /> : null}
            {pet.sex === 'female' ? <VenusIcon className='h-5 w-5' /> : null}
          </div>
          <h3 className='font-medium text-slate-700'>Sex</h3>
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <span className='text-slate-900 font-medium capitalize'>
            {pet.sex}
          </span>
        </div>
      </div>

      <div className='bg-slate-50 rounded-xl p-5 border border-slate-100'>
        <div className='flex items-center gap-2 mb-1'>
          <div className='bg-purple-100 text-purple-600 p-2 rounded-full'>
            <PaletteIcon className='h-5 w-5' />
          </div>
          <h3 className='font-medium text-slate-700'>Colors</h3>
        </div>
        <div className='mt-3'>
          <div className='flex flex-wrap gap-2'>
            {pet.colors?.map((color, i) => (
              <div
                key={i}
                className='flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200'
              >
                <div
                  className='h-4 w-4 rounded-full ring-1 ring-slate-200'
                  style={{ backgroundColor: colorToHex(color) }}
                />
                <span className='text-sm font-medium text-slate-700 capitalize'>
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
