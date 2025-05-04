import { Button } from '@passport/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@passport/components/ui/tooltip';
import { format } from 'date-fns';
import { BugIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { PetSectionPagination } from '../ui/pagination';
import { ViewAll } from '../ui/view-all';

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
  petId: string;
}

export async function GeneralParasiteTreatmentSection({
  query,
  currentPage = 1,
  pageSize = 3,
  paginationSearchParam = 'p',
  petId,
}: GeneralParasiteTreatmentSectionProps) {
  const { total, treatments } = await query;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div
      id='anti-parasites'
      className='rounded-xl border border-border bg-card scroll-mt-20'
    >
      <div className='flex items-center justify-between p-4 border-b border-border'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 text-primary p-2 rounded-full'>
            <BugIcon className='h-5 w-5' />
          </div>
          <h3 className='font-medium text-card-foreground'>
            General Parasite Treatments
          </h3>
        </div>
        <div className='flex items-center gap-2'>
          {total > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    asChild
                    aria-label='Add parasite treatment'
                    title='Add parasite treatment'
                  >
                    <Link
                      href={`/pets/${petId}/treatments/parasites/add`}
                      className='flex items-center'
                    >
                      <PlusIcon className='h-4 w-4' />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add new parasite treatment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {totalPages > 1 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ViewAll
                    anchor='anti-parasites'
                    value={currentPage}
                    param='p'
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {currentPage === 'all'
                      ? 'Show paginated view'
                      : 'Show all parasite treatments'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
      </div>
      <div className='p-4'>
        {total === 0 ? (
          <div className='flex flex-col items-center text-center p-4'>
            <div className='bg-primary/10 text-primary p-3 rounded-full mb-3'>
              <BugIcon className='h-6 w-6' />
            </div>
            <h3 className='font-medium text-card-foreground mb-2'>
              No Anti-Parasite Treatments
            </h3>
            <p className='text-muted-foreground mb-4'>
              Add general anti-parasite treatments to protect your pet from
              fleas, ticks, and other parasites.
            </p>
            <Button
              variant='outline'
              className='text-primary border-primary/20'
              asChild
            >
              <Link href={`/pets/${petId}/treatments/parasites/add`}>
                Add Treatment
              </Link>
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
                    {treatment.name || 'Unnamed Treatment'}
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
                      {format(treatment.validUntil, 'MMM d, yyyy')}
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
                anchorId='parasite'
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
