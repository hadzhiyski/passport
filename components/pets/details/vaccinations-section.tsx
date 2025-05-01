import { Badge } from '@passport/components/ui/badge';
import { Button } from '@passport/components/ui/button';
import { format } from 'date-fns';
import { ShieldIcon } from 'lucide-react';
import { PetSectionPagination } from './pagination';
import { ViewAll } from './view-all';

function isExpired(date: Date | null): boolean {
  if (!date) return false;
  return date < new Date();
}

export type VaccinationProps = {
  id: string;
  name: string;
  manufacturer: string;
  lotNumber: string;
  administeredOn: Date;
  administeredBy: {
    id: string;
    name: string;
  };
  validFrom: Date | null;
  validUntil: Date;
  type: string;
};

export interface VaccinationsSectionProps {
  query: Promise<{ total: number; vaccinations: VaccinationProps[] }>;
  currentPage?: number | 'all';
  pageSize?: number;
  paginationSearchParam?: string;
}

export async function VaccinationsSection({
  query,
  currentPage = 1,
  pageSize = 3,
  paginationSearchParam = 'v',
}: VaccinationsSectionProps) {
  const { total, vaccinations } = await query;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div
      id='vaccinations'
      className='rounded-xl border border-border bg-card scroll-mt-20'
    >
      <div className='flex items-center justify-between p-6 border-b border-border'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 text-primary p-2 rounded-full'>
            <ShieldIcon className='h-5 w-5' />
          </div>
          <h3 className='font-medium text-card-foreground'>Vaccinations</h3>
        </div>
        {totalPages > 1 ? (
          <ViewAll anchor='vaccinations' value={currentPage} param='v' />
        ) : null}
      </div>
      <div className='p-3'>
        {total === 0 ? (
          <div className='flex flex-col items-center text-center p-6'>
            <div className='bg-primary/10 text-primary p-3 rounded-full mb-3'>
              <ShieldIcon className='h-6 w-6' />
            </div>
            <h3 className='font-medium text-card-foreground mb-2'>
              No Vaccination Records
            </h3>
            <p className='text-muted-foreground mb-4'>
              Add your pet&apos;s vaccinations to track their health history.
            </p>
            <Button
              variant='outline'
              className='text-primary border-primary/20'
            >
              Add Vaccination
            </Button>
          </div>
        ) : null}
        {total > 0 ? (
          <div className='space-y-4'>
            {vaccinations.map((vaccination) => (
              <div
                key={vaccination.id}
                className='rounded-lg p-4 border border-border bg-card/50'
              >
                <div className='flex flex-col sm:flex-row sm:justify-between gap-2 mb-2'>
                  <h4 className='font-medium text-card-foreground'>
                    {vaccination.name}
                  </h4>
                  <Badge
                    variant='outline'
                    className='bg-muted text-muted-foreground w-fit capitalize'
                  >
                    {vaccination.type}
                  </Badge>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Manufacturer:</span>
                    <span className='text-card-foreground font-medium'>
                      {vaccination.manufacturer}
                    </span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Lot Number:</span>
                    <span className='text-card-foreground font-medium'>
                      {vaccination.lotNumber}
                    </span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Administered On:
                    </span>
                    <span className='text-card-foreground font-medium'>
                      {format(vaccination.administeredOn, 'MMM d, yyyy')}
                    </span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Administered By:
                    </span>
                    <span className='text-card-foreground font-medium'>
                      {vaccination.administeredBy.name}
                    </span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Valid From:</span>
                    <span className='text-card-foreground font-medium'>
                      {vaccination.validFrom
                        ? format(new Date(vaccination.validFrom), 'MMM d, yyyy')
                        : 'N/A'}
                    </span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Valid Until:</span>
                    <span
                      className={`font-medium ${isExpired(vaccination.validUntil) ? 'text-destructive' : 'text-card-foreground'}`}
                    >
                      {format(vaccination.validUntil, 'MMM d, yyyy')}
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
                anchorId='vaccinations'
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
