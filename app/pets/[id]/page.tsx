import { AddHealthRecordButton } from '@passport/components/pets/details/add-health-record-button';
import { ClinicalExaminationsLoadingSkeleton } from '@passport/components/pets/details/clinical-examination-loading';
import { ClinicalExaminationsSection } from '@passport/components/pets/details/clinical-examinations-section';
import { PassportLoadingSkeleton } from '@passport/components/pets/details/passport-loading';
import { PassportSection } from '@passport/components/pets/details/passport-section';
import { PetTabs } from '@passport/components/pets/details/pet-tabs';
import { Button } from '@passport/components/ui/button';
import { db } from '@passport/database';
import { clinicalExaminationsTable } from '@passport/database/schema/clinical-examinations';
import { ownersTable } from '@passport/database/schema/owners';
import { passportsTable } from '@passport/database/schema/passports';
import { petMarkingsTable } from '@passport/database/schema/pet-markings';
import { veterinariansTable } from '@passport/database/schema/veterinarians';
import { eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { ActivityIcon, BookIcon, StethoscopeIcon } from 'lucide-react';
import { Suspense } from 'react';

export default async function PetDetailsPage(page: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ vaxp?: string; echp?: string; parp?: string }>;
}) {
  const { id } = await page.params;
  const { vaxp, echp, parp } = await page.searchParams;
  const vaxPage = vaxp ? parseInt(vaxp) : 1;
  const echPage = echp ? parseInt(echp) : 1;
  const parPage = parp ? parseInt(parp) : 1;

  const owner1Table = alias(ownersTable, 'owner1');
  const owner2Table = alias(ownersTable, 'owner2');
  const passportSelect = db
    .select({
      id: passportsTable.id,
      serialNumber: passportsTable.serialNumber,
      issueDate: passportsTable.issueDate,
      marking: {
        code: petMarkingsTable.code,
        type: petMarkingsTable.type,
        place: petMarkingsTable.place,
        applicationDate: petMarkingsTable.applicationDate,
      },
      owner1: {
        id: owner1Table.id,
        name: sql`concat_ws(' ', ${owner1Table.firstname}, ${owner1Table.lastname})`.mapWith(
          String,
        ),
      },
      owner2: {
        id: owner2Table.id,
        name: sql`concat_ws(' ', ${owner2Table.firstname}, ${owner2Table.lastname})`.mapWith(
          String,
        ),
      },
      vet: {
        id: veterinariansTable.id,
        name: veterinariansTable.name,
      },
    })
    .from(passportsTable)
    .innerJoin(
      veterinariansTable,
      eq(passportsTable.issuedBy, veterinariansTable.id),
    )
    .innerJoin(owner1Table, eq(passportsTable.owner1Id, owner1Table.id))
    .leftJoin(owner2Table, eq(passportsTable.owner2Id, owner2Table.id))
    .leftJoin(petMarkingsTable, eq(passportsTable.petId, petMarkingsTable.id))
    .where(eq(passportsTable.petId, id));
  const examinationsSelect = db
    .select({
      id: clinicalExaminationsTable.id,
      date: clinicalExaminationsTable.date,
      veterinarian: veterinariansTable.name,
    })
    .from(clinicalExaminationsTable)
    .innerJoin(
      veterinariansTable,
      eq(clinicalExaminationsTable.veterinarianId, veterinariansTable.id),
    )
    .where(eq(clinicalExaminationsTable.petId, id));
  return (
    <>
      <div className='bg-white rounded-xl border border-slate-200 overflow-hidden'>
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div className='flex items-center gap-2'>
            <div className='bg-blue-100 text-blue-600 p-2 rounded-full'>
              <BookIcon className='h-5 w-5' />
            </div>
            <h3 className='font-medium text-slate-800'>Pet Passport</h3>
          </div>

          <Button
            variant='outline'
            size='sm'
            className='text-blue-600 border-blue-200'
          >
            View Details
          </Button>
        </div>

        <div className='p-3'>
          <Suspense fallback={<PassportLoadingSkeleton />}>
            <PassportSection query={passportSelect} />
          </Suspense>
        </div>
      </div>

      <div className='bg-white rounded-xl border border-slate-200 overflow-hidden'>
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div className='flex items-center gap-2'>
            <div className='bg-emerald-100 text-emerald-600 p-2 rounded-full'>
              <ActivityIcon className='h-5 w-5' />
            </div>
            <h3 className='font-medium text-slate-800'>Health Records</h3>
          </div>

          <AddHealthRecordButton petId={id}>Add Record</AddHealthRecordButton>
        </div>
        <div className='p-3'>
          <PetTabs
            petId={id}
            vaxSectionPage={vaxPage}
            echinoSectionPage={echPage}
            parasiteSectionPage={parPage}
          />
        </div>
      </div>

      <div className='bg-white rounded-xl border border-slate-200 overflow-hidden'>
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div className='flex items-center gap-2'>
            <div className='bg-orange-100 text-orange-600 p-2 rounded-full'>
              <StethoscopeIcon className='h-5 w-5' />
            </div>
            <h3 className='font-medium text-slate-800'>
              Clinical Examinations
            </h3>
          </div>

          {/* <Button
                variant='outline'
                size='sm'
                className='text-orange-600 border-orange-200'
              >
                Add Examination
              </Button> */}
        </div>
        <div className='p-3'>
          <Suspense fallback={<ClinicalExaminationsLoadingSkeleton />}>
            <ClinicalExaminationsSection query={examinationsSelect} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
