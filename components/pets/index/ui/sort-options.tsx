import { Button } from '@passport/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@passport/components/ui/dropdown-menu';
import { Check, ChevronDown, SortDesc } from 'lucide-react';
import Link from 'next/link';

// Define constants once
const SORT_OPTIONS = ['name', 'age-asc', 'age-desc', 'attention'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

// Type guard to validate sort value
const isValidSortOption = (value: string): value is SortOption => {
  return SORT_OPTIONS.includes(value as SortOption);
};

export interface SortOptionsProps {
  sort: string; // 'name' | 'age-asc' | 'age-desc' | 'attention'
  pageQuery: Record<string, string | string[] | undefined>;
}

export function SortOptions({
  sort: initialSort,
  pageQuery,
}: SortOptionsProps) {
  // Validate sort option
  let sortValue = initialSort;

  if (!isValidSortOption(sortValue)) {
    console.error(
      `Invalid sort value: ${sortValue}. Expected one of: ${SORT_OPTIONS.join(', ')}`,
    );
    // Fallback to 'name' if invalid
    sortValue = 'name';
  }

  const sort = sortValue as SortOption;

  // Preserve search query and filters in sort links
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          <SortDesc className='h-4 w-4 mr-2' />
          Sort
          {sort !== 'name' && (
            <span className='ml-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center'>
              <Check className='h-3 w-3' />
            </span>
          )}
          <ChevronDown className='h-4 w-4 ml-2' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <Link href={{ query: { ...pageQuery, sort: 'name' } }}>
          <DropdownMenuItem
            className={sort === 'name' ? 'bg-primary/10 text-primary' : ''}
          >
            <span className='flex items-center justify-between w-full'>
              Name
              {sort === 'name' && <Check className='h-4 w-4 text-primary' />}
            </span>
          </DropdownMenuItem>
        </Link>
        <Link href={{ query: { ...pageQuery, sort: 'age-asc' } }}>
          <DropdownMenuItem
            className={sort === 'age-asc' ? 'bg-primary/10 text-primary' : ''}
          >
            <span className='flex items-center justify-between w-full'>
              Age (youngest first)
              {sort === 'age-asc' && <Check className='h-4 w-4 text-primary' />}
            </span>
          </DropdownMenuItem>
        </Link>
        <Link href={{ query: { ...pageQuery, sort: 'age-desc' } }}>
          <DropdownMenuItem
            className={sort === 'age-desc' ? 'bg-primary/10 text-primary' : ''}
          >
            <span className='flex items-center justify-between w-full'>
              Age (oldest first)
              {sort === 'age-desc' && (
                <Check className='h-4 w-4 text-primary' />
              )}
            </span>
          </DropdownMenuItem>
        </Link>
        <Link href={{ query: { ...pageQuery, sort: 'attention' } }}>
          <DropdownMenuItem
            className={sort === 'attention' ? 'bg-primary/10 text-primary' : ''}
          >
            <span className='flex items-center justify-between w-full'>
              Needs attention first
              {sort === 'attention' && (
                <Check className='h-4 w-4 text-primary' />
              )}
            </span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
