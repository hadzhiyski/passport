'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@passport/components/ui/pagination';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface VaccinePaginationProps {
  currentPage: number;
  totalPages: number;
  paramName?: string;
  anchorId?: string;
}

export function VaccinePagination({
  currentPage,
  totalPages,
  paramName = 'vpage',
  anchorId,
}: VaccinePaginationProps) {
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

    // Manually scroll to the anchor if needed
    if (anchorId) {
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <Pagination className='mt-6'>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(currentPage - 1);
              }}
              href='#'
            />
          </PaginationItem>
        )}

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

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(currentPage + 1);
              }}
              href='#'
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
