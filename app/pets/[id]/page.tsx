import { ClinicalExaminationsLoadingSkeleton } from '@passport/components/pets/details/clinical-examination-loading';
import { ClinicalExaminationsSection } from '@passport/components/pets/details/clinical-examinations-section';
import { EchinococcusTreatmentSection } from '@passport/components/pets/details/echinococcus-treatment-section';
import { GeneralParasiteTreatmentSection } from '@passport/components/pets/details/general-parasite-treatment-section';
import { ParasiteTreatmentLoadingSkeleton } from '@passport/components/pets/details/parasite-treatments-loading';
import { PassportLoadingSkeleton } from '@passport/components/pets/details/passport-loading';
import { PassportSection } from '@passport/components/pets/details/passport-section';
import { VaccinationsLoadingSkeleton } from '@passport/components/pets/details/vaccinations-loading';
import { VaccinationsSection } from '@passport/components/pets/details/vaccinations-section';
import { db } from '@passport/database';
import { antiEchinococcusTreatmentsTable } from '@passport/database/schema/anti-echinococcus-treatments';
import { antiParasiteTreatmentsTable } from '@passport/database/schema/anti-parasite-treatments';
import { clinicalExaminationsTable } from '@passport/database/schema/clinical-examinations';
import { ownersTable } from '@passport/database/schema/owners';
import { passportsTable } from '@passport/database/schema/passports';
import { petMarkingsTable } from '@passport/database/schema/pet-markings';
import { vaccinationsTable } from '@passport/database/schema/vaccinations';
import { veterinariansTable } from '@passport/database/schema/veterinarians';
import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
  BookIcon,
  BugIcon,
  ShieldIcon,
  StethoscopeIcon,
  ZapIcon,
} from 'lucide-react';
import { Suspense } from 'react';

