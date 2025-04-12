import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@passport/components/ui/tabs';
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

export function PetTabs({
  petId,
  vaxSectionPage,
  echinoSectionPage,
  parasiteSectionPage,
}: PetTabsProps) {
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
            <VaccinationsSection petId={petId} page={vaxSectionPage} />
          </Suspense>
        </div>
      </TabsContent>

      <TabsContent value='echinococcus' className='p-0 mt-0' id='echinococcus'>
        <div className='p-4'>
          <Suspense fallback={<ParasiteTreatmentLoadingSkeleton />}>
            <EchinococcusTreatmentSection
              petId={petId}
              page={echinoSectionPage}
            />
          </Suspense>
        </div>
      </TabsContent>

      <TabsContent value='parasite' className='p-0 mt-0' id='parasite'>
        <div className='p-4'>
          <Suspense fallback={<ParasiteTreatmentLoadingSkeleton />}>
            <GeneralParasiteTreatmentSection
              petId={petId}
              page={parasiteSectionPage}
            />
          </Suspense>
        </div>
      </TabsContent>
    </Tabs>
  );
}
