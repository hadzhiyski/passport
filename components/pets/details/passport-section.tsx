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
          <div className='bg-primary/10 text-primary p-3 rounded-full mb-3'>
            <BookIcon className='h-6 w-6' />
          </div>
          <h3 className='font-medium text-card-foreground mb-2'>
            No Passport Registered
          </h3>
          <p className='text-muted-foreground mb-4'>
            Register a passport to make traveling with your pet easier.
          </p>
          <Button variant='outline' className='text-primary border-primary/20'>
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
            <div className='p-4 rounded-lg border border-border bg-card/50 shadow-sm'>
              <div className='flex items-center gap-4 mb-3'>
                <div className='bg-primary/10 text-primary p-3 rounded-lg'>
                  <BookIcon className='h-6 w-6' />
                </div>
                <div>
                  <div className='text-sm text-muted-foreground'>
                    Passport Number
                  </div>
                  <div className='text-lg font-semibold text-card-foreground'>
                    {passport.serialNumber || 'N/A'}
                  </div>
                </div>
              </div>

              <div>
                <div className='text-sm text-muted-foreground mb-1'>
                  Issued On
                </div>
                <div className='text-card-foreground font-medium'>
                  {passport.issueDate
                    ? format(passport.issueDate, 'MMM d, yyyy')
                    : 'N/A'}
                </div>
              </div>
            </div>

            <div className='p-4 rounded-lg border border-border bg-card/50 shadow-sm'>
              <div className='text-sm text-muted-foreground mb-3'>
                Marking of Animal
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground capitalize'>
                    {passport.marking?.type || 'marking'} &#35;
                  </span>
                  <span className='text-card-foreground font-medium font-mono'>
                    {passport.marking?.code || 'Not available'}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground capitalize'>
                    Date of application
                  </span>
                  <span className='text-card-foreground font-medium'>
                    {passport.marking?.applicationDate
                      ? format(passport.marking.applicationDate, 'MMM d, yyyy')
                      : 'Not available'}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground capitalize'>
                    Location
                  </span>
                  <span className='text-card-foreground font-medium capitalize'>
                    {passport.marking?.place || 'Not available'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-5'>
            <div>
              <div className='text-sm text-muted-foreground mb-3'>
                Issued By
              </div>
              <div className='flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50 shadow-sm'>
                <div className='bg-primary/10 text-primary p-2 rounded-full'>
                  <HeartPulseIcon className='h-5 w-5' />
                </div>
                <div>
                  <div className='text-card-foreground font-medium'>
                    {passport.vet.name}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Veterinarian
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className='text-sm text-muted-foreground mb-3'>
                Registered Owners
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50 shadow-sm'>
                  <div className='bg-primary/10 text-primary p-2 rounded-full'>
                    <UserIcon className='h-5 w-5' />
                  </div>
                  <div>
                    <div className='text-card-foreground font-medium'>
                      {passport.owner1.name}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Primary Owner
                    </div>
                  </div>
                </div>

                {passport.owner2?.id && (
                  <div className='flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50 shadow-sm'>
                    <div className='bg-primary/10 text-primary p-2 rounded-full'>
                      <UserPlusIcon className='h-5 w-5' />
                    </div>
                    <div>
                      <div className='text-card-foreground font-medium'>
                        {passport.owner2.name}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        Secondary Owner
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='pt-4 flex justify-end'>
          <Button
            variant='outline'
            size='sm'
            className='text-primary border-primary/20'
          >
            Edit Passport
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching passport data:', error);
    return (
      <div className='p-6 text-center border border-border rounded-lg bg-card/50'>
        <p className='text-muted-foreground'>
          There was a problem retrieving the passport information.
        </p>
      </div>
    );
  }
}
