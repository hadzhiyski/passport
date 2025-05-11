import { cn } from '@passport/lib/utils';
import { ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export interface DropdownMenuItem {
  value: string;
  label: string;
  checked?: boolean;
}

export interface DropdownMenuCheckboxesProps {
  disabledLabel?: string;
  items: DropdownMenuItem[];
  checked: string[];
  onChange?: (value: string, checked: boolean) => void;
}

const LABEL_MAX_CHECKED_COLORS = 3;

export function DropdownMenuCheckboxes({
  disabledLabel,
  items,
  checked,
  onChange,
}: DropdownMenuCheckboxesProps) {
  const [open, setOpen] = useState(false);
  const isDisabled = items.length === 0;
  const checkedLabels = useMemo(() => {
    const label = checked.slice(0, LABEL_MAX_CHECKED_COLORS).join(', ');
    if (checked.length > LABEL_MAX_CHECKED_COLORS) {
      return `${label} + ${checked.length - LABEL_MAX_CHECKED_COLORS} more`;
    }
    return label;
  }, [checked]);
  return (
    <DropdownMenu
      open={isDisabled ? false : open}
      onOpenChange={isDisabled ? undefined : setOpen}
    >
      <DropdownMenuTrigger asChild disabled={isDisabled}>
        <Button
          role='combobox'
          variant='outline'
          className={cn(
            'w-full flex flex-row justify-between items-center',
            !checked && 'text-muted-foreground',
            isDisabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {isDisabled
            ? disabledLabel || 'No options available'
            : checkedLabels || 'Click to select'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[var(--radix-dropdown-menu-trigger-width)] max-h-64 overflow-y-auto'
        align='start'
        sideOffset={4}
        aria-disabled={items.length === 0}
      >
        {items.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.value}
            checked={checked.includes(item.value)}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={(checked: boolean) =>
              onChange?.(item.value, checked)
            }
          >
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
