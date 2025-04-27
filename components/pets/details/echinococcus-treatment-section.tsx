import { Badge } from '@passport/components/ui/badge';
import { Button } from '@passport/components/ui/button';
import { db } from '@passport/database';
import { antiEchinococcusTreatmentsTable } from '@passport/database/schema/anti-echinococcus-treatments';
import { petsTable } from '@passport/database/schema/pets';
import { veterinariansTable } from '@passport/database/schema/veterinarians';
import { format } from 'date-fns';
import { desc, eq } from 'drizzle-orm';
import { ZapIcon } from 'lucide-react';
import { PetSectionPagination } from './pagination';

export async function EchinococcusTreatmentSection({
  petId,
  page = 1,
}: {
  petId: string;
  page?: number;
}) {
  const PAGE_SIZE = 3;
  const count = await db.$count(
    antiEchinococcusTreatmentsTable,
    eq(
      antiEchinococcusTreatmentsTable.petId,
      petsTable.id.mapToDriverValue(petId) as number,
    ),
  );
  if (count === 0) {
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

  const totalPages = Math.ceil(count / PAGE_SIZE);
  const treatments = await db
    .select({
      id: antiEchinococcusTreatmentsTable.id,
      name: antiEchinococcusTreatmentsTable.name,
      manufacturer: antiEchinococcusTreatmentsTable.manufacturer,
      administeredOn: antiEchinococcusTreatmentsTable.administeredOn,
      administeredBy: veterinariansTable.name,
      validUntil: antiEchinococcusTreatmentsTable.validUntil,
    })
    .from(antiEchinococcusTreatmentsTable)
    .leftJoin(
      veterinariansTable,
      eq(antiEchinococcusTreatmentsTable.administeredBy, veterinariansTable.id),
    )
    .where(
      eq(
        antiEchinococcusTreatmentsTable.petId,
        petsTable.id.mapToDriverValue(petId) as number,
      ),
    )
    .orderBy(desc(antiEchinococcusTreatmentsTable.administeredOn))
    .offset((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE);

  return (
    <div className='space-y-4'>
      {treatments.map((treatment) => (
        <div
          key={treatment.id}
          className='bg-orange-50 rounded-lg p-4 border border-orange-100'
        >
          <div className='flex flex-col sm:flex-row sm:justify-between gap-2 mb-2'>
            <h4 className='font-medium text-slate-800'>{treatment.name}</h4>
            <Badge
              variant='outline'
              className='bg-orange-100 text-orange-700 w-fit'
            >
              <ZapIcon className='h-3 w-3 mr-1' />
              Anti-Echinococcus
            </Badge>
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
                {treatment.administeredBy || 'Not Available'}
              </span>
            </div>
          </div>
        </div>
      ))}

      <PetSectionPagination
        currentPage={page}
        totalPages={totalPages}
        paramName='echp'
        anchorId='echinococcus'
      />
    </div>
  );
}
