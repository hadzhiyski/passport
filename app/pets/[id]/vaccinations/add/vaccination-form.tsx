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
import {
  RadioGroup,
  RadioGroupItem,
} from '@passport/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@passport/components/ui/tooltip';
import { vaccinationTypeEnum } from '@passport/database/schema/vaccination';
import { add } from 'date-fns';
import { InfoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { addVaccination } from './actions';
import { vaccinationsInsertSchema } from './schema';

interface VaccinationFormProps {
  petId: string;
}

export default function VaccinationForm({ petId }: VaccinationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = new Date();
  const form = useForm<z.infer<typeof vaccinationsInsertSchema>>({
    resolver: zodResolver(vaccinationsInsertSchema),
    defaultValues: {
      petId,
      administeredBy: 1,
      name: '',
      manufacturer: '',
      lotNumber: '',
      type: 'other',
      validFrom: add(today, { days: 1 }).toISOString(),
      administeredOn: today.toISOString(),
      expiryDate: add(today, { days: 1 }).toISOString(),
      validUntil: add(today, { years: 1 }).toISOString(),
    },
  });

  const vaccinationTypes = [
    'other',
    ...vaccinationTypeEnum.enumValues.filter((type) => type !== 'other'),
  ];
  const watchType = form.watch('type');

  async function onSubmit(data: z.infer<typeof vaccinationsInsertSchema>) {
    setIsSubmitting(true);
    try {
      const result = await addVaccination(data);

      if (result.success) {
        toast.success('Vaccination added successfully');
        router.push(`/pets/${petId}#vaccinations`);
      } else {
        if ('error' in result) {
          toast.error(result.error || 'Failed to add vaccination');
        } else if ('errors' in result) {
          toast.error('Please correct the errors below');

          Object.entries(result.errors).forEach(([key, value]) => {
            const fieldName = key as keyof z.infer<
              typeof vaccinationsInsertSchema
            >;
            if (fieldName in form.getValues()) {
              form.setError(fieldName, {
                type: 'server',
                message: value.join(', '),
              });
            }
          });
        } else {
          toast.error('Failed to add vaccination');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error adding vaccination:', error);
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
                z.infer<typeof vaccinationsInsertSchema>,
                'name'
              >;
            }) => (
              <FormItem className='flex flex-col space-y-3 gap-0'>
                <FormLabel>
                  Vaccination Name <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Enter vaccination name' {...field} />
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
                z.infer<typeof vaccinationsInsertSchema>,
                'manufacturer'
              >;
            }) => (
              <FormItem className='flex flex-col space-y-3 gap-0'>
                <FormLabel>
                  Manufacturer <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Enter manufacturer' {...field} />
                </FormControl>
                <FormMessage className='text-red-500 text-sm mt-1' />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='type'
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              z.infer<typeof vaccinationsInsertSchema>,
              'type'
            >;
          }) => (
            <FormItem className='flex flex-col space-y-3 gap-0min-h-[7rem]'>
              <FormLabel>
                Vaccination Type <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-wrap gap-6'
                >
                  {vaccinationTypes.map((type) => (
                    <div key={type} className='flex items-center space-x-2'>
                      <RadioGroupItem value={type} id={`type-${type}`} />
                      <FormLabel
                        htmlFor={`type-${type}`}
                        className='font-normal cursor-pointer'
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </FormLabel>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage className='text-red-500 text-sm' />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='lotNumber'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof vaccinationsInsertSchema>,
                'lotNumber'
              >;
            }) => (
              <FormItem className='flex flex-col space-y-3 gap-0'>
                <FormLabel>
                  Lot Number <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Enter lot number' {...field} />
                </FormControl>
                <FormMessage className='text-red-500 text-sm mt-1' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='expiryDate'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof vaccinationsInsertSchema>,
                'expiryDate'
              >;
            }) => (
              <FormItem className='flex flex-col space-y-3 gap-0'>
                <FormLabel>
                  Expiry Date <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    date={
                      field.value
                        ? new Date(field.value)
                        : add(new Date(), { days: 1 })
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

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='validFrom'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof vaccinationsInsertSchema>,
                'validFrom'
              >;
            }) => (
              <FormItem className='flex flex-col space-y-3 gap-0'>
                <div className='flex items-center gap-1'>
                  <FormLabel>
                    Valid From{' '}
                    {watchType === 'rabies' && (
                      <span className='text-red-500'>*</span>
                    )}
                  </FormLabel>
                  {watchType === 'rabies' && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className='h-4 w-4 text-slate-500' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs'>
                            Required for rabies vaccinations
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : new Date()}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    isDateDisabled={(date: Date) => date <= new Date()}
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
                z.infer<typeof vaccinationsInsertSchema>,
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
                      field.value
                        ? new Date(field.value)
                        : add(new Date(), { years: 1 })
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

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='administeredOn'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof vaccinationsInsertSchema>,
                'administeredOn'
              >;
            }) => (
              <FormItem className='flex flex-col space-y-3 gap-0'>
                <FormLabel>
                  Administered On <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : new Date()}
                    onChange={field.onChange}
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
            {isSubmitting ? 'Saving...' : 'Save Vaccination'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
