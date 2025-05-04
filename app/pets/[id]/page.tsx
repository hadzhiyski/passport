import { fetchClinicalExaminationsWithTotals } from '@passport/clinical-examinations/pet-details';
import { PetSectionNav } from '@passport/components/pets/details/layout';
import {
  ClinicalExaminationsSkeleton,
  EchinococcusTreatmentSkeleton,
  GeneralParasiteTreatmentSkeleton,
  VaccinationsSkeleton,
} from '@passport/components/pets/details/loaders';
import {
  ClinicalExaminationsSection,
  EchinococcusTreatmentSection,
  GeneralParasiteTreatmentSection,
  VaccinationsSection,
} from '@passport/components/pets/details/sections';
import { fetchAntiEchinococcusWithTotals } from '@passport/treatments/anti-echinococcus/pet-details';
import { fetchAntiParasitesWithTotals } from '@passport/treatments/anti-parasites/pet-details';
import { fetchVaccinationsWithTotals } from '@passport/vaccinations/pet-details';
import { Suspense } from 'react';

const VAX_SECTION_PAGE_SIZE = 3;
const ECHINOCOCCUS_SECTION_PAGE_SIZE = 3;
const GENERAL_PARASITE_SECTION_PAGE_SIZE = 3;
const EXAMINATIONS_SECTION_PAGE_SIZE = 3;

export default async function PetDetailsPage(page: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    v?: string;
    e?: string;
    p?: string;
    x?: string;
  }>;
}) {
  const { id } = await page.params;
  const { v, e, p, x } = await page.searchParams;
  const vaxPage = v && v === 'all' ? v : Number(v || '') || 1;
  const echPage = e && e === 'all' ? e : Number(e || '') || 1;
  const parPage = p && p === 'all' ? p : Number(p || '') || 1;
  const examPage = x && x === 'all' ? x : Number(x || '') || 1;

  const vaccinationsSelect = fetchVaccinationsWithTotals(
    id,
    vaxPage,
    VAX_SECTION_PAGE_SIZE,
  );
  const echinococcusSelect = fetchAntiEchinococcusWithTotals(
    id,
    echPage,
    ECHINOCOCCUS_SECTION_PAGE_SIZE,
  );
  const generalParasiteSelect = fetchAntiParasitesWithTotals(
    id,
    parPage,
    GENERAL_PARASITE_SECTION_PAGE_SIZE,
  );
  const examinationsSelect = fetchClinicalExaminationsWithTotals(
    id,
    examPage,
    EXAMINATIONS_SECTION_PAGE_SIZE,
  );

  return (
    <>
      <div className='mb-6 z-50'>
        <PetSectionNav petId={id} />
      </div>
      <div className='space-y-8'>
        <Suspense fallback={<VaccinationsSkeleton />}>
          <VaccinationsSection
            query={vaccinationsSelect}
            currentPage={vaxPage}
            pageSize={VAX_SECTION_PAGE_SIZE}
            petId={id}
          />
        </Suspense>

        <Suspense fallback={<EchinococcusTreatmentSkeleton />}>
          <EchinococcusTreatmentSection
            query={echinococcusSelect}
            currentPage={echPage}
            pageSize={ECHINOCOCCUS_SECTION_PAGE_SIZE}
            petId={id}
          />
        </Suspense>

        <Suspense fallback={<GeneralParasiteTreatmentSkeleton />}>
          <GeneralParasiteTreatmentSection
            query={generalParasiteSelect}
            currentPage={parPage}
            pageSize={GENERAL_PARASITE_SECTION_PAGE_SIZE}
            petId={id}
          />
        </Suspense>

        <Suspense fallback={<ClinicalExaminationsSkeleton />}>
          <ClinicalExaminationsSection
            query={examinationsSelect}
            currentPage={examPage}
            pageSize={EXAMINATIONS_SECTION_PAGE_SIZE}
            petId={id}
          />
        </Suspense>
      </div>
    </>
  );
}
