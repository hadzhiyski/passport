import { Button } from '@passport/components/ui/button';
import { format } from 'date-fns';
import { ZapIcon } from 'lucide-react';
import { PetSectionPagination } from './pagination';
import { ViewAll } from './view-all';

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

  return (
    <div
      id='anti-echinococcus'
      className='rounded-xl border border-border bg-card scroll-mt-20'
    >
      <div className='flex items-center justify-between p-6 border-b border-border'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 text-primary p-2 rounded-full'>
            <ZapIcon className='h-5 w-5' />
          </div>
          <h3 className='font-medium text-card-foreground'>
            Anti-Echinococcus Treatments
          </h3>
        </div>
        {totalPages > 1 ? (
          <ViewAll anchor='anti-echinococcus' value={currentPage} param='e' />
        ) : null}
      </div>
      <div className='p-3'>
        {total === 0 ? (
          <div className='flex flex-col items-center text-center p-6'>
            <div className='bg-primary/10 text-primary p-3 rounded-full mb-3'>
              <ZapIcon className='h-6 w-6' />
            </div>
            <h3 className='font-medium text-card-foreground mb-2'>
              No Anti-Echinococcus Treatments
            </h3>
            <p className='text-muted-foreground mb-4'>
              Add anti-echinococcus treatments to track your pet&apos;s
              prevention history.
            </p>
            <Button
              variant='outline'
              className='text-primary border-primary/20'
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
                className='rounded-lg p-4 border border-border bg-card/50'
              >
                <div className='flex flex-col sm:flex-row sm:justify-between gap-2 mb-2'>
                  <h4 className='font-medium text-card-foreground'>
                    {treatment.name}
                  </h4>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Manufacturer:</span>
                    <span className='text-card-foreground font-medium'>
                      {treatment.manufacturer || 'Not Available'}
                    </span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Valid Until:</span>
                    <span className='text-card-foreground font-medium'>
                      {treatment.validUntil
                        ? format(new Date(treatment.validUntil), 'MMM d, yyyy')
                        : 'Not Available'}
                    </span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Administered On:
                    </span>
                    <span className='text-card-foreground font-medium'>
                      {format(treatment.administeredOn, 'MMM d, yyyy')}
                    </span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Administered By:
                    </span>
                    <span className='text-card-foreground font-medium'>
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
        ) : null}
      </div>
    </div>
  );
}
