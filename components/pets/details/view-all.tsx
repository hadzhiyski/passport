'use client';

import { Button } from '@passport/components/ui/button';
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

  // Create URL based on next view state
  const url = useMemo(() => {
    if (!isViewingAll) {
      // Going to "all" mode
      return `?${param}=all#${anchor}`;
    }

    // Going to paginated mode
    // Create a new URLSearchParams only when needed
    const otherParams = Array.from(searchParams.entries()).filter(
      ([key]) => key !== param,
    );

    if (otherParams.length === 0) {
      // No other params, use explicit page=1 to ensure URL change
      return `?${param}=1#${anchor}`;
    }

    // Keep other existing params
    const newParams = new URLSearchParams(otherParams);
    return `?${newParams.toString()}#${anchor}`;
  }, [param, isViewingAll, anchor, searchParams]);

  const icon = isViewingAll ? <Minimize2 /> : <Maximize2 />;
  const label = isViewingAll ? 'Show paginated view' : 'Show all items';

  return (
    <Button asChild variant='ghost' aria-label={label} title={label}>
      <Link href={url}>{icon}</Link>
    </Button>
  );
}
