'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker, { afterToday } from '@passport/components/date-picker';
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
import { cn } from '@passport/lib/utils';
import { useMicroSteps } from '@passport/onboarding/micro-steps';
import { insertPet } from '@passport/pets/actions';
import {
  BasicInfoValues,
  CharacteristicsValues,
  PassportValues,
  PetFormValues,
  basicInfoSchema,
  characteristicsSchema,
  passportSchema,
} from '@passport/pets/schema';
import {
  ArrowLeft,
  ArrowRight,
  Cat,
  Dog,
  Loader2,
  Mars,
  PawPrint,
  Venus,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface PetsStepProps {
  onComplete: () => void;
  isUpdating?: boolean;
}

export function PetsStep({ onComplete, isUpdating = false }: PetsStepProps) {
  const {
    current: currentMicroStep,
    next: goToNextMicroStep,
    previous: goToPreviousMicroStep,
  } = useMicroSteps();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PetFormValues>({
    name: '',
    dob: '',
    sex: 'male',
    species: 'dog',
    breed: '',
    colors: '',
    notes: '',
    passportSerialNumber: '',
    passportIssueDate: new Date(),
  });

  // Define forms with validation for each micro step
  const basicInfoForm = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: formData.name,
      dob: formData.dob,
      sex: undefined as unknown as 'male' | 'female',
      species: undefined as unknown as 'dog' | 'cat',
    },
  });

  const characteristicsForm = useForm<CharacteristicsValues>({
    resolver: zodResolver(characteristicsSchema),
    defaultValues: {
      breed: formData.breed,
      colors: formData.colors,
      notes: formData.notes,
    },
  });

  const passportForm = useForm<PassportValues>({
    resolver: zodResolver(passportSchema),
    defaultValues: {
      passportSerialNumber: formData.passportSerialNumber,
      passportIssueDate: undefined as unknown as Date,
    },
  });

  // Handle basic info submission and transition to characteristics step
  const onBasicInfoSubmit = (data: BasicInfoValues) => {
    setFormData((prev) => ({ ...prev, ...data }));
    goToNextMicroStep();
  };

  // Handle characteristics submission and transition to passport step
  const onCharacteristicsSubmit = (data: CharacteristicsValues) => {
    setFormData((prev) => ({ ...prev, ...data }));
    goToNextMicroStep();
  };

  // Handle passport info submission and complete the pets step
  const onPassportSubmit = async (data: PassportValues) => {
    setIsSubmitting(true);

    const completePetData = {
      ...formData,
      ...data,
    };

    try {
      await insertPet(completePetData);

      onComplete();
    } catch (error) {
      console.error('Error adding pet:', error);
      setIsSubmitting(false);
    }
  };

  // Get the appropriate icon based on the current micro step
  const getStepIcon = () => {
    switch (currentMicroStep) {
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
    switch (currentMicroStep) {
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
    switch (currentMicroStep) {
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
        {currentMicroStep === 'basic' && (
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
                name='species'
                render={({ field }) => (
                  <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
                    <FormLabel>Species</FormLabel>
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
                  Next Step
                  <ArrowRight className='h-4 w-4 ml-2' />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {currentMicroStep === 'characteristics' && (
          <Form {...characteristicsForm}>
            <form
              onSubmit={characteristicsForm.handleSubmit(
                onCharacteristicsSubmit,
              )}
              className='space-y-4'
            >
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
                      <span className='text-muted-foreground text-sm'>
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Golden, White, Brown' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={characteristicsForm.control}
                name='notes'
                render={({ field }) => (
                  <FormItem className='grid grid-rows-[auto_auto_minmax(1.25rem,_auto)] gap-1'>
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
                  Next Step
                  <ArrowRight className='h-4 w-4 ml-2' />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {currentMicroStep === 'passport' && (
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
                      Complete
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
