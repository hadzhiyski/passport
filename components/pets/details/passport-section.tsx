import { Badge } from '@passport/components/ui/badge';
import { Button } from '@passport/components/ui/button';
import { format } from 'date-fns';
import { BookIcon, HeartPulseIcon, UserIcon, UserPlusIcon } from 'lucide-react';

export type PassportProps = {
  id: string;
  serialNumber: string;
  issueDate: Date | null;
  marking: {
    code: string | null;
    type: string | null;
    place: string | null;
    applicationDate: Date | null;
  } | null;
  owner1: {
    id: string;
    name: string;
  };
  owner2: {
    id: string;
    name: string;
  } | null;
  vet: {
    id: string;
    name: string;
  };
};

export interface PassportSectionProps {
  query: Promise<PassportProps[]>;
}

export async function PassportSection({ query }: PassportSectionProps) {
  const passportSelect = await query;
  try {
    if (passportSelect.length === 0) {
      return (
        <div className='flex flex-col items-center text-center p-6'>
          <div className='bg-blue-100 text-blue-600 p-3 rounded-full mb-3'>
            <BookIcon className='h-6 w-6' />
          </div>
          <h3 className='font-medium text-blue-900 mb-2'>
            No Passport Registered
          </h3>
          <p className='text-blue-700 mb-4'>
            Register a passport to make traveling with your pet easier.
          </p>
          <Button variant='outline' className='text-blue-600 border-blue-200'>
            Register Passport
          </Button>
        </div>
      );
    }

    const passport = passportSelect[0];

    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-5'>
            <div className='flex items-center gap-4'>
              <div className='bg-blue-100 text-blue-600 p-3 rounded-lg'>
                <BookIcon className='h-8 w-8' />
              </div>
              <div>
                <div className='text-sm text-slate-500'>Passport Number</div>
                <div className='text-lg font-semibold text-slate-900'>
                  {passport.serialNumber || 'N/A'}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-sm text-slate-500'>Issued On</div>
                <div className='text-slate-700 font-medium'>
                  {passport.issueDate
                    ? format(passport.issueDate, 'MMM d, yyyy')
                    : 'N/A'}
                </div>
              </div>
            </div>

            <div className='pt-2'>
              <div className='text-sm text-slate-500'>Marking of Animal</div>
              <div className='mt-2 space-y-1'>
                <div className='flex justify-between'>
                  <span className='text-slate-600 capitalize'>
                    {passport.marking?.type || 'marking'} &#35;:
                  </span>
                  <span className='text-slate-900 font-medium font-mono'>
                    {passport.marking?.code || 'Not available'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-slate-600 capitalize'>
                    Date of application:
                  </span>
                  <span className='text-slate-900 font-medium font-mono'>
                    {passport.marking?.applicationDate
                      ? format(passport.marking.applicationDate, 'MMM d, yyyy')
                      : 'Not available'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-slate-600 capitalize'>Location:</span>
                  <span className='text-slate-900 font-medium font-mono capitalize'>
                    {passport.marking?.place || 'Not available'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-5'>
            <div>
              <div className='text-sm text-slate-500 mb-3'>Issued By</div>
              <div className='flex items-center gap-3  p-3 rounded-lg border border-slate-100'>
                <div className='bg-emerald-100 text-emerald-600 p-2 rounded-full'>
                  <HeartPulseIcon className='h-5 w-5' />
                </div>
                <div>
                  <div className='text-slate-900 font-medium'>
                    {passport.vet.name}
                  </div>
                  <div className='text-xs text-slate-500'>Veterinarian</div>
                </div>
              </div>
            </div>

            <div>
              <div className='text-sm text-slate-500 mb-3'>
                Registered Owners
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-3  p-3 rounded-lg border border-slate-100'>
                  <div className='bg-blue-100 text-blue-600 p-2 rounded-full'>
                    <UserIcon className='h-5 w-5' />
                  </div>
                  <div>
                    <div className='text-slate-900 font-medium'>
                      {passport.owner1.name}
                    </div>
                    <div className='text-xs text-slate-500'>Primary Owner</div>
                  </div>
                </div>

                {passport.owner2?.id && (
                  <div className='flex items-center gap-3  p-3 rounded-lg border border-slate-100'>
                    <div className='bg-blue-100 text-blue-600 p-2 rounded-full'>
                      <UserPlusIcon className='h-5 w-5' />
                    </div>
                    <div>
                      <div className='text-slate-900 font-medium'>
                        {passport.owner2.name}
                      </div>
                      <div className='text-xs text-slate-500'>
                        Secondary Owner
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='pt-2 flex justify-end'>
          <Badge className='bg-blue-50 text-blue-700 border-blue-100'>
            European Union Pet Passport
          </Badge>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching passport data:', error);
    return (
      <div className='bg-red-50 text-red-700 p-4 rounded-lg border border-red-100'>
        <h3 className='font-medium mb-1'>Error loading passport</h3>
        <p className='text-sm'>
          There was a problem retrieving the passport information.
        </p>
      </div>
    );
  }
}
