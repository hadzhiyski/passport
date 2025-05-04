import { Button } from '@passport/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@passport/components/ui/dropdown-menu';
import { ChevronDown, Filter } from 'lucide-react';
import Link from 'next/link';

// Define constants once
const FILTER_STATUS_VALUES = [
  'all',
  'needs-attention',
  'expiring-soon',
] as const;
const FILTER_SPECIES_VALUES = ['all', 'dog', 'cat'] as const;

// Derive union types from constants
type FilterStatus = (typeof FILTER_STATUS_VALUES)[number];
type FilterSpecies = (typeof FILTER_SPECIES_VALUES)[number];

export interface FilterOptionsProps {
  status: string; // 'all' | 'needs-attention' | 'expiring-soon'
  species: string; // 'all' | 'dog' | 'cat'
  pageQuery: Record<string, string | string[] | undefined>;
}

// Type guards to validate props
const isValidFilterStatus = (value: string): value is FilterStatus => {
  return FILTER_STATUS_VALUES.includes(value as FilterStatus);
};

const isValidFilterSpecies = (value: string): value is FilterSpecies => {
  return FILTER_SPECIES_VALUES.includes(value as FilterSpecies);
};

export function FilterOptions({
  status: initialStatus,
  species: initialSpecies,
  pageQuery,
}: FilterOptionsProps) {
  // Validate status and species
  let statusValue = initialStatus;
  let speciesValue = initialSpecies;

  if (!isValidFilterStatus(statusValue)) {
    console.error(
      `Invalid status value: ${statusValue}. Expected one of: ${FILTER_STATUS_VALUES.join(', ')}`,
    );
    // Fallback to 'all' if invalid
    statusValue = 'all';
  }

  if (!isValidFilterSpecies(speciesValue)) {
    console.error(
      `Invalid species value: ${speciesValue}. Expected one of: ${FILTER_SPECIES_VALUES.join(', ')}`,
    );
    // Fallback to 'all' if invalid
    speciesValue = 'all';
  }

  const status = statusValue as FilterStatus;
  const species = speciesValue as FilterSpecies;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          <Filter className='h-4 w-4 mr-2' />
          Filters
          {(status !== 'all' || species !== 'all') && (
            <span className='ml-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center'>
              {(status !== 'all' ? 1 : 0) + (species !== 'all' ? 1 : 0)}
            </span>
          )}
          <ChevronDown className='h-4 w-4 ml-2' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px]'>
        <div className='p-2'>
          <p className='text-xs font-medium mb-2'>Status</p>
          <div className='space-y-1'>
            <Link
              href={{ query: { ...pageQuery, status: 'all', species } }}
              className={`block px-2 py-1 text-sm rounded-md ${
                status === 'all' ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              All
            </Link>
            <Link
              href={{
                query: { ...pageQuery, status: 'needs-attention', species },
              }}
              className={`block px-2 py-1 text-sm rounded-md ${
                status === 'needs-attention' ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              Needs attention
            </Link>
            <Link
              href={{
                query: { ...pageQuery, status: 'expiring-soon', species },
              }}
              className={`block px-2 py-1 text-sm rounded-md ${
                status === 'expiring-soon' ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              Expiring soon
            </Link>
          </div>
        </div>
        <div className='border-t my-1'></div>
        <div className='p-2'>
          <p className='text-xs font-medium mb-2'>Species</p>
          <div className='space-y-1'>
            <Link
              href={{ query: { ...pageQuery, status, species: 'all' } }}
              className={`block px-2 py-1 text-sm rounded-md ${
                species === 'all' ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              All
            </Link>
            <Link
              href={{ query: { ...pageQuery, status, species: 'dog' } }}
              className={`block px-2 py-1 text-sm rounded-md ${
                species === 'dog' ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              Dogs
            </Link>
            <Link
              href={{ query: { ...pageQuery, status, species: 'cat' } }}
              className={`block px-2 py-1 text-sm rounded-md ${
                species === 'cat' ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              Cats
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
