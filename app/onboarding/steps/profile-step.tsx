'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CountrySelector } from '@passport/components/country-selector';
import { Button } from '@passport/components/ui/button';
import { Card } from '@passport/components/ui/card';
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
  tryGetOrAssumeOwnerProfile,
  upsertOwnerProfile,
} from '@passport/owners/actions';
import { ArrowRight, Loader2, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ProfileStepProps {
  onComplete: () => void;
  isUpdating?: boolean;
}

// Define form validation schema
const profileFormSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postcode: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileStep({
  onComplete,
  isUpdating = false,
}: ProfileStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define form with validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      address: '',
      city: '',
      country: '',
      postcode: '',
      phone: '',
    },
  });

  // Load existing profile data on component mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        const response = await tryGetOrAssumeOwnerProfile();

        if (response.success && response.profile) {
          form.reset({
            firstname: response.profile.firstname || '',
            lastname: response.profile.lastname || '',
            address: response.profile.address || '',
            city: response.profile.city || '',
            country: response.profile.country || '',
            postcode: response.profile.postcode || '',
            phone: response.profile.phone || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [form]);

  // Form submission handler
  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await upsertOwnerProfile({
        firstname: data.firstname,
        lastname: data.lastname,
        address: data.address,
        city: data.city,
        country: data.country,
        postcode: data.postcode || null,
        phone: data.phone || null,
      });

      if (result.success) {
        onComplete();
      } else {
        setError(result.error || 'Failed to save profile information');
      }
    } catch (error) {
      console.error('Error saving profile information:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-center'>
        <div className='flex items-center justify-center h-24 w-24 rounded-full bg-primary/10'>
          <UserCircle className='h-12 w-12 text-primary' />
        </div>
      </div>

      <div className='text-center space-x-2'>
        <h2 className='text-2xl font-bold'>Complete Your Profile</h2>
        <p className='text-muted-foreground'>
          Add your contact details so we can better assist you with your
          pets&apos; health records.
        </p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
          {error}
        </div>
      )}

      <Card className='p-6'>
        {isLoading ? (
          <div className='flex justify-center items-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid grid-cols-2 gap-4'
            >
              <FormField
                control={form.control}
                name='firstname'
                render={({ field }) => (
                  <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='John' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastname'
                render={({ field }) => (
                  <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='col-span-2 grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Input placeholder='123 Main St' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='country'
                render={({ field }) => (
                  <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                    <FormLabel>Country *</FormLabel>
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

              <FormField
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder='Sofia' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='postcode'
                render={({ field }) => (
                  <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder='1000' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='+359 870 123 456' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className='col-span-2 flex justify-end mt-4 gap-4'>
                <Button
                  variant='outline'
                  onClick={onComplete}
                  type='button'
                  disabled={isSubmitting || isUpdating}
                >
                  Skip for now
                </Button>
                <Button
                  type='submit'
                  disabled={isSubmitting || isUpdating}
                  className='col-span-2 btn'
                >
                  {isSubmitting || isUpdating ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className='h-4 w-4' />
                    </>
                  )}
                </Button>
              </FormItem>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