const VAX_SECTION_PAGE_SIZE = 3;
const ECHINOCOCCUS_SECTION_PAGE_SIZE = 3;
const GENERAL_PARASITE_SECTION_PAGE_SIZE = 3;

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

  const vaccinationsSelect = Promise.all([
    db.$count(vaccinationsTable, eq(vaccinationsTable.petId, id)),
    db
      .select({
        id: vaccinationsTable.id,
        name: vaccinationsTable.name,
        manufacturer: vaccinationsTable.manufacturer,
        lotNumber: vaccinationsTable.lotNumber,
        expiryDate: vaccinationsTable.expiryDate,
        administeredOn: vaccinationsTable.administeredOn,
        administeredBy: {
          id: veterinariansTable.id,
          name: veterinariansTable.name,
        },
        validFrom: vaccinationsTable.validFrom,
        validUntil: vaccinationsTable.validUntil,
        type: vaccinationsTable.type,
      })
      .from(vaccinationsTable)
      .innerJoin(
        veterinariansTable,
        eq(vaccinationsTable.administeredBy, veterinariansTable.id),
      )
      .where(eq(vaccinationsTable.petId, id))
      .orderBy(desc(vaccinationsTable.validUntil), desc(vaccinationsTable.id))
      .offset((vaxPage - 1) * VAX_SECTION_PAGE_SIZE)
      .limit(VAX_SECTION_PAGE_SIZE),
  ]).then(([total, vaccinations]) => ({
    total,
    vaccinations,
  }));

  const echinococcusSelect = Promise.all([
    db.$count(
      antiEchinococcusTreatmentsTable,
      eq(antiEchinococcusTreatmentsTable.petId, id),
    ),
    db
      .select({
        id: antiEchinococcusTreatmentsTable.id,
        name: antiEchinococcusTreatmentsTable.name,
        manufacturer: antiEchinococcusTreatmentsTable.manufacturer,
        administeredOn: antiEchinococcusTreatmentsTable.administeredOn,
        administeredBy: veterinariansTable.name,
        validUntil: antiEchinococcusTreatmentsTable.validUntil,
      })
      .from(antiEchinococcusTreatmentsTable)
      .innerJoin(
        veterinariansTable,
        eq(
          antiEchinococcusTreatmentsTable.administeredBy,
          veterinariansTable.id,
        ),
      )
      .where(eq(antiEchinococcusTreatmentsTable.petId, id))
      .orderBy(desc(antiEchinococcusTreatmentsTable.administeredOn))
      .offset((echPage - 1) * ECHINOCOCCUS_SECTION_PAGE_SIZE)
      .limit(ECHINOCOCCUS_SECTION_PAGE_SIZE),
  ]).then(([total, treatments]) => ({
    total,
    treatments,
  }));

  const generalParasiteSelect = Promise.all([
    db.$count(
      antiParasiteTreatmentsTable,
      eq(antiParasiteTreatmentsTable.petId, id),
    ),
    db
      .select({
        id: antiParasiteTreatmentsTable.id,
        name: antiParasiteTreatmentsTable.name,
        manufacturer: antiParasiteTreatmentsTable.manufacturer,
        administeredOn: antiParasiteTreatmentsTable.administeredOn,
        administeredBy: veterinariansTable.name,
        validUntil: antiParasiteTreatmentsTable.validUntil,
      })
      .from(antiParasiteTreatmentsTable)
      .innerJoin(
        veterinariansTable,
        eq(antiParasiteTreatmentsTable.administeredBy, veterinariansTable.id),
      )
      .where(eq(antiParasiteTreatmentsTable.petId, id))
      .orderBy(desc(antiParasiteTreatmentsTable.administeredOn))
      .offset((parPage - 1) * GENERAL_PARASITE_SECTION_PAGE_SIZE)
      .limit(GENERAL_PARASITE_SECTION_PAGE_SIZE),
  ]).then(([total, treatments]) => ({
    total,
    treatments,
  }));

  return (
    <>
      <div
        id='passport'
        className='bg-white rounded-xl border border-slate-200 scroll-mt-20'
      >
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div className='flex items-center gap-2'>
            <div className='bg-blue-100 text-blue-600 p-2 rounded-full'>
              <BookIcon className='h-5 w-5' />
            </div>
            <h3 className='font-medium text-slate-800'>Pet Passport</h3>
          </div>
        </div>

        <div className='p-3'>
          <Suspense fallback={<PassportLoadingSkeleton />}>
            <PassportSection query={passportSelect} />
          </Suspense>
        </div>
      </div>

      <div
        id='vaccinations'
        className='bg-white rounded-xl border border-slate-200 scroll-mt-20'
      >
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div className='flex items-center gap-2'>
            <div className='bg-emerald-100 text-emerald-600 p-2 rounded-full'>
              <ShieldIcon className='h-5 w-5' />
            </div>
            <h3 className='font-medium text-slate-800'>Vaccinations</h3>
          </div>
        </div>
        <div className='p-3'>
          <Suspense fallback={<VaccinationsLoadingSkeleton />}>
            <VaccinationsSection
              query={vaccinationsSelect}
              currentPage={vaxPage}
              pageSize={VAX_SECTION_PAGE_SIZE}
            />
          </Suspense>
        </div>
      </div>

      <div
        id='anti-echinococcus'
        className='bg-white rounded-xl border border-slate-200 scroll-mt-20'
      >
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div className='flex items-center gap-2'>
            <div className='bg-orange-100 text-orange-600 p-2 rounded-full'>
              <ZapIcon className='h-5 w-5' />
            </div>
            <h3 className='font-medium text-slate-800'>
              Anti-Echinococcus Treatments
            </h3>
          </div>
        </div>
        <div className='p-3'>
          <Suspense fallback={<ParasiteTreatmentLoadingSkeleton />}>
            <EchinococcusTreatmentSection
              query={echinococcusSelect}
              currentPage={echPage}
              pageSize={ECHINOCOCCUS_SECTION_PAGE_SIZE}
            />
          </Suspense>
        </div>
      </div>

      <div
        id='anti-parasites'
        className='bg-white rounded-xl border border-slate-200 scroll-mt-20'
      >
        <div className='flex items-center justify-between p-6 border-b border-slate-100'>
          <div className='flex items-center gap-2'>
            <div className='bg-amber-100 text-amber-600 p-2 rounded-full'>
              <BugIcon className='h-5 w-5' />
            </div>
            <h3 className='font-medium text-slate-800'>
              Anti-Parasite Treatments
            </h3>
          </div>
        </div>
        <div className='p-3'>
          <Suspense fallback={<ParasiteTreatmentLoadingSkeleton />}>
            <GeneralParasiteTreatmentSection
              query={generalParasiteSelect}
              currentPage={parPage}
              pageSize={GENERAL_PARASITE_SECTION_PAGE_SIZE}
            />
          </Suspense>
        </div>
      </div>

      <div
        id='examinations'
        className='bg-white rounded-xl border border-slate-200 scroll-mt-20'
      >
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
