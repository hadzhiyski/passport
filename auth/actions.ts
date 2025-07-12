'use server';

import { createClient } from '@passport/shared/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signUpServerSchema, signInSchema } from '@passport/auth/schema';

export async function signUp(formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
    displayName: formData.get('displayName'),
  };

  // Validate input using Zod schema
  const validatedData = signUpServerSchema.parse(rawData);

  const supabase = await createClient(cookies());

  const { data, error } = await supabase.auth.signUp({
    email: validatedData.email,
    password: validatedData.password,
    options: {
      data: {
        display_name: validatedData.displayName,
        full_name: validatedData.displayName, // Some apps use full_name instead
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signIn(formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  // Validate input using Zod schema
  const validatedData = signInSchema.parse(rawData);

  const supabase = await createClient(cookies());

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedData.email,
    password: validatedData.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient(cookies());

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect('/login');
}

export async function getUser() {
  const supabase = await createClient(cookies());

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}
