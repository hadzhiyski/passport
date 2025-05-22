import { zodResolver } from '@hookform/resolvers/zod';
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
  personalInfoSchema,
  PersonalInfoValues,
} from '@passport/onboarding/steps/profile/schema';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export interface ProfilePersonalMicroStepProps {
  values: Partial<PersonalInfoValues> | null;
  onSubmit: (data: PersonalInfoValues) => void;
  isSubmitting: boolean;
  isUpdating: boolean;
}
export function ProfilePersonalMicroStep({
  values,
  onSubmit,
  isSubmitting,
  isUpdating,
}: ProfilePersonalMicroStepProps) {
  const personalInfoForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: { ...values },
  });

  useEffect(() => {
    if (values) {
      personalInfoForm.reset(values);
    }
  }, [values, personalInfoForm]);

  return (
    <Form {...personalInfoForm}>
      <form
        onSubmit={personalInfoForm.handleSubmit(onSubmit)}
        className='space-y-4'
      >
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={personalInfoForm.control}
            name='firstname'
            render={({ field }) => (
              <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                <FormLabel>
                  First Name <span className='text-primary'>Required</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={personalInfoForm.control}
            name='lastname'
            render={({ field }) => (
              <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                <FormLabel>
                  Last Name <span className='text-primary'>Required</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Doe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={personalInfoForm.control}
          name='phone'
          render={({ field }) => (
            <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
              <FormLabel>
                Phone Number{' '}
                <span className='text-muted-foreground text-sm'>
                  (Optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder='+359 870 123 456' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end mt-6'>
          <Button type='submit' disabled={isSubmitting || isUpdating}>
            Tell Us Where You Live
            <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
        </div>
      </form>
    </Form>
  );
}
