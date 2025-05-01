import { Button } from '@passport/components/ui/button';
import { format } from 'date-fns';
import { ZapIcon } from 'lucide-react';
import { PetSectionPagination } from './pagination';

export type EchinococcusTreatmentProps = {
  id: string;
  name: string;
  manufacturer: string | null;
  administeredOn: Date;
  administeredBy: string;
  validUntil: Date;
};

export interface EchinococcusTreatmentSectionProps {
  query: Promise<{ total: number; treatments: EchinococcusTreatmentProps[] }>;
  currentPage?: number | 'all';
  pageSize?: number;
  paginationSearchParam?: string;
}

export async function EchinococcusTreatmentSection({
  query,
  currentPage = 1,
  pageSize = 3,
  paginationSearchParam = 'e',
}: EchinococcusTreatmentSectionProps) {
  const { total, treatments } = await query;
  const totalPages = Math.ceil(total / pageSize);

  if (total === 0) {
    return (
      <div className='flex flex-col items-center text-center p-6'>
        <div className='bg-orange-100 text-orange-600 p-3 rounded-full mb-3'>
          <ZapIcon className='h-6 w-6' />
        </div>
        <h3 className='font-medium text-orange-900 mb-2'>
          No Anti-Echinococcus Treatments
        </h3>
        <p className='text-orange-700 mb-4'>
          Add anti-echinococcus treatments to track your pet&apos;s prevention
          history.
        </p>
        <Button variant='outline' className='text-orange-600 border-orange-200'>
          Add Treatment
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {treatments.map((treatment) => (
        <div
          key={treatment.id}
          className='bg-orange-50 rounded-lg p-4 border border-orange-100'
        >
          <div className='flex flex-col sm:flex-row sm:justify-between gap-2 mb-2'>
            <h4 className='font-medium text-slate-800'>{treatment.name}</h4>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-slate-500'>Manufacturer:</span>
              <span className='text-slate-700 font-medium'>
                {treatment.manufacturer || 'Not Available'}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-slate-500'>Valid Until:</span>
              <span className='text-slate-700 font-medium'>
                {treatment.validUntil
                  ? format(new Date(treatment.validUntil), 'MMM d, yyyy')
                  : 'Not Available'}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-slate-500'>Administered On:</span>
              <span className='text-slate-700 font-medium'>
                {format(treatment.administeredOn, 'MMM d, yyyy')}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-slate-500'>Administered By:</span>
              <span className='text-slate-700 font-medium'>
                {treatment.administeredBy}
              </span>
            </div>
          </div>
        </div>
      ))}

      {typeof currentPage === 'number' ? (
        <PetSectionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          paramName={paginationSearchParam}
          anchorId='echinococcus'
        />
      ) : null}
    </div>
  );
}
