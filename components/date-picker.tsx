import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { FormControl } from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export interface DatePickerProps {
  date: Date | string | null | undefined;
  onChange: (...event: unknown[]) => void;
  isDateDisabled?: (date: Date) => boolean;
}

export default function DatePicker({
  date,
  onChange,
  isDateDisabled,
}: DatePickerProps) {
  // Convert string to Date if needed
  const dateValue = date
    ? typeof date === 'string'
      ? new Date(date)
      : date
    : new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn(
              'w-[240px] pl-3 text-left font-normal',
              !dateValue && 'text-muted-foreground',
            )}
          >
            {dateValue ? format(dateValue, 'PPP') : <span>Pick a date</span>}
            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={dateValue}
          onSelect={(day: Date | undefined) => {
            if (!day) return;
            onChange(day.toISOString());
          }}
          disabled={isDateDisabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
