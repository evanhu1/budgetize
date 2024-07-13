"use client";

import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

type Profile = {
  first_name: string;
  last_name: string;
  phone: string;
};

type DecodedProfile = {
  given_name: string;
  family_name: string;
};

export const Home = () => {

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string, {
    auth: {
      persistSession: true, // Ensure session persistence is enabled
    }
  })

  const [profile, setProfile] = useState<Profile | undefined>();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    console.log("handle google login")
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex h-screen w-full md:items-center justify-center bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] px-4 sm:px-6">
      <div className="mt-8 md:mt-0 mx-auto max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center">
          <Image
            className="w-full"
            src="/assets/logo.png"
            alt="Budgetize Logo"
            width={10000}
            height={100}
          />
          <p className="mt-2 text-lg font-medium text-white">
            Spend without guilt
          </p>
        </div>
        <div className="flex items-center flex-col gap-2 rounded-xl bg-white p-6 shadow-lg text-center md:text-left">
          <button
            onClick={() => router.push("/onboarding")}
            className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-semibold"
          >
            Sign in with Phone Number
          </button>

          <button
            onClick={() => handleGoogleLogin()}
            className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-semibold"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};
