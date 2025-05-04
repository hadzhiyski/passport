'use client';

import { Input } from '@passport/components/ui/input';
import { useDebounce } from '@passport/hooks/use-debounce';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchInputProps {
  defaultValue?: string;
  placeholder?: string;
  delay?: number;
}

export function SearchInput({
  defaultValue = '',
  placeholder = 'Search...',
  delay = 500,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, delay);

  // Update the URL when the debounced value changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedValue) {
      params.set('q', debouncedValue);
    } else {
      params.delete('q');
    }

    // Preserve existing search parameters
    const newUrl =
      pathname + (params.toString() ? `?${params.toString()}` : '');

    // Use replace to avoid adding to the history stack on each keystroke
    router.replace(newUrl, { scroll: false });
  }, [debouncedValue, pathname, router, searchParams]);

  return (
    <div className='relative flex-1'>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
      <Input
        type='search'
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='pl-10 w-full'
        role='searchbox'
        aria-label='Search by pet name or breed'
      />
    </div>
  );
}
