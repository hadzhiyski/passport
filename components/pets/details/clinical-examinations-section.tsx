import { db } from '@passport/database';
import { clinicalExaminationsTable } from '@passport/database/schema/clinical-examinations';
import { petsTable } from '@passport/database/schema/pets';
import { veterinariansTable } from '@passport/database/schema/veterinarians';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';

export async function ClinicalExaminationsSection({
  petId,
}: {
  petId: string;
}) {
  const examinations = await db
    .select({
      date: clinicalExaminationsTable.date,
      veterinarian: veterinariansTable.name,
    })
    .from(clinicalExaminationsTable)
    .innerJoin(
      veterinariansTable,
      eq(clinicalExaminationsTable.veterinarianId, veterinariansTable.id),
    )
    .where(
      eq(
        clinicalExaminationsTable.petId,
        petsTable.id.mapToDriverValue(petId) as number,
      ),
    );

  if (examinations.length === 0) {
    return (
      <div className='text-center py-12 text-slate-500'>
        No clinical examinations recorded.
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-6'>
      {examinations.map((exam, index) => (
        <div
          key={index}
          className='border border-slate-100 rounded-lg p-4 shadow-sm'
        >
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='text-slate-700 bg-slate-50 p-3 rounded italic text-sm md:col-span-2'>
              The animal shows no signs of diseases and is fit to be transported
              for the intended journey.
            </div>
            <div>
              <span className='text-slate-500 text-sm block'>Date</span>
              <span className='font-medium'>
                {format(new Date(exam.date), 'MMM d, yyyy')}
              </span>
            </div>
            <div>
              <span className='text-slate-500 text-sm block'>Veterinarian</span>
              <span className='font-medium'>{exam.veterinarian}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
