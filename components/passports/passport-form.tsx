'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addPassport } from '@passport/passports/actions';
import {
  addPassportSchema,
  AddPassportValues,
} from '@passport/passports/schema';
import { Loader2, NotebookText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from '../date-picker';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { UppercaseInput } from '../uppercase-input';

export interface PassportFormProps {
  petId: string;
}
export function PassportForm({ petId }: PassportFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passportForm = useForm<AddPassportValues>({
    resolver: zodResolver(addPassportSchema),
    //defaultValues: { ...profile.address },
  });

  const onSubmit = async (data: AddPassportValues) => {
    try {
      setError(null);
      setIsSubmitting(true);
      await addPassport(petId, data);
      router.push(`/pets/${petId}`);
    } catch (error) {
      console.error(error);
      setError('Failed to add passport. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-center'>
        <div className='flex items-center justify-center h-24 w-24 rounded-full bg-primary/10'>
          <NotebookText className='h-12 w-12 text-primary' />
        </div>
      </div>

      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold'>
          Register your pet&apos;s passport to make traveling with your pet
          easier.
        </h2>
        <p className='text-muted-foreground'>
          You can add a passport for your pet by filling out the form below.
        </p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
          {error}
        </div>
      )}

      <Form {...passportForm}>
        <form
          onSubmit={passportForm.handleSubmit(onSubmit)}
          className='grid grid-cols-1 gap-4'
        >
          <FormField
            control={passportForm.control}
            name='serialNumber'
            render={({ field }) => (
              <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                <FormLabel>
                  Serial Number <span className='text-primary'>Required</span>
                </FormLabel>
                <FormControl>
                  <UppercaseInput placeholder='BG01AB112233' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={passportForm.control}
            name='issueDate'
            render={({ field }) => (
              <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                <FormLabel>
                  Issue Date <span className='text-primary'>Required</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    className='w-full'
                    date={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-end mt-6'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                  Processing...
                </>
              ) : (
                <>Add Passport</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
