import { Button } from '@passport/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@passport/components/ui/dropdown-menu';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export type AddHealthRecordButtonProps = { petId: string } & PropsWithChildren;
export function AddHealthRecordButton({
  children,
  petId,
}: AddHealthRecordButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='text-emerald-600 border-emerald-200'
        >
          {children}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/pets/${petId}/vaccinations/add`}>Vaccine</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/pets/${petId}/treatments/echinococcus/add`}>
            Anti-Echinococcus treatment
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/pets/${petId}/treatments/parasites/add`}>
            Anti-Parasite treatment
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
