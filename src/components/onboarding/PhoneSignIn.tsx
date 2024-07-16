"use client";

import { signInWithPhoneOtp, verifyPhoneOtp, addPhoneDb } from "@/app/onboarding/actions";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { User } from "@supabase/supabase-js";

const PhoneSignIn = ({ next }: { next: () => void }) => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const handlePhoneSubmit = async (formData: FormData) => {
    await signInWithPhoneOtp(formData);
    setShowCodeInput(true);
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-black">
        Sign up with your phone
      </h2>
      <p className="text-sm text-gray-500 mt-4">
        Budgetize works through texting you. Enter your phone number to get
        started.
      </p>
      <form className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone number
          </label>
          <div className="flex mt-2">
            <select
              name="countryCode"
              className="border rounded-l-md text-sm p-2 bg-gray-100"
              defaultValue="+1"
            >
              <option value="+1">+1</option>
              {/* Add more country codes as needed */}
            </select>
            <input
              name="phone"
              className="border border-l-0 w-full p-2 rounded-r-md text-sm"
              type="tel"
              placeholder="1234567890"
              pattern="\d{10}"
              title="Phone number format: 1234567890"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Format: 1234567890</p>
        </div>
        {!showCodeInput ? (
          <button
            type="submit"
            className="w-full bg-black py-2 rounded-lg text-sm font-semibold text-white"
            formAction={handlePhoneSubmit}
          >
            Get Code
          </button>
        ) : (
          <>
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <input
                id="code"
                name="code"
                className="border w-full p-2 rounded-md text-sm mt-2 text-black"
                type="text"
                placeholder="Enter 6-digit code"
              />
            </div>
            <div className="flex flex-row gap-2">
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold"
                formAction={async (formData) => {
                  const data = await verifyPhoneOtp(formData);
                  if (data.session) {
                    next();
                  } else {
                    alert("Incorrect code");
                  }
                }}
              >
                Verify Code
              </button>
              <button
                type="submit"
                className="items-center justify-center flex bg-black text-white p-2 rounded-lg text-sm font-semibold"
                formAction={handlePhoneSubmit}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default PhoneSignIn;
