import { zodResolver } from '@hookform/resolvers/zod';
import { MicroStepForm } from '@passport/app/onboarding/micro-step-form';
import DatePicker, { afterToday } from '@passport/components/date-picker';
import {
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
import { cn } from '@passport/lib/utils';
import {
  basicInfoSchema,
  BasicInfoValues,
} from '@passport/onboarding/steps/pets/schema';
import { ArrowRight, Mars, Venus } from 'lucide-react';
import { useForm } from 'react-hook-form';

export interface PetBasicMicroStepProps {
  values: Partial<BasicInfoValues> | null;
  onSubmit: (data: BasicInfoValues) => void;
  isSubmitting: boolean;
  isUpdating: boolean;
}

export function PetBasicMicroStep({
  values,
  onSubmit,
  isSubmitting,
  isUpdating,
}: PetBasicMicroStepProps) {
  const basicInfoForm = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: values?.name,
      dob: values?.dob,
      sex: values?.sex,
    },
  });

  return (
    <MicroStepForm
      form={basicInfoForm}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      isUpdating={isUpdating}
      submitButton={{
        label: "Describe Your Pet's Looks",
        icon: <ArrowRight className='h-4 w-4 ml-2' />,
      }}
    >
      <FormField
        control={basicInfoForm.control}
        name='name'
        render={({ field }) => (
          <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
            <FormLabel>
              Pet Name <span className='text-primary'>Required</span>
            </FormLabel>
            <FormControl>
              <Input placeholder='Buddy' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={basicInfoForm.control}
        name='sex'
        render={({ field }) => (
          <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
            <FormLabel>
              Sex <span className='text-primary'>Required</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value as string | undefined}
                className='grid grid-cols-2 gap-3'
              >
                <FormItem>
                  <FormControl>
                    <RadioGroupItem
                      value='male'
                      id='sex-male'
                      className='peer sr-only'
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor='sex-male'
                    className={cn(
                      'flex flex-col items-center justify-center rounded-md border-2 border-muted p-4 hover:border-muted-foreground/20 hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary',
                      'cursor-pointer transition-colors',
                    )}
                  >
                    <Mars className='mb-1 h-5 w-5 text-muted-foreground peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:text-primary' />
                    <span className='font-medium text-muted-foreground peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:text-primary'>
                      Male
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormControl>
                    <RadioGroupItem
                      value='female'
                      id='sex-female'
                      className='peer sr-only'
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor='sex-female'
                    className={cn(
                      'flex flex-col items-center justify-center rounded-md border-2 border-muted p-4 hover:border-muted-foreground/20 hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary',
                      'cursor-pointer transition-colors',
                    )}
                  >
                    <Venus className='mb-1 h-5 w-5 text-muted-foreground peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:text-primary' />
                    <span className='font-medium text-muted-foreground peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:text-primary'>
                      Female
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={basicInfoForm.control}
        name='dob'
        render={({ field }) => (
          <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
            <FormLabel>
              Birth Date <span className='text-primary'>Required</span>
            </FormLabel>
            <FormControl>
              <DatePicker
                className='w-full'
                date={field.value}
                onChange={field.onChange}
                disabled={afterToday}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </MicroStepForm>
  );
}
