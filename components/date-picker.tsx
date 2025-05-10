import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ComponentProps, useState } from 'react';
import { DayPicker, Matcher } from 'react-day-picker';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { FormControl } from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export const beforeToday: Matcher = {
  before: new Date(),
};

export const afterToday: Matcher = {
  after: new Date(),
};

export interface DatePickerProps {
  className?: string;
  date?: Date | string | null | undefined;
  onChange: (...event: unknown[]) => void;
  disabled?: ComponentProps<typeof DayPicker>['disabled'];
}

export default function DatePicker({
  className,
  date,
  onChange,
  disabled,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dateValue = date
    ? typeof date === 'string'
      ? new Date(date)
      : date
    : undefined;

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn(
              'w-[240px] pl-3 text-left font-normal',
              !dateValue && 'text-muted-foreground',
              className,
            )}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {dateValue ? format(dateValue, 'PPP') : <span>Pick a date</span>}
            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          fixedWeeks={true}
          showOutsideDays={true}
          selected={dateValue}
          onSelect={(day: Date | undefined) => {
            if (!day) return;
            onChange(day.toISOString());
            setIsOpen(false);
          }}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
