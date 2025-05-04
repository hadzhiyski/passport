'use client';

import { Button } from '@passport/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@passport/components/ui/tooltip';
import { Maximize2, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export interface ViewAllProps {
  param: string;
  value: number | 'all';
  anchor: string;
}

export function ViewAll({ param, value, anchor }: ViewAllProps) {
  const searchParams = useSearchParams();
  const isViewingAll = value === 'all';

  const url = useMemo(() => {
    if (!isViewingAll) {
      return `?${param}=all#${anchor}`;
    }

    const otherParams = Array.from(searchParams.entries()).filter(
      ([key]) => key !== param,
    );

    if (otherParams.length === 0) {
      return `?${param}=1#${anchor}`;
    }

    const newParams = new URLSearchParams(otherParams);
    return `?${newParams.toString()}#${anchor}`;
  }, [param, isViewingAll, anchor, searchParams]);

  const icon = isViewingAll ? (
    <Minimize2 className='h-4 w-4' />
  ) : (
    <Maximize2 className='h-4 w-4' />
  );
  const label = isViewingAll ? 'Show paginated view' : 'Show all items';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          asChild
          variant='ghost'
          size='sm'
          aria-label={label}
          className='flex items-center'
        >
          <Link href={url}>{icon}</Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
