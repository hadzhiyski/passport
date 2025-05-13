import { Button } from '@passport/components/ui/button';
import { Separator } from '@passport/components/ui/separator';
import { cn } from '@passport/lib/utils';
import { format } from 'date-fns';
import {
  ChevronRightIcon,
  HeartPulseIcon,
  NotebookText,
  QrCodeIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';

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
  petId: string;
  query: Promise<PassportProps[]>;
}

export async function PassportSection({ petId, query }: PassportSectionProps) {
  try {
    const passportSelect = await query;

    if (passportSelect.length === 0) {
      return (
        <div className='flex flex-col items-center text-center p-4'>
          <div className='bg-primary/10 text-primary p-2.5 rounded-full mb-3'>
            <NotebookText className='h-5 w-5' />
          </div>
          <h3 className='font-medium text-card-foreground mb-2'>
            No Passport Registered
          </h3>
          <p className='text-muted-foreground mb-3 text-sm'>
            Register a passport to make traveling with your pet easier.
          </p>
          <Button
            variant='outline'
            size='sm'
            className='text-primary border-primary/20'
            asChild
          >
            <Link href={`/pets/${petId}/passports/add`}>Register Passport</Link>
          </Button>
        </div>
      );
    }

    const passport = passportSelect[0];

    const passportLabel = passport.serialNumber || 'N/A';
    const passportIssueDate = passport.issueDate
      ? format(passport.issueDate, 'MMM d, yyyy')
      : 'Issue date N/A';

    return (
      <div className='space-y-4 text-sm'>
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <div className='flex items-center gap-2 text-card-foreground font-semibold'>
              <QrCodeIcon className='h-4 w-4 text-primary' />
              <span>Passport No.</span>
            </div>
          </div>
          <div className='mt-1.5 font-mono font-medium'>{passportLabel}</div>
          <div className='text-xs text-muted-foreground mt-1'>
            Issued: {passportIssueDate}
          </div>
        </div>

        <Separator />

        <div>
          <div className='font-semibold mb-2'>Animal Identification</div>
          <div className='space-y-2 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground capitalize'>
                {passport.marking?.type || 'Marking'} #
              </span>
              <span className='font-medium font-mono'>
                {passport.marking?.code || 'Not available'}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Applied on</span>
              <span className='font-medium'>
                {passport.marking?.applicationDate
                  ? format(passport.marking.applicationDate, 'MMM d, yyyy')
                  : 'Not available'}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Location</span>
              <span className='font-medium capitalize'>
                {passport.marking?.place || 'Not available'}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <div className='font-semibold mb-2 flex items-center gap-2'>
            <HeartPulseIcon className='h-3.5 w-3.5 text-primary' />
            Veterinarian
          </div>
          <div className='px-1 py-1.5'>
            <div className='font-medium'>{passport.vet.name}</div>
            <div className='text-xs text-muted-foreground'>
              Issuing authority
            </div>
          </div>
        </div>

        <div>
          <div className='font-semibold mb-2 flex items-center gap-2'>
            <UserIcon className='h-3.5 w-3.5 text-primary' />
            Registered Owners
          </div>

          <div className='space-y-2'>
            <div
              className={cn(
                'px-1 py-1.5 rounded-md',
                passport.owner2?.id && 'bg-primary/5',
              )}
            >
              <div className='font-medium'>{passport.owner1.name}</div>
              <div className='text-xs text-muted-foreground'>Primary owner</div>
            </div>

            {passport.owner2?.id && (
              <div className='px-1 py-1.5 rounded-md'>
                <div className='font-medium'>{passport.owner2.name}</div>
                <div className='text-xs text-muted-foreground'>
                  Secondary owner
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='pt-2'>
          <Button
            variant='outline'
            size='sm'
            className='w-full text-primary border-primary/20 flex items-center justify-center gap-1.5 text-xs'
            asChild
          >
            <Link href={`/pets/${passport.id}/passport`}>
              View Complete Passport
              <ChevronRightIcon className='h-3 w-3' />
            </Link>
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching passport data:', error);
    return (
      <div className='p-4 text-center border border-border rounded-lg bg-card/50'>
        <p className='text-muted-foreground text-sm'>
          There was a problem retrieving the passport information.
        </p>
      </div>
    );
  }
}
