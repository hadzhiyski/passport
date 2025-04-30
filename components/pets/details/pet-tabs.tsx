import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@passport/components/ui/tabs';
import { db } from '@passport/database';
import { antiEchinococcusTreatmentsTable } from '@passport/database/schema/anti-echinococcus-treatments';
import { antiParasiteTreatmentsTable } from '@passport/database/schema/anti-parasite-treatments';
import { vaccinationsTable } from '@passport/database/schema/vaccinations';
import { veterinariansTable } from '@passport/database/schema/veterinarians';
import { desc, eq } from 'drizzle-orm';
import { BugIcon, ShieldIcon, ZapIcon } from 'lucide-react';
import { Suspense } from 'react';
import { EchinococcusTreatmentSection } from './echinococcus-treatment-section';
import { GeneralParasiteTreatmentSection } from './general-parasite-treatment-section';
import { ParasiteTreatmentLoadingSkeleton } from './parasite-treatments-loading';
import { VaccinationsLoadingSkeleton } from './vaccinations-loading';
import { VaccinationsSection } from './vaccinations-section';

export interface PetTabsProps {
  petId: string;
  vaxSectionPage: number;
  echinoSectionPage: number;
  parasiteSectionPage: number;
}

const VAX_SECTION_PAGE_SIZE = 3;
const ECHINOCOCCUS_SECTION_PAGE_SIZE = 3;
const GENERAL_PARASITE_SECTION_PAGE_SIZE = 3;

export function PetTabs({
  petId,
  vaxSectionPage,
  echinoSectionPage,
  parasiteSectionPage,
}: PetTabsProps) {
  const vaccinationsSelect = Promise.all([
    db.$count(vaccinationsTable, eq(vaccinationsTable.petId, petId)),
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
      .where(eq(vaccinationsTable.petId, petId))
      .orderBy(desc(vaccinationsTable.validUntil), desc(vaccinationsTable.id))
      .offset((vaxSectionPage - 1) * VAX_SECTION_PAGE_SIZE)
      .limit(VAX_SECTION_PAGE_SIZE),
  ]).then(([total, vaccinations]) => ({
    total,
    vaccinations,
  }));

  const echinococcusSelect = Promise.all([
    db.$count(
      antiEchinococcusTreatmentsTable,
      eq(antiEchinococcusTreatmentsTable.petId, petId),
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
      .leftJoin(
        veterinariansTable,
        eq(
          antiEchinococcusTreatmentsTable.administeredBy,
          veterinariansTable.id,
        ),
      )
      .where(eq(antiEchinococcusTreatmentsTable.petId, petId))
      .orderBy(desc(antiEchinococcusTreatmentsTable.administeredOn))
      .offset((echinoSectionPage - 1) * ECHINOCOCCUS_SECTION_PAGE_SIZE)
      .limit(ECHINOCOCCUS_SECTION_PAGE_SIZE),
  ]).then(([total, treatments]) => ({
    total,
    treatments,
  }));

  const generalParasiteSelect = Promise.all([
    db.$count(
      antiParasiteTreatmentsTable,
      eq(antiParasiteTreatmentsTable.petId, petId),
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
      .leftJoin(
        veterinariansTable,
        eq(antiParasiteTreatmentsTable.administeredBy, veterinariansTable.id),
      )
      .where(eq(antiParasiteTreatmentsTable.petId, petId))
      .orderBy(desc(antiParasiteTreatmentsTable.administeredOn))
      .offset((parasiteSectionPage - 1) * GENERAL_PARASITE_SECTION_PAGE_SIZE)
      .limit(GENERAL_PARASITE_SECTION_PAGE_SIZE),
  ]).then(([total, treatments]) => ({
    total,
    treatments,
  }));

  return (
    <Tabs defaultValue='vaccinations' className='w-full'>
      <TabsList className='w-full flex items-center justify-start flex-wrap h-auto space-y-1'>
        <TabsTrigger value='vaccinations' className='mr-3'>
          <ShieldIcon className='h-4 w-4 mr-2' />
          Vaccinations
        </TabsTrigger>
        <TabsTrigger value='echinococcus' className='mr-3'>
          <ZapIcon className='h-4 w-4 mr-2' />
          Anti-Echinococcus
        </TabsTrigger>
        <TabsTrigger value='parasite'>
          <BugIcon className='h-4 w-4 mr-2' />
          Anti-Parasite
        </TabsTrigger>
      </TabsList>

      <TabsContent value='vaccinations' className='p-0 mt-0' id='vaccinations'>
        <div className='p-4'>
          <Suspense fallback={<VaccinationsLoadingSkeleton />}>
            <VaccinationsSection
              query={vaccinationsSelect}
              currentPage={vaxSectionPage}
              pageSize={VAX_SECTION_PAGE_SIZE}
            />
          </Suspense>
        </div>
      </TabsContent>

      <TabsContent value='echinococcus' className='p-0 mt-0' id='echinococcus'>
        <div className='p-4'>
          <Suspense fallback={<ParasiteTreatmentLoadingSkeleton />}>
            <EchinococcusTreatmentSection
              query={echinococcusSelect}
              currentPage={echinoSectionPage}
              pageSize={ECHINOCOCCUS_SECTION_PAGE_SIZE}
            />
          </Suspense>
        </div>
      </TabsContent>

      <TabsContent value='parasite' className='p-0 mt-0' id='parasite'>
        <div className='p-4'>
          <Suspense fallback={<ParasiteTreatmentLoadingSkeleton />}>
            <GeneralParasiteTreatmentSection
              query={generalParasiteSelect}
              currentPage={parasiteSectionPage}
              pageSize={GENERAL_PARASITE_SECTION_PAGE_SIZE}
            />
          </Suspense>
        </div>
      </TabsContent>
    </Tabs>
  );
}
