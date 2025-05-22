import { Button } from '@passport/components/ui/button';
import { Form } from '@passport/components/ui/form';
import { Loader2 } from 'lucide-react';
import { PropsWithChildren, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export type MicroStepFormProps<TData extends object> = PropsWithChildren<{
  form: UseFormReturn<TData>;
  onSubmit: (data: TData) => void;
  isSubmitting: boolean;
  isUpdating: boolean;
  submitButton: {
    label: string;
    icon?: React.ReactNode;
  };
}>;

export function MicroStepForm<TData extends object>({
  form,
  onSubmit,
  isSubmitting,
  isUpdating,
  submitButton,
  children,
}: MicroStepFormProps<TData>) {
  useEffect(() => {
    const errorFields = Object.keys(form.formState.errors);
    if (errorFields.length > 0) {
      // Focus the first field with an error
      const firstErrorField = document.querySelector(
        `[name="${errorFields[0]}"]`,
      );
      if (firstErrorField instanceof HTMLElement) {
        firstErrorField.focus();
      }
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {children}

        <div className='flex justify-end mt-6'>
          <Button type='submit' disabled={isSubmitting || isUpdating}>
            {isSubmitting || isUpdating ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              <>
                {submitButton.label}
                {submitButton.icon ?? null}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
