import { Button } from '@passport/components/ui/button';
import { format } from 'date-fns';
import { BugIcon } from 'lucide-react';
import { PetSectionPagination } from './pagination';
import { ViewAll } from './view-all';

export type GeneralParasiteTreatmentProps = {
  id: string;
  name: string;
  manufacturer: string | null;
  administeredOn: Date;
  administeredBy: string;
  validUntil: Date;
};

export interface GeneralParasiteTreatmentSectionProps {
  query: Promise<{
    total: number;
    treatments: GeneralParasiteTreatmentProps[];
  }>;
  currentPage?: number | 'all';
  pageSize?: number;
  paginationSearchParam?: string;
}

export async function GeneralParasiteTreatmentSection({
  query,
  currentPage = 1,
  pageSize = 3,
  paginationSearchParam = 'p',
}: GeneralParasiteTreatmentSectionProps) {
  const { total, treatments } = await query;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div
      id='anti-parasites'
      className='bg-white rounded-xl border border-slate-200 scroll-mt-20'
    >
      <div className='flex items-center justify-between p-6 border-b border-slate-100'>
        <div className='flex items-center gap-2'>
          <div className='bg-amber-100 text-amber-600 p-2 rounded-full'>
            <BugIcon className='h-5 w-5' />
          </div>
          <h3 className='font-medium text-slate-800'>
            Anti-Parasite Treatments
          </h3>
        </div>
        {totalPages > 1 ? (
          <ViewAll anchor='anti-parasites' value={currentPage} param='p' />
        ) : null}
      </div>
      <div className='p-3'>
        {total === 0 ? (
          <div className='flex flex-col items-center text-center p-6'>
            <div className='bg-amber-100 text-amber-600 p-3 rounded-full mb-3'>
              <BugIcon className='h-6 w-6' />
            </div>
            <h3 className='font-medium text-amber-900 mb-2'>
              No Anti-Parasite Treatments
            </h3>
            <p className='text-amber-700 mb-4'>
              Add general anti-parasite treatments to protect your pet from
              fleas, ticks, and other parasites.
            </p>
            <Button
              variant='outline'
              className='text-amber-600 border-amber-200'
            >
              Add Treatment
            </Button>
          </div>
        ) : null}
        {total > 0 ? (
          <div className='space-y-4'>
            {treatments.map((treatment) => (
              <div
                key={treatment.id}
                className='bg-amber-50 rounded-lg p-4 border border-amber-100'
              >
                <div className='flex flex-col sm:flex-row sm:justify-between gap-2 mb-2'>
                  <h4 className='font-medium text-slate-800'>
                    {treatment.name || 'Unnamed Treatment'}
                  </h4>
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
                      {format(treatment.validUntil, 'MMM d, yyyy')}
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
                anchorId='parasite'
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
