'use client';

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
import { ArrowRight, Cat, Dog, Loader2, PawPrint, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface PetsStepProps {
  onComplete: () => void;
  isUpdating?: boolean;
}

interface PetFormValues {
  petName: string;
  species: 'dog' | 'cat' | 'ferret' | 'other';
  breed: string;
  birthDate: string;
}

export function PetsStep({ onComplete, isUpdating = false }: PetsStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedPets, setAddedPets] = useState<Partial<PetFormValues>[]>([]);

  const form = useForm<PetFormValues>({
    defaultValues: {
      petName: '',
      species: 'dog',
      breed: '',
      birthDate: '',
    },
  });

  const onSubmit = async (data: PetFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, you'd save this pet to your database
      // For now we'll just add it to our local state
      setAddedPets([...addedPets, data]);
      form.reset();
    } catch (error) {
      console.error('Error adding pet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-center'>
        <div className='flex items-center justify-center h-24 w-24 rounded-full bg-primary/10'>
          <PawPrint className='h-12 w-12 text-primary' />
        </div>
      </div>

      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold'>Add Your Pets</h2>
        <p className='text-muted-foreground'>
          Let&apos;s get your pets set up in Passport. You can add more pets
          later.
        </p>
      </div>

      {addedPets.length > 0 && (
        <div className='space-y-4'>
          <h3 className='font-medium'>Added pets:</h3>
          <div className='grid gap-3 grid-cols-1 md:grid-cols-2'>
            {addedPets.map((pet, index) => (
              <Card key={index} className='p-4 flex items-center gap-3'>
                <div className='flex items-center justify-center h-10 w-10 rounded-full bg-primary/10'>
                  {pet.species === 'dog' ? (
                    <Dog className='h-5 w-5 text-primary' />
                  ) : pet.species === 'cat' ? (
                    <Cat className='h-5 w-5 text-primary' />
                  ) : pet.species === 'ferret' ? (
                    <PawPrint className='h-5 w-5 text-primary' />
                  ) : (
                    <PawPrint className='h-5 w-5 text-primary' />
                  )}
                </div>
                <div>
                  <p className='font-medium'>{pet.petName}</p>
                  <p className='text-sm text-muted-foreground'>
                    {pet.species}, {pet.breed}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className='p-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='petName'
                  rules={{ required: 'Pet name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Buddy' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='species'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Species</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex gap-4'
                        >
                          <FormItem className='flex items-center gap-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='dog' />
                            </FormControl>
                            <FormLabel className='font-normal flex items-center gap-1'>
                              <Dog className='h-4 w-4' /> Dog
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center gap-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='cat' />
                            </FormControl>
                            <FormLabel className='font-normal flex items-center gap-1'>
                              <Cat className='h-4 w-4' /> Cat
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center gap-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='ferret' />
                            </FormControl>
                            <FormLabel className='font-normal flex items-center gap-1'>
                              <PawPrint className='h-4 w-4' /> Ferret
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center gap-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='other' />
                            </FormControl>
                            <FormLabel className='font-normal flex items-center gap-1'>
                              <PawPrint className='h-4 w-4' /> Other
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='breed'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breed</FormLabel>
                      <FormControl>
                        <Input placeholder='Golden Retriever' {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter &quot;Mixed&quot; or &quot;Unknown&quot; if
                        you&apos;re not sure
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid gap-2'>
                <FormField
                  control={form.control}
                  name='birthDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date (approximate)</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onChange={field.onChange}
                          disabled={afterToday}
                        ></DatePicker>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='flex justify-end'>
              <Button type='submit' disabled={isSubmitting} className='gap-2'>
                <Plus className='h-4 w-4' />
                Add Pet
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      <div className='flex justify-between pt-4'>
        {addedPets.length === 0 ? (
          <>
            <Button
              variant='outline'
              onClick={onComplete}
              disabled={isSubmitting || isUpdating}
            >
              Skip for now
            </Button>
            <Button
              onClick={onComplete}
              disabled={isSubmitting || isUpdating}
              className='gap-2'
            >
              {isUpdating ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : (
                <>
                  Continue without pets
                  <ArrowRight className='h-4 w-4' />
                </>
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={onComplete}
            className='ml-auto gap-2'
            disabled={isUpdating}
          >
            {isUpdating ? (
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
        )}
      </div>
    </div>
  );
}
