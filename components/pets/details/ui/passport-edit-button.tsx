'use client';

import { Button } from '@passport/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@passport/components/ui/tooltip';
import { EditIcon } from 'lucide-react';
import Link from 'next/link';

interface PassportEditButtonProps {
  petId: string;
}

export function PassportEditButton({ petId }: PassportEditButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground hover:text-primary'
            asChild
          >
            <Link
              href={`/pets/${petId}/passport/edit`}
              className='flex items-center gap-1.5'
            >
              <EditIcon className='h-4 w-4' />
              <span className='sr-only'>Edit</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit passport details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
