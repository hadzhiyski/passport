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
import { useMicroSteps } from '@passport/onboarding/micro-steps';
import {
  tryGetOrAssumeOwnerProfile,
  upsertOwnerProfile,
} from '@passport/owners/actions';
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  UserCircle,
} from 'lucide-react';
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

// Sub-schemas for micro steps
const personalInfoSchema = profileFormSchema.pick({
  firstname: true,
  lastname: true,
  phone: true,
});

const addressInfoSchema = profileFormSchema.pick({
  address: true,
  city: true,
  country: true,
  postcode: true,
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
type AddressInfoValues = z.infer<typeof addressInfoSchema>;

export function ProfileStep({
  onComplete,
  isUpdating = false,
}: ProfileStepProps) {
  const {
    current: currentMicroStep,
    next: goToNextMicroStep,
    previous: goToPreviousMicroStep,
  } = useMicroSteps();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileFormValues>({
    firstname: '',
    lastname: '',
    address: '',
    city: '',
    country: '',
    postcode: '',
    phone: '',
  });

  // Define form with validation for current micro step
  const personalInfoForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstname: formData.firstname,
      lastname: formData.lastname,
      phone: formData.phone,
    },
  });

  const addressInfoForm = useForm<AddressInfoValues>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues: {
      address: formData.address,
      city: formData.city,
      country: formData.country,
      postcode: formData.postcode,
    },
  });

  // Load existing profile data on component mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        const response = await tryGetOrAssumeOwnerProfile();

        if (response.success && response.profile) {
          const profileData = {
            firstname: response.profile.firstname || '',
            lastname: response.profile.lastname || '',
            address: response.profile.address || '',
            city: response.profile.city || '',
            country: response.profile.country || '',
            postcode: response.profile.postcode || '',
            phone: response.profile.phone || '',
          };

          setFormData(profileData);

          // Update the form values for each micro step
          personalInfoForm.reset({
            firstname: profileData.firstname,
            lastname: profileData.lastname,
            phone: profileData.phone,
          });

          addressInfoForm.reset({
            address: profileData.address,
            city: profileData.city,
            country: profileData.country,
            postcode: profileData.postcode,
          });
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [personalInfoForm, addressInfoForm]);

  // Handle personal info submission and transition to address step
  const onPersonalInfoSubmit = async (data: PersonalInfoValues) => {
    setFormData((prev) => ({ ...prev, ...data }));
    goToNextMicroStep();
  };

  // Handle address info submission and complete the profile step
  const onAddressInfoSubmit = async (data: AddressInfoValues) => {
    setIsSubmitting(true);
    setError(null);

    const completeFormData = {
      ...formData,
      ...data,
    };

    try {
      const result = await upsertOwnerProfile({
        firstname: completeFormData.firstname,
        lastname: completeFormData.lastname,
        address: completeFormData.address,
        city: completeFormData.city,
        country: completeFormData.country,
        postcode: completeFormData.postcode || null,
        phone: completeFormData.phone || null,
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
          {currentMicroStep === 'personal' ? (
            <UserCircle className='h-12 w-12 text-primary' />
          ) : (
            <MapPin className='h-12 w-12 text-primary' />
          )}
        </div>
      </div>

      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold'>
          {currentMicroStep === 'personal'
            ? 'Tell us a bit about yourself'
            : 'Where can we find you?'}
        </h2>
        <p className='text-muted-foreground'>
          {currentMicroStep === 'personal'
            ? "We'll need this info for your pet's passport and to register you as their proud parent!"
            : 'Your address helps vets give location-based care recommendations for your furry friend.'}
        </p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
          {error}
        </div>
      )}

      <Card className='border-0 p-6'>
        {isLoading ? (
          <div className='flex justify-center items-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : null}
        {currentMicroStep === 'personal' ? (
          <Form {...personalInfoForm}>
            <form
              onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)}
              className='space-y-4'
            >
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={personalInfoForm.control}
                  name='firstname'
                  render={({ field }) => (
                    <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                      <FormLabel>
                        First Name{' '}
                        <span className='text-primary'>Required</span>
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
                  Next Step
                  <ArrowRight className='h-4 w-4 ml-2' />
                </Button>
              </div>
            </form>
          </Form>
        ) : null}
        {currentMicroStep === 'address' ? (
          <Form {...addressInfoForm}>
            <form
              onSubmit={addressInfoForm.handleSubmit(onAddressInfoSubmit)}
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

              <div className='flex justify-between mt-6'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={goToPreviousMicroStep}
                  disabled={isSubmitting || isUpdating}
                >
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Back
                </Button>
                <Button type='submit' disabled={isSubmitting || isUpdating}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className='h-4 w-4 ml-2' />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : null}
      </Card>
    </div>
  );
}
