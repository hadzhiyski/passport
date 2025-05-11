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
import { useOnboardingDataStore } from '@passport/onboarding/onboarding-data-store';
import {
  tryGetOrAssumeOwnerProfile,
  upsertOwnerProfile,
} from '@passport/onboarding/steps/profile/actions';
import {
  AddressInfoValues,
  PersonalInfoValues,
  ProfileFormValues,
  addressInfoSchema,
  personalInfoSchema,
} from '@passport/onboarding/steps/profile/schema';
import { ArrowRight, Loader2, MapPin, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface ProfileStepProps {
  onComplete: () => void;
  isUpdating?: boolean;
  microStep: string | null;
  onNextMicroStep: () => void;
}

export function ProfileStep({
  onComplete,
  isUpdating = false,
  microStep,
  onNextMicroStep,
}: ProfileStepProps) {
  const [initialized, setInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    steps: { profile },
    storeProfileAddressData,
    storeProfilePersonalData,
  } = useOnboardingDataStore();
  const [formData, setFormData] = useState<ProfileFormValues>({
    firstname: profile.personal?.firstname || '',
    lastname: profile.personal?.lastname || '',
    address: profile.address?.address || '',
    city: profile.address?.city || '',
    country: profile.address?.country || '',
    postcode: profile.address?.postcode,
    phone: profile.personal?.phone,
  });

  // Define form with validation for current micro step
  const personalInfoForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: { ...profile.personal },
  });

  const addressInfoForm = useForm<AddressInfoValues>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues: { ...profile.address },
  });

  // Load existing profile data on component mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        console.log('dbg::profile', { profile, initialized });
        if (initialized) return;
        if (!profile.personal || !profile.address) {
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
            storeProfilePersonalData({
              firstname: profileData.firstname,
              lastname: profileData.lastname,
              phone: profileData.phone,
            });
            storeProfileAddressData({
              address: profileData.address,
              city: profileData.city,
              country: profileData.country,
              postcode: profileData.postcode,
            });

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
        }
        setInitialized(true);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [
    personalInfoForm,
    addressInfoForm,
    profile,
    storeProfileAddressData,
    storeProfilePersonalData,
    initialized,
  ]);

  // Handle personal info submission and transition to address step
  const onPersonalInfoSubmit = async (data: PersonalInfoValues) => {
    setFormData((prev) => ({ ...prev, ...data }));
    onNextMicroStep();
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
          {microStep === 'personal' ? (
            <UserCircle className='h-12 w-12 text-primary' />
          ) : (
            <MapPin className='h-12 w-12 text-primary' />
          )}
        </div>
      </div>

      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold'>
          {microStep === 'personal'
            ? 'Tell us a bit about yourself'
            : 'Where can we find you?'}
        </h2>
        <p className='text-muted-foreground'>
          {microStep === 'personal'
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
        {microStep === 'personal' ? (
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
                  Tell Us Where You Live
                  <ArrowRight className='h-4 w-4 ml-2' />
                </Button>
              </div>
            </form>
          </Form>
        ) : null}
        {microStep === 'address' ? (
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
        ) : null}
      </Card>
    </div>
  );
}
