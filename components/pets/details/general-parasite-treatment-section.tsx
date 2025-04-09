import { Badge } from '@passport/components/ui/badge';
import { Button } from '@passport/components/ui/button';
import { db } from '@passport/database';
import { antiParasiteTreatmentTable } from '@passport/database/schema/anti-parasite-treatment';
import { petsTable } from '@passport/database/schema/pet';
import { veterinarianTable } from '@passport/database/schema/veterinarian';
import { format } from 'date-fns';
import { desc, eq } from 'drizzle-orm';
import { BugIcon } from 'lucide-react';
import { PetSectionPagination } from './pagination';

export async function GeneralParasiteTreatmentSection({
  petId,
  page = 1,
}: {
  petId: string;
  page?: number;
}) {
  const PAGE_SIZE = 3;
  const count = await db.$count(
    antiParasiteTreatmentTable,
    eq(
      antiParasiteTreatmentTable.petId,
      petsTable.id.mapToDriverValue(petId) as number,
    ),
  );
  if (count === 0) {
    return (
      <div className='flex flex-col items-center text-center p-6'>
        <div className='bg-amber-100 text-amber-600 p-3 rounded-full mb-3'>
          <BugIcon className='h-6 w-6' />
        </div>
        <h3 className='font-medium text-amber-900 mb-2'>
          No Anti-Parasite Treatments
        </h3>
        <p className='text-amber-700 mb-4'>
          Add general anti-parasite treatments to protect your pet from fleas,
          ticks, and other parasites.
        </p>
        <Button variant='outline' className='text-amber-600 border-amber-200'>
          Add Treatment
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(count / PAGE_SIZE);
  const treatments = await db
    .select({
      id: antiParasiteTreatmentTable.id,
      name: antiParasiteTreatmentTable.name,
      manufacturer: antiParasiteTreatmentTable.manufacturer,
      administeredOn: antiParasiteTreatmentTable.administeredOn,
      administeredBy: veterinarianTable.name,
      validUntil: antiParasiteTreatmentTable.validUntil,
    })
    .from(antiParasiteTreatmentTable)
    .leftJoin(
      veterinarianTable,
      eq(antiParasiteTreatmentTable.administeredBy, veterinarianTable.id),
    )
    .where(
      eq(
        antiParasiteTreatmentTable.petId,
        petsTable.id.mapToDriverValue(petId) as number,
      ),
    )
    .orderBy(desc(antiParasiteTreatmentTable.administeredOn))
    .offset((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE);

  return (
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
            <Badge
              variant='outline'
              className='bg-amber-100 text-amber-700 w-fit'
            >
              <BugIcon className='h-3 w-3 mr-1' />
              Anti-Parasite
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
        paramName='parp'
        anchorId='parasite'
      />
    </div>
  );
}
