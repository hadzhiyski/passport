import { db } from '@passport/database';
import { antiEchinococcusTreatmentsTable } from '@passport/database/schema/anti-echinococcus-treatments';
import TreatmentForm from '@passport/components/treatments/echinococcus/treatment-form';
import { eq } from 'drizzle-orm';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EchinococcusTreatmentEditPage(page: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await page.params;
  const treatments = await db
    .select({
      id: antiEchinococcusTreatmentsTable.id,
      name: antiEchinococcusTreatmentsTable.name,
      manufacturer: antiEchinococcusTreatmentsTable.manufacturer,
      administeredOn: antiEchinococcusTreatmentsTable.administeredOn,
      administeredBy: antiEchinococcusTreatmentsTable.administeredBy,
      validUntil: antiEchinococcusTreatmentsTable.validUntil,
      petId: antiEchinococcusTreatmentsTable.petId,
    })
    .from(antiEchinococcusTreatmentsTable)
    .where(eq(antiEchinococcusTreatmentsTable.id, id));

  if (treatments.length === 0) {
    return notFound();
  }
  if (treatments.length > 1) {
    throw new Error('Multiple treatments found with the same ID');
  }

  const treatment = treatments[0];

  return (
    <div className='container max-w-2xl mx-auto px-4 py-8'>
      <div className='flex items-center mb-6'>
        <Link
          href={`/pets/${treatment.petId}`}
          className='text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors'
        >
          <ArrowLeftIcon className='h-4 w-4' />
          <span>Back to pet</span>
        </Link>
      </div>

      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-orange-900'>
          Edit Anti-Echinococcus Treatment
        </h1>
        <p className='text-orange-700 mt-1'>
          Update treatment information for your pet
        </p>
      </div>

      <TreatmentForm
        petId={treatment.petId}
        initialData={{
          id: treatment.id,
          petId: treatment.petId,
          name: treatment.name || '',
          manufacturer: treatment.manufacturer,
          administeredBy: treatment.administeredBy,
          administeredOn: new Date(treatment.administeredOn),
          validUntil: new Date(treatment.validUntil),
        }}
      />
    </div>
  );
}
