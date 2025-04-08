import { Badge } from '@passport/components/ui/badge';
import { Button } from '@passport/components/ui/button';
import { db } from '@passport/database';
import { antiEchinococcusTreatmentTable } from '@passport/database/schema/anti-echinococcus-treatment';
import { petsTable } from '@passport/database/schema/pet';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import { ZapIcon } from 'lucide-react';

export async function EchinococcusTreatmentSection({
  petId,
}: {
  petId: string;
}) {
  const treatments = await db
    .select({
      id: antiEchinococcusTreatmentTable.id,
      name: antiEchinococcusTreatmentTable.name,
      manufacturer: antiEchinococcusTreatmentTable.manufacturer,
      administeredOn: antiEchinococcusTreatmentTable.administeredOn,
    })
    .from(antiEchinococcusTreatmentTable)
    .where(
      eq(
        antiEchinococcusTreatmentTable.petId,
        petsTable.id.mapToDriverValue(petId) as number,
      ),
    );

  if (treatments.length === 0) {
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
            <h4 className='font-medium text-slate-800'>
              {treatment.name || 'Unnamed Treatment'}
            </h4>
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
                {treatment.manufacturer || 'N/A'}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-slate-500'>Administered On:</span>
              <span className='text-slate-700 font-medium'>
                {treatment.administeredOn
                  ? format(new Date(treatment.administeredOn), 'MMM d, yyyy')
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
