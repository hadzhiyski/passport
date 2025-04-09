import { Badge } from '@passport/components/ui/badge';
import { Button } from '@passport/components/ui/button';
import { db } from '@passport/database';
import { petsTable } from '@passport/database/schema/pet';
import { vaccinationsTable } from '@passport/database/schema/vaccination';
import { veterinarianTable } from '@passport/database/schema/veterinarian';
import { format } from 'date-fns';
import { desc, eq } from 'drizzle-orm';
import { ShieldIcon } from 'lucide-react';
import { PetSectionPagination } from './pagination';

function isExpired(date: string | null): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}

export async function VaccinationsSection({
  petId,
  page = 1,
}: {
  petId: string;
  page?: number;
}) {
  const PAGE_SIZE = 3;
  const count = await db.$count(
    vaccinationsTable,
    eq(vaccinationsTable.petId, petsTable.id.mapToDriverValue(petId) as number),
  );
  if (count === 0) {
    return (
      <div className='flex flex-col items-center text-center p-6'>
        <div className='bg-blue-100 text-blue-600 p-3 rounded-full mb-3'>
          <ShieldIcon className='h-6 w-6' />
        </div>
        <h3 className='font-medium text-blue-900 mb-2'>
          No Vaccination Records
        </h3>
        <p className='text-blue-700 mb-4'>
          Add your pet&apos;s vaccinations to track their health history.
        </p>
        <Button variant='outline' className='text-blue-600 border-blue-200'>
          Add Vaccination
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(count / PAGE_SIZE);
  const vaccinations = await db
    .select({
      id: vaccinationsTable.id,
      name: vaccinationsTable.name,
      manufacturer: vaccinationsTable.manufacturer,
      lotNumber: vaccinationsTable.lotNumber,
      expiryDate: vaccinationsTable.expiryDate,
      administeredOn: vaccinationsTable.administeredOn,
      administeredBy: {
        id: veterinarianTable.id,
        name: veterinarianTable.name,
      },
      validFrom: vaccinationsTable.validFrom,
      validUntil: vaccinationsTable.validUntil,
      type: vaccinationsTable.type,
    })
    .from(vaccinationsTable)
    .innerJoin(
      veterinarianTable,
      eq(vaccinationsTable.administeredBy, veterinarianTable.id),
    )
    .where(
      eq(
        vaccinationsTable.petId,
        petsTable.id.mapToDriverValue(petId) as number,
      ),
    )
    .orderBy(desc(vaccinationsTable.validUntil))
    .offset((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE);

  return (
    <div className='space-y-4'>
      {vaccinations.map((vaccination) => (
        <div
          key={vaccination.id}
          className='rounded-lg p-4 border border-slate-100'
        >
          <div className='flex flex-col sm:flex-row sm:justify-between gap-2 mb-2'>
            <h4 className='font-medium text-slate-800'>{vaccination.name}</h4>
            <Badge
              variant='outline'
              className='bg-slate-100 text-slate-700 w-fit'
            >
              {vaccination.type || 'Vaccination'}
            </Badge>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-slate-500'>Manufacturer:</span>
              <span className='text-slate-700 font-medium'>
                {vaccination.manufacturer || 'N/A'}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-slate-500'>Lot Number:</span>
              <span className='text-slate-700 font-medium'>
                {vaccination.lotNumber || 'N/A'}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-slate-500'>Administered On:</span>
              <span className='text-slate-700 font-medium'>
                {vaccination.administeredOn
                  ? format(new Date(vaccination.administeredOn), 'MMM d, yyyy')
                  : 'N/A'}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-slate-500'>Administered By:</span>
              <span className='text-slate-700 font-medium'>
                {vaccination.administeredBy.name}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-slate-500'>Valid From:</span>
              <span className='text-slate-700 font-medium'>
                {vaccination.validFrom
                  ? format(new Date(vaccination.validFrom), 'MMM d, yyyy')
                  : 'N/A'}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-slate-500'>Valid Until:</span>
              <span
                className={`font-medium ${isExpired(vaccination.validUntil) ? 'text-red-600' : 'text-slate-700'}`}
              >
                {vaccination.validUntil
                  ? format(new Date(vaccination.validUntil), 'MMM d, yyyy')
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ))}

      <PetSectionPagination
        currentPage={page}
        totalPages={totalPages}
        paramName='vaxp'
        anchorId='vaccinations'
      />
    </div>
  );
}
