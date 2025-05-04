import { Button } from '@passport/components/ui/button';
import { PawPrintIcon, PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';

export interface NoPetsProps {
  hasSearch: boolean;
}

export function NoPets({ hasSearch }: NoPetsProps) {
  return (
    <div className='rounded-xl border border-border p-8 text-center'>
      <div className='bg-primary/10 text-primary p-3 rounded-full w-fit mx-auto mb-4'>
        <PawPrintIcon className='h-6 w-6' />
      </div>
      <h2 className='text-xl font-semibold text-foreground mb-2'>
        {hasSearch ? 'No pets match your search' : 'No pets found'}
      </h2>
      <p className='text-muted-foreground mb-6'>
        {hasSearch
          ? 'Try a different search term or clear your filters'
          : "You haven't added any pets to your account yet."}
      </p>
      {!hasSearch ? (
        <Button asChild>
          <Link href='/pets/add'>
            <PlusCircleIcon className='h-5 w-5 mr-2' />
            Add Your First Pet
          </Link>
        </Button>
      ) : (
        <Button asChild variant='outline'>
          <Link href='/pets'>Clear filters</Link>
        </Button>
      )}
    </div>
  );
}
