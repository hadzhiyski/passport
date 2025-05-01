import { fetchClinicalExaminationsWithTotals } from '@passport/clinical-examinations/pet-details';
import { ClinicalExaminationsLoadingSkeleton } from '@passport/components/pets/details/clinical-examination-loading';
import { ClinicalExaminationsSection } from '@passport/components/pets/details/clinical-examinations-section';
import { EchinococcusTreatmentSection } from '@passport/components/pets/details/echinococcus-treatment-section';
import { GeneralParasiteTreatmentSection } from '@passport/components/pets/details/general-parasite-treatment-section';
import { ParasiteTreatmentLoadingSkeleton } from '@passport/components/pets/details/parasite-treatments-loading';
import { PassportLoadingSkeleton } from '@passport/components/pets/details/passport-loading';
import { PassportSection } from '@passport/components/pets/details/passport-section';
import { VaccinationsLoadingSkeleton } from '@passport/components/pets/details/vaccinations-loading';
import { VaccinationsSection } from '@passport/components/pets/details/vaccinations-section';
import { fetchPassport } from '@passport/passports/pet-details';
import { fetchAntiEchinococcusWithTotals } from '@passport/treatments/anti-echinococcus/pet-details';
import { fetchAntiParasitesWithTotals } from '@passport/treatments/anti-parasites/pet-details';
import { fetchVaccinationsWithTotals } from '@passport/vaccinations/pet-details';
import { BookIcon } from 'lucide-react';
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

  const passportSelect = fetchPassport(id);
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

      <Suspense fallback={<VaccinationsLoadingSkeleton />}>
        <VaccinationsSection
          query={vaccinationsSelect}
          currentPage={vaxPage}
          pageSize={VAX_SECTION_PAGE_SIZE}
        />
      </Suspense>
      <Suspense fallback={<ParasiteTreatmentLoadingSkeleton />}>
        <EchinococcusTreatmentSection
          query={echinococcusSelect}
          currentPage={echPage}
          pageSize={ECHINOCOCCUS_SECTION_PAGE_SIZE}
        />
      </Suspense>
      <Suspense fallback={<ParasiteTreatmentLoadingSkeleton />}>
        <GeneralParasiteTreatmentSection
          query={generalParasiteSelect}
          currentPage={parPage}
          pageSize={GENERAL_PARASITE_SECTION_PAGE_SIZE}
        />
      </Suspense>
      <Suspense fallback={<ClinicalExaminationsLoadingSkeleton />}>
        <ClinicalExaminationsSection
          query={examinationsSelect}
          currentPage={examPage}
          pageSize={EXAMINATIONS_SECTION_PAGE_SIZE}
        />
      </Suspense>
    </>
  );
}
