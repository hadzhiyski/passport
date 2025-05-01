'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@passport/components/ui/breadcrumb';
import { cn } from '@passport/lib/utils';
import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Fragment, useMemo } from 'react';

// Enhanced breadcrumb name mapping
export const breadcrumbNameMap: Record<string, string> = {
  // Main sections
  '/': 'Home',
  '/pets': 'Pets',
  '/pets/[id]': 'Pet Details',
  '/settings': 'Settings',
  '/account': 'Account',
  '/feedback': 'Feedback',
  '/treatments': 'Treatments',
  '/treatments/echinococcus/[id]': 'Echinococcus Treatment',
  '/treatments/parasites/[id]': 'Parasite Treatment',
};

export function getBreadcrumbName(path: string, segment: string): string {
  // Check for exact path match first
  if (breadcrumbNameMap[path]) {
    return breadcrumbNameMap[path];
  }

  // Check for pattern matches
  for (const [pattern, name] of Object.entries(breadcrumbNameMap)) {
    if (
      pattern.includes('[id]') &&
      path.match(new RegExp(pattern.replace('[id]', '[^/]+')))
    ) {
      return name;
    }
  }

  // Default formatting for the segment
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function AppBreadcrumbList({ className }: { className?: string }) {
  const pathname = usePathname();

  // Extract potential anchor from URL to show in breadcrumb
  const hash = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash;
    }
    return '';
  }, []);

  const segments = pathname.split('/').filter(Boolean);
  const hashSegment = hash?.substring(1); // Remove the # character

  // Handle empty path (homepage)
  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList className={cn('font-medium', className)}>
          <BreadcrumbItem>
            <BreadcrumbPage className='flex items-center gap-1.5'>
              <Home size={16} />
              <span>Home</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className={cn('font-medium', className)}>
        <BreadcrumbItem>
          <BreadcrumbLink
            href='/'
            className='flex items-center gap-1.5 hover:text-primary transition-colors'
          >
            <Home size={16} />
            <span>Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const segmentPath = `/${segments.slice(0, index + 1).join('/')}`;
          const isLastSegment = index === segments.length - 1;
          const displayName = getBreadcrumbName(segmentPath, segment);

          return (
            <Fragment key={segmentPath}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLastSegment ? (
                  <BreadcrumbPage className='text-primary'>
                    {displayName}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={segmentPath}
                    className='hover:text-primary transition-colors'
                  >
                    {displayName}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}

        {/* Show section anchors in breadcrumb if present */}
        {hashSegment && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-primary'>
                {hashSegment
                  .replace(/[-_]/g, ' ')
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
