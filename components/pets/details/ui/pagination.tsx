'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@passport/components/ui/pagination';
import { cn } from '@passport/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface PetSectionPaginationProps {
  currentPage: number;
  totalPages: number;
  paramName: string;
  anchorId: string;
}

export function PetSectionPagination({
  currentPage,
  totalPages,
  paramName,
  anchorId,
}: PetSectionPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handlePageClick = (newPage: number) => {
    const url = `${pathname}?${createQueryString(paramName, newPage.toString())}${anchorId ? `#${anchorId}` : ''}`;
    router.push(url, { scroll: false });

    if (anchorId) {
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return totalPages > 1 ? (
    <Pagination className='mt-6'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn({
              'pointer-events-none': currentPage === 1,
              'opacity-50': currentPage === 1,
            })}
            tabIndex={currentPage === 1 ? -1 : undefined}
            aria-disabled={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                handlePageClick(currentPage - 1);
              }
            }}
            href='#'
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(index + 1);
              }}
              href='#'
              isActive={currentPage === index + 1}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            className={cn({
              'pointer-events-none': currentPage >= totalPages,
              'opacity-50': currentPage >= totalPages,
            })}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            aria-disabled={currentPage >= totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                handlePageClick(currentPage + 1);
              }
            }}
            href='#'
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ) : null;
}
