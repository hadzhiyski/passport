import { Button } from '@passport/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@passport/components/ui/tabs';
import { BugIcon, ClipboardIcon, ShieldIcon } from 'lucide-react';
import { Suspense } from 'react';
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
      <TabsList className='w-full grid grid-cols-2 bg-slate-50 border-b border-slate-100 rounded-none p-0'>
        <TabsTrigger
          value='vaccinations'
          className='py-3 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none'
        >
          <ShieldIcon className='h-4 w-4 mr-2' />
          Vaccinations
        </TabsTrigger>
        <TabsTrigger
          value='parasite'
          className='py-3 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none'
        >
          <BugIcon className='h-4 w-4 mr-2' />
          Anti-Parasite
        </TabsTrigger>
      </TabsList>

      <TabsContent value='vaccinations' className='p-0 mt-0' id='vaccinations'>
        <div className='p-6'>
          <Suspense fallback={<VaccinationsLoadingSkeleton />}>
            <VaccinationsSection petId={id} page={vaxPage} />
          </Suspense>
        </div>
      </TabsContent>

      <TabsContent value='parasite' className='p-0 mt-0' id='parasite'>
        <div className='p-6'>
          <Suspense fallback={<ParasiteTreatmentLoadingSkeleton />}>
            <div className='flex flex-col items-center text-center p-6'>
              <div className='bg-blue-100 text-blue-600 p-3 rounded-full mb-3'>
                <ClipboardIcon className='h-6 w-6' />
              </div>
              <h3 className='font-medium text-blue-900 mb-2'>
                Anti-Parasite Treatment
              </h3>
              <p className='text-blue-700 mb-4'>
                Coming soon - record flea, tick, and worming treatments
              </p>
              <Button
                variant='outline'
                className='bg-white text-blue-600 border-blue-200'
                disabled
              >
                Add Treatment
              </Button>
            </div>
          </Suspense>
        </div>
      </TabsContent>
    </Tabs>
  );
}
