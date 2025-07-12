'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from '@passport/auth/actions';
import { signUpSchema, type SignUpFormData } from '@passport/auth/schema';
import { Button } from '@passport/shared/shadcn/components/ui/button';
import { Input } from '@passport/shared/shadcn/components/ui/input';
import { Label } from '@passport/shared/shadcn/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('displayName', data.displayName.trim());

      await signUp(formData);
      setSubmittedEmail(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div className='text-center'>
            <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
              Check your email
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              We&apos;ve sent a confirmation link to {submittedEmail}
            </p>
            <Link
              href='/login'
              className='mt-4 inline-block font-medium text-indigo-600 hover:text-indigo-500'
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Create your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or{' '}
            <Link
              href='/login'
              className='font-medium text-indigo-600 hover:text-indigo-500'
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md'>
              {error}
            </div>
          )}

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email-address'>Email address</Label>
              <Input
                id='email-address'
                type='email'
                autoComplete='email'
                placeholder='Email address'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-sm text-red-600'>{errors.email.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='display-name'>What&apos;s your name?</Label>
              <Input
                id='display-name'
                type='text'
                autoComplete='name'
                placeholder='Enter your name'
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className='text-sm text-red-600'>
                  {errors.displayName.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                autoComplete='new-password'
                placeholder='Password (min. 6 characters)'
                {...register('password')}
              />
              {errors.password && (
                <p className='text-sm text-red-600'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirm-password'>Confirm password</Label>
              <Input
                id='confirm-password'
                type='password'
                autoComplete='new-password'
                placeholder='Confirm password'
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className='text-sm text-red-600'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Button type='submit' disabled={isLoading} className='w-full'>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
