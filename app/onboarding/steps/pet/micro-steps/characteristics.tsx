import { zodResolver } from '@hookform/resolvers/zod';
import { MicroStepForm } from '@passport/app/onboarding/micro-step-form';
import { DropdownMenuCheckboxes } from '@passport/components/dropdown-menu-checkboxes';
import {
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
import {
  characteristicsSchema,
  CharacteristicsValues,
} from '@passport/onboarding/steps/pets/schema';
import { ArrowRight, Cat, Dog } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

export interface PetCharacteristicsMicroStepProps {
  values: Partial<CharacteristicsValues> | null;
  onSubmit: (data: CharacteristicsValues) => void;
  isSubmitting: boolean;
  isUpdating: boolean;
}

export function PetCharacteristicsMicroStep({
  values,
  onSubmit,
  isSubmitting,
  isUpdating,
}: PetCharacteristicsMicroStepProps) {
  const characteristicsForm = useForm<CharacteristicsValues>({
    resolver: zodResolver(characteristicsSchema),
    defaultValues: {
      species: values?.species,
      breed: values?.breed,
      colors: values?.colors,
      notes: values?.notes,
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

  return (
    <MicroStepForm
      form={characteristicsForm}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      isUpdating={isUpdating}
      submitButton={{
        label: "Register Your Pet's Passport",
        icon: <ArrowRight className='h-4 w-4 ml-2' />,
      }}
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
                Enter &quot;Mixed&quot; or &quot;Unknown&quot; if you&apos;re
                not sure
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
                Colors <span className='text-muted-foreground'>(Optional)</span>
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
    </MicroStepForm>
  );
}
