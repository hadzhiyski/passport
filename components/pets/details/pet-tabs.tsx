import { Button } from '@passport/components/ui/button';
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
  id: string;
  vaxPage: number;
}

export function PetTabs({ id, vaxPage }: PetTabsProps) {
  return (
    <Tabs defaultValue='vaccinations' className='w-full'>
      <TabsList className='w-full grid grid-cols-3'>
        <TabsTrigger value='vaccinations'>
          <ShieldIcon className='h-4 w-4 mr-2' />
          Vaccinations
        </TabsTrigger>
        <TabsTrigger value='echinococcus'>
          <ZapIcon className='h-4 w-4 mr-2' />
          Anti-Echinococcus
        </TabsTrigger>
        <TabsTrigger value='parasite'>
          <BugIcon className='h-4 w-4 mr-2' />
          Anti-Parasite
        </TabsTrigger>
      </TabsList>

      <TabsContent value='vaccinations' className='p-0 mt-0' id='vaccinations'>
        <div className='p-6'>
          <Suspense fallback={<VaccinationsLoadingSkeleton />}>
            <div className='flex justify-between items-center mb-5'>
              <h3 className='text-sm font-medium text-slate-700'>
                Vaccination Records
              </h3>
              <Button
                variant='outline'
                size='sm'
                className='text-blue-600 border-blue-200'
              >
                Add Vaccination
              </Button>
            </div>
            <VaccinationsSection petId={id} page={vaxPage} />
          </Suspense>
        </div>
      </TabsContent>

      <TabsContent value='echinococcus' className='p-0 mt-0' id='echinococcus'>
        <div className='p-6'>
          <Suspense fallback={<ParasiteTreatmentLoadingSkeleton />}>
            <div className='flex justify-between items-center mb-5'>
              <h3 className='text-sm font-medium text-slate-700'>
                Echinococcus Treatments
              </h3>
              <Button
                variant='outline'
                size='sm'
                className='text-orange-600 border-orange-200'
              >
                Add Treatment
              </Button>
            </div>
            <EchinococcusTreatmentSection petId={id} />
          </Suspense>
        </div>
      </TabsContent>

      <TabsContent value='parasite' className='p-0 mt-0' id='parasite'>
        <div className='p-6'>
          <Suspense fallback={<ParasiteTreatmentLoadingSkeleton />}>
            <div className='flex justify-between items-center mb-5'>
              <h3 className='text-sm font-medium text-slate-700'>
                General Anti-Parasite Treatments
              </h3>
              <Button
                variant='outline'
                size='sm'
                className='text-amber-600 border-amber-200'
              >
                Add Treatment
              </Button>
            </div>
            <GeneralParasiteTreatmentSection petId={id} />
          </Suspense>
        </div>
      </TabsContent>
    </Tabs>
  );
}
