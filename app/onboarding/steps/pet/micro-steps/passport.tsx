import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker, { afterToday } from '@passport/components/date-picker';
import { Button } from '@passport/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@passport/components/ui/form';
import { Input } from '@passport/components/ui/input';
import {
  passportSchema,
  PassportValues,
} from '@passport/onboarding/steps/pets/schema';
import { formatPetNameForDisplay } from '@passport/onboarding/utils';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

export interface PetPassportMicroStepProps {
  name: string | null;
  values: Partial<PassportValues> | null;
  onSubmit: (data: PassportValues) => void;
  isSubmitting: boolean;
  isUpdating: boolean;
}

export function PetPassportMicroStep({
  name,
  values,
  onSubmit,
  isSubmitting,
  isUpdating,
}: PetPassportMicroStepProps) {
  const passportForm = useForm<PassportValues>({
    resolver: zodResolver(passportSchema),
    defaultValues: {
      passportSerialNumber: values?.passportSerialNumber,
      passportIssueDate: values?.passportIssueDate,
    },
  });

  const petName = formatPetNameForDisplay(name);

  return (
    <Form {...passportForm}>
      <form
        onSubmit={passportForm.handleSubmit(onSubmit)}
        className='space-y-4'
      >
        <FormField
          control={passportForm.control}
          name='passportSerialNumber'
          render={({ field }) => (
            <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
              <FormLabel>
                Passport Serial Number{' '}
                <span className='text-primary'>Required</span>
              </FormLabel>
              <FormControl>
                <Input placeholder='ABC123456789' {...field} />
              </FormControl>
              <FormDescription>
                Leave blank if your pet doesn&apos;t have a passport yet
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={passportForm.control}
          name='passportIssueDate'
          render={({ field }) => (
            <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
              <FormLabel>
                Issue Date <span className='text-primary'>Required</span>
              </FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  onChange={field.onChange}
                  disabled={afterToday}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end mt-6'>
          <Button type='submit' disabled={isSubmitting || isUpdating}>
            {isSubmitting ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin mr-2' />
                Processing...
              </>
            ) : (
              <>
                Finalize {petName}&apos;s Profile
                <ArrowRight className='h-4 w-4 ml-2' />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
