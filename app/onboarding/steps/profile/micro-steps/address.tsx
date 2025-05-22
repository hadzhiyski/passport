import { zodResolver } from '@hookform/resolvers/zod';
import { CountrySelector } from '@passport/components/country-selector';
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
  addressInfoSchema,
  AddressInfoValues,
} from '@passport/onboarding/steps/profile/schema';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export interface ProfileAddressMicroStepProps {
  values: Partial<AddressInfoValues> | null;
  onSubmit: (data: AddressInfoValues) => void;
  isSubmitting: boolean;
  isUpdating: boolean;
}
export function ProfileAddressMicroStep({
  values,
  onSubmit,
  isSubmitting,
  isUpdating,
}: ProfileAddressMicroStepProps) {
  const addressInfoForm = useForm<AddressInfoValues>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues: { ...values },
  });

  useEffect(() => {
    if (values) {
      addressInfoForm.reset(values);
    }
  }, [values, addressInfoForm]);

  return (
    <Form {...addressInfoForm}>
      <form
        onSubmit={addressInfoForm.handleSubmit(onSubmit)}
        className='space-y-4'
      >
        <FormField
          control={addressInfoForm.control}
          name='address'
          render={({ field }) => (
            <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
              <FormLabel>
                Address <span className='text-primary'>Required</span>
              </FormLabel>
              <FormControl>
                <Input placeholder='123 Main St' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={addressInfoForm.control}
            name='postcode'
            render={({ field }) => (
              <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                <FormLabel>
                  Postal Code{' '}
                  <span className='text-muted-foreground text-sm'>
                    (Optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='1000' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addressInfoForm.control}
            name='city'
            render={({ field }) => (
              <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                <FormLabel>
                  City <span className='text-primary'>Required</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Sofia' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={addressInfoForm.control}
          name='country'
          render={({ field }) => (
            <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
              <FormLabel>
                Country <span className='text-primary'>Required</span>
              </FormLabel>
              <FormControl>
                <CountrySelector
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting || isUpdating}
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
                Add Your Furry Friend
                <ArrowRight className='h-4 w-4 ml-2' />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
