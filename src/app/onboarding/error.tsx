"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

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
            Oops! Something went wrong
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-lg text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">
            Error
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message || "An unexpected error occurred."}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => reset()}
              className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold"
            >
              Try again
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-200 text-black py-2 rounded-lg text-sm font-semibold"
            >
              Go back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
