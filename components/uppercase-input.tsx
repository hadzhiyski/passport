import { Input } from '@passport/components/ui/input';
import { cn } from '@passport/lib/utils';
import React, { forwardRef } from 'react';

export type UppercaseInputProps = React.ComponentProps<typeof Input>;

export const UppercaseInput = forwardRef<HTMLInputElement, UppercaseInputProps>(
  ({ value, onChange, onBlur, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const upper = e.currentTarget.value.toUpperCase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange?.(upper as any);
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        className={cn('uppercase', className)}
      />
    );
  },
);

UppercaseInput.displayName = 'UppercaseInput';
