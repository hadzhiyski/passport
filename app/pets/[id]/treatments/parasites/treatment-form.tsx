'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from '@passport/components/date-picker';
import { Button } from '@passport/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@passport/components/ui/form';
import { Input } from '@passport/components/ui/input';
import { add } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { addTreatment, editTreatment } from './actions';
import { treatmentInsertSchema } from './schema';

interface TreatmentFormProps {
  petId: string;
  initialData?: z.infer<typeof treatmentInsertSchema>;
}

export default function TreatmentForm({
  petId,
  initialData,
}: TreatmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = new Date();
  const isEditMode = !!initialData;

  const defaultValues = initialData || {
    petId,
    administeredBy: 1,
    name: '',
    manufacturer: '',
    administeredOn: today,
    validUntil: add(today, { months: 3 }),
  };

  const form = useForm<z.infer<typeof treatmentInsertSchema>>({
    resolver: zodResolver(treatmentInsertSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof treatmentInsertSchema>) {
    setIsSubmitting(true);
    try {
      const result = isEditMode
        ? await editTreatment(data)
        : await addTreatment(data);

      if (result.success) {
        toast.success(
          `Treatment ${isEditMode ? 'updated' : 'added'} successfully`,
        );
        router.push(`/pets/${petId}#parasite`);
      } else {
        if ('error' in result) {
          toast.error(
            result.error ||
              `Failed to ${isEditMode ? 'update' : 'add'} treatment`,
          );
        } else if ('errors' in result) {
          toast.error('Please correct the errors below');

          Object.entries(result.errors).forEach(([key, value]) => {
            const fieldName = key as keyof z.infer<
              typeof treatmentInsertSchema
            >;
            if (fieldName in form.getValues()) {
              form.setError(fieldName, {
                type: 'server',
                message: value.join(', '),
              });
            }
          });
        } else {
          toast.error(`Failed to ${isEditMode ? 'update' : 'add'} treatment`);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(
        `Error ${isEditMode ? 'updating' : 'adding'} treatment:`,
        error,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='name'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof treatmentInsertSchema>,
                'name'
              >;
            }) => (
              <FormItem className='flex flex-col space-y-3 gap-0'>
                <FormLabel>
                  Treatment Name <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Enter treatment name' {...field} />
                </FormControl>
                <FormMessage className='text-red-500 text-sm mt-1' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='manufacturer'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof treatmentInsertSchema>,
                'manufacturer'
              >;
            }) => (
              <FormItem className='flex flex-col space-y-3 gap-0'>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder='Enter manufacturer' {...field} />
                </FormControl>
                <FormMessage className='text-red-500 text-sm mt-1' />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='administeredOn'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof treatmentInsertSchema>,
                'administeredOn'
              >;
            }) => (
              <FormItem className='flex flex-col space-y-3 gap-0'>
                <FormLabel>
                  Administered On <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value instanceof Date ? field.value : today}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className='text-red-500 text-sm mt-1' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='validUntil'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof treatmentInsertSchema>,
                'validUntil'
              >;
            }) => (
              <FormItem className='flex flex-col space-y-3 gap-0'>
                <FormLabel>
                  Valid Until <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    date={
                      field.value instanceof Date
                        ? field.value
                        : add(new Date(), { months: 3 })
                    }
                    onChange={field.onChange}
                    isDateDisabled={(date: Date) => date <= new Date()}
                  />
                </FormControl>
                <FormMessage className='text-red-500 text-sm mt-1' />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end space-x-4 pt-4 border-t border-slate-200'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.back()}
            disabled={isSubmitting}
            className='min-w-[100px]'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='min-w-[160px]'
          >
            {isSubmitting
              ? 'Saving...'
              : isEditMode
                ? 'Update Treatment'
                : 'Save Treatment'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
