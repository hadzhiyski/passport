'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker, { afterToday } from '@passport/components/date-picker';
import { DropdownMenuCheckboxes } from '@passport/components/dropdown-menu-checkboxes';
import { Button } from '@passport/components/ui/button';
import { Card } from '@passport/components/ui/card';
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
  RadioGroup,
  RadioGroupItem,
} from '@passport/components/ui/radio-group';
import { Textarea } from '@passport/components/ui/textarea';
import ALL_COLORS from '@passport/data/pet-colors.json';
import { cn } from '@passport/lib/utils';
import { useOnboardingDataStore } from '@passport/onboarding/onboarding-data-store';
import {
  insertPassport,
  insertPet,
} from '@passport/onboarding/steps/pets/actions';
import {
  BasicInfoValues,
  CharacteristicsValues,
  PassportValues,
  basicInfoSchema,
  characteristicsSchema,
  passportSchema,
} from '@passport/onboarding/steps/pets/schema';
import { formatPetNameForDisplay } from '@passport/onboarding/utils';
import {
  ArrowRight,
  Cat,
  Dog,
  Loader2,
  Mars,
  PawPrint,
  Venus,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

interface PetsStepProps {
  onComplete: () => void;
  isUpdating?: boolean;
  microStep: string | null;
  onNextMicroStep: () => void;
}

export function PetsStep({
  onComplete,
  isUpdating = false,
  microStep,
  onNextMicroStep,
}: PetsStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    petId: storedPetId,
    steps: { pet },
    storePetBasicData,
    storePetCharacteristicsData,
    storePetPassportData,
    storePetId,
  } = useOnboardingDataStore();

  // Format pet name for display using utility function
  const petName = formatPetNameForDisplay(pet.basic?.name);

  // Define forms with validation for each micro step
  const basicInfoForm = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: pet.basic?.name,
      dob: pet.basic?.dob,
      sex: pet.basic?.sex,
    },
  });

  const characteristicsForm = useForm<CharacteristicsValues>({
    resolver: zodResolver(characteristicsSchema),
    defaultValues: {
      species: pet.characteristics?.species,
      breed: pet.characteristics?.breed,
      colors: pet.characteristics?.colors,
      notes: pet.characteristics?.notes,
    },
  });

  const selectedSpecies = characteristicsForm.watch('species');
  const colors = useMemo(() => {
    const shared = ALL_COLORS.shared;
    if (selectedSpecies === 'dog') {
      return [...shared, ...ALL_COLORS.dog].sort().map((color) => ({
        value: color,
        label: color,
      }));
    } else if (selectedSpecies === 'cat') {
      return [...shared, ...ALL_COLORS.cat].sort().map((color) => ({
        value: color,
        label: color,
      }));
    }
    return [];
  }, [selectedSpecies]);

  const passportForm = useForm<PassportValues>({
    resolver: zodResolver(passportSchema),
    defaultValues: {
      passportSerialNumber: undefined,
      passportIssueDate: undefined,
    },
  });

  const onBasicInfoSubmit = (data: BasicInfoValues) => {
    storePetBasicData(data);
    onNextMicroStep();
  };

  const onCharacteristicsSubmit = async (data: CharacteristicsValues) => {
    setIsSubmitting(true);
    try {
      if (!pet.basic) {
        throw new Error('Basic pet information is required');
      }
      storePetCharacteristicsData(data);
      const { id } = await insertPet({ ...pet.basic, ...data });

      storePetId(id);
      onNextMicroStep();
    } catch (error) {
      console.error('Error adding pet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle passport info submission and complete the pets step
  const onPassportSubmit = async (data: PassportValues) => {
    setIsSubmitting(true);
    try {
      if (!storedPetId) {
        throw new Error('Pet ID is required');
      }
      storePetPassportData(data);
      await insertPassport(storedPetId, {
        serialNumber: data.passportSerialNumber,
        issueDate: data.passportIssueDate,
      });
      onComplete();
    } catch (error) {
      console.error('Error adding passport:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the appropriate icon based on the current micro step
  const getStepIcon = () => {
    switch (microStep) {
      case 'basic':
        return <PawPrint className='h-12 w-12 text-primary' />;
      case 'characteristics':
        return <Dog className='h-12 w-12 text-primary' />;
      case 'passport':
        return <Cat className='h-12 w-12 text-primary' />;
      default:
        return <PawPrint className='h-12 w-12 text-primary' />;
    }
  };

  // Get the appropriate heading based on the current micro step
  const getStepHeading = () => {
    switch (microStep) {
      case 'basic':
        return 'Tell us about your furry friend';
      case 'characteristics':
        return 'Physical Characteristics';
      case 'passport':
        return 'Passport Details';
      default:
        return 'Add Your Pet';
    }
  };

  // Get the appropriate description based on the current micro step
  const getStepDescription = () => {
    switch (microStep) {
      case 'basic':
        return "Let's get to know your pet a little better!";
      case 'characteristics':
        return "Tell us about your pet's physical characteristics.";
      case 'passport':
        return 'If your pet has a passport, please enter the details.';
      default:
        return "Let's get your pet set up in Passport.";
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-center'>
        <div className='flex items-center justify-center h-24 w-24 rounded-full bg-primary/10'>
          {getStepIcon()}
        </div>
      </div>

      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold'>{getStepHeading()}</h2>
        <p className='text-muted-foreground'>{getStepDescription()}</p>
      </div>

      <Card className='border-0 p-6'>
        {microStep === 'basic' && (
          <Form {...basicInfoForm}>
            <form
              onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)}
              className='space-y-4'
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
                    <FormLabel>Sex</FormLabel>
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

              <div className='flex justify-end mt-6'>
                <Button type='submit' disabled={isSubmitting || isUpdating}>
                  Describe Your Pet&apos;s Looks
                  <ArrowRight className='h-4 w-4 ml-2' />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {microStep === 'characteristics' && (
          <Form {...characteristicsForm}>
            <form
              onSubmit={characteristicsForm.handleSubmit(
                onCharacteristicsSubmit,
              )}
              className='space-y-4'
            >
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={characteristicsForm.control}
                  name='species'
                  render={({ field }) => (
                    <FormItem className='col-span-2 grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                      <FormLabel>
                        Species <span className='text-primary'>Required</span>
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
                                value='dog'
                                id='species-dog'
                                className='peer sr-only'
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor='species-dog'
                              className={cn(
                                'flex flex-col items-center justify-center rounded-md border-2 border-muted p-4 hover:border-muted-foreground/20 hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary',
                                'cursor-pointer transition-colors',
                              )}
                            >
                              <Dog className='mb-1 h-5 w-5 text-muted-foreground peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:text-primary' />
                              <span className='font-medium text-muted-foreground peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:text-primary'>
                                Dog
                              </span>
                            </FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value='cat'
                                id='species-cat'
                                className='peer sr-only'
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor='species-cat'
                              className={cn(
                                'flex flex-col items-center justify-center rounded-md border-2 border-muted p-4 hover:border-muted-foreground/20 hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary',
                                'cursor-pointer transition-colors',
                              )}
                            >
                              <Cat className='mb-1 h-5 w-5 text-muted-foreground peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:text-primary' />
                              <span className='font-medium text-muted-foreground peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:text-primary'>
                                Cat
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
                  control={characteristicsForm.control}
                  name='breed'
                  render={({ field }) => (
                    <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                      <FormLabel>
                        Breed <span className='text-primary'>Required</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Golden Retriever' {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter &quot;Mixed&quot; or &quot;Unknown&quot; if
                        you&apos;re not sure
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={characteristicsForm.control}
                  name='colors'
                  render={({ field }) => (
                    <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                      <FormLabel>
                        Colors{' '}
                        <span className='text-muted-foreground'>
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <DropdownMenuCheckboxes
                          disabledLabel='Select what species is your pet first'
                          checked={field.value || []}
                          items={colors}
                          onChange={(value, checked) => {
                            const newValue = checked
                              ? [...(field.value || []), value]
                              : field.value?.filter((v) => v !== value);
                            field.onChange(newValue);
                          }}
                        ></DropdownMenuCheckboxes>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={characteristicsForm.control}
                  name='notes'
                  render={({ field }) => (
                    <FormItem className='col-span-2 grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                      <FormLabel>
                        Notes{' '}
                        <span className='text-muted-foreground text-sm'>
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Any special notes about your pet'
                          {...field}
                        ></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex justify-end mt-6'>
                <Button type='submit' disabled={isSubmitting || isUpdating}>
                  Register Your Pet&apos;s Passport
                  <ArrowRight className='h-4 w-4 ml-2' />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {microStep === 'passport' && (
          <Form {...passportForm}>
            <form
              onSubmit={passportForm.handleSubmit(onPassportSubmit)}
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
        )}
      </Card>
    </div>
  );
}
