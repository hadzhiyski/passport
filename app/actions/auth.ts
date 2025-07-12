'use server';

import { createClient } from '@passport/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUp(
  email: string,
  password: string,
  displayName: string,
) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        full_name: displayName, // Some apps use full_name instead
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient(cookies());

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
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
