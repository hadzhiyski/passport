'use client';

import { Button } from '@passport/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
} from '@passport/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@passport/components/ui/popover';
import countriesData from '@passport/data/countries.json';
import { cn } from '@passport/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

export type Country = {
  name: string;
  emoji: string;
  alpha2: string;
  region: string;
};

interface CountrySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// Constants for virtualization
const ITEM_HEIGHT = 36; // Height of each country item in pixels
const VISIBLE_ITEMS = 8; // Number of items to render in the viewport

export function CountrySelector({
  value,
  onChange,
  disabled = false,
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (searchQuery.trim() === '') {
      return countriesData;
    }

    const searchLower = searchQuery.toLowerCase();
    return countriesData.filter((country) =>
      country.name.toLowerCase().includes(searchLower),
    );
  }, [searchQuery]);

  const selectedCountry = useMemo(
    () => countriesData.find((country) => country.alpha2 === value),
    [value],
  );

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
  };

  const handleSelect = (alpha2Code: string) => {
    onChange(alpha2Code);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSearchQuery(''); // Reset search when closing dropdown
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            !value && 'text-muted-foreground',
          )}
          disabled={disabled}
        >
          {selectedCountry ? (
            <span className='flex items-center gap-2'>
              <span className='text-lg'>{selectedCountry.emoji}</span>
              {selectedCountry.name}
            </span>
          ) : (
            'Select country...'
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-full p-0'
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        side='top'
        align='start'
        sideOffset={5}
      >
        <Command shouldFilter={false} className='overflow-hidden'>
          <CommandInput
            placeholder='Search country...'
            value={searchQuery}
            onValueChange={handleSearchChange}
            className='border-none focus:ring-0'
            autoFocus
          />
          <div className='overflow-hidden'>
            {filteredCountries.length === 0 ? (
              <CommandEmpty>No country found.</CommandEmpty>
            ) : (
              <List
                height={Math.min(
                  filteredCountries.length * ITEM_HEIGHT,
                  VISIBLE_ITEMS * ITEM_HEIGHT,
                )}
                itemCount={filteredCountries.length}
                itemSize={ITEM_HEIGHT}
                width='100%'
              >
                {({ index, style }: ListChildComponentProps) => {
                  const country = filteredCountries[index];
                  return (
                    <div style={style}>
                      <CommandItem
                        key={country.alpha2}
                        value={country.name}
                        onSelect={() => handleSelect(country.alpha2)}
                        className='px-2 py-1.5'
                        style={{ height: ITEM_HEIGHT }}
                      >
                        <div className='flex items-center gap-2'>
                          <span className='text-lg'>{country.emoji}</span>
                          <span>{country.name}</span>
                        </div>
                        {value === country.alpha2 && (
                          <Check className='ml-auto h-4 w-4' />
                        )}
                      </CommandItem>
                    </div>
                  );
                }}
              </List>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
