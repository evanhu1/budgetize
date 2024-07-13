'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signInWithPhoneOtp(formData: FormData) {
  const supabase = createClient()
  const phoneNumber = formData.get('phone') as string;
  const countryCode = formData.get('countryCode') as string;
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: countryCode + phoneNumber,
  })
  if (error) {
    throw new Error(error.message);
  }
}

export async function verifyPhoneOtp(formData: FormData) {
  const supabase = createClient()
  const code = formData.get('code') as string;
  const phoneNumber = formData.get('phone') as string;
  const countryCode = formData.get('countryCode') as string;

  const { data, error } = await supabase.auth.verifyOtp({
    phone: countryCode + phoneNumber,
    token: code,
    type: 'sms',
  })

  return data;
}

export async function addPhoneDb(formData: FormData) {
  const supabase = createClient()
  const phoneNumber = formData.get('phone') as string;
  const countryCode = formData.get('countryCode') as string;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log({session})

  const user = session!.user
  console.log({user})


  if (user != null && user.id) {
    const { error } = await supabase
      .from('users')
      .update({ phone: countryCode + phoneNumber })
      .eq('id', user.id)

    if (error) {
      throw new Error(error.message);
    }
  } else {
    throw new Error("User not logged in")
  }
}

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}