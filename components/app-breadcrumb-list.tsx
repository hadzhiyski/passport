'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@passport/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

export const breadcrumbNameMap: Record<string, string> = {
  // Main sections
  '/pets': 'Pets',

  // The key can also use a regex-like pattern match with '*'
  '/pets/[id]': 'Pet Details',
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

export function AppBreadcrumbList() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Handle empty path (homepage)
  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
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
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={segmentPath}>
                    {displayName}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
