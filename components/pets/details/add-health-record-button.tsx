import { Button } from '@passport/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@passport/components/ui/dropdown-menu';
import { PropsWithChildren } from 'react';

export type AddHealthRecordButtonProps = {} & PropsWithChildren;
export function AddHealthRecordButton({
  children,
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
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Add Health Record</DropdownMenuLabel>
        <DropdownMenuItem>Vaccine</DropdownMenuItem>
        <DropdownMenuItem>Anti-Ecinococcus treatment</DropdownMenuItem>
        <DropdownMenuItem>Anti-Paraiste treatment</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
