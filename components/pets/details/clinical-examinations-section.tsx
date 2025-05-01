import { Button } from '@passport/components/ui/button';
import { format } from 'date-fns';
import { PlusIcon, StethoscopeIcon } from 'lucide-react';
import Link from 'next/link';
import { PetSectionPagination } from './pagination';
import { ViewAll } from './view-all';

export type ClinicalExaminationProps = {
  id: string;
  date: Date;
  veterinarian: string;
};

export interface ClinicalExaminationsSectionProps {
  query: Promise<{ total: number; examinations: ClinicalExaminationProps[] }>;
  currentPage?: number | 'all';
  pageSize?: number;
  paginationSearchParam?: string;
  petId: string;
}

export async function ClinicalExaminationsSection({
  query,
  currentPage = 1,
  pageSize = 3,
  paginationSearchParam = 'x',
  petId,
}: ClinicalExaminationsSectionProps) {
  const { total, examinations } = await query;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div
      id='examinations'
      className='rounded-xl border border-border bg-card scroll-mt-20'
    >
      <div className='flex items-center justify-between p-6 border-b border-border'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 text-primary p-2 rounded-full'>
            <StethoscopeIcon className='h-5 w-5' />
          </div>
          <h3 className='font-medium text-card-foreground'>
            Clinical Examinations
          </h3>
        </div>
        <div className='flex items-center gap-2'>
          {total > 0 && (
            <Button
              variant='ghost'
              asChild
              aria-label='Add clinical examination'
              title='Add clinical examination'
            >
              <Link href={`/pets/${petId}/clinical-examinations/add`}>
                <PlusIcon className='h-4 w-4' />
              </Link>
            </Button>
          )}
          {totalPages > 1 ? (
            <ViewAll anchor='examinations' value={currentPage} param='x' />
          ) : null}
        </div>
      </div>
      <div className='p-3'>
        {total === 0 ? (
          <div className='flex flex-col items-center text-center p-6'>
            <div className='bg-primary/10 text-primary p-3 rounded-full mb-3'>
              <StethoscopeIcon className='h-6 w-6' />
            </div>
            <h3 className='font-medium text-card-foreground mb-2'>
              No Clinical Examinations
            </h3>
            <p className='text-muted-foreground mb-4'>
              Add your pet&apos;s clinical examinations to track their health
              history.
            </p>
            <Button
              variant='outline'
              className='text-primary border-primary/20'
              asChild
            >
              <Link href={`/pets/${petId}/clinical-examinations/add`}>
                Add Examination
              </Link>
            </Button>
          </div>
        ) : null}
        {total > 0 ? (
          <div className='grid grid-cols-1 gap-6'>
            {examinations.map((exam, index) => (
              <div
                key={index}
                className='rounded-lg p-4 border border-border bg-card/50'
              >
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  <div className='text-card-foreground bg-muted/50 p-3 rounded italic text-sm md:col-span-2'>
                    The animal shows no signs of diseases and is fit to be
                    transported for the intended journey.
                  </div>
                  <div>
                    <span className='text-muted-foreground text-sm block'>
                      Date
                    </span>
                    <span className='font-medium text-card-foreground'>
                      {format(exam.date, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div>
                    <span className='text-muted-foreground text-sm block'>
                      Veterinarian
                    </span>
                    <span className='font-medium text-card-foreground'>
                      {exam.veterinarian}
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
                anchorId='examinations'
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
