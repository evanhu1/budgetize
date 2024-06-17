import Image from "next/image";

export const Home = () => {
  return (
    <div className="flex h-screen w-full md:items-center justify-center bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] px-4 sm:px-6">
      <div className="mt-8 md:mt-0 mx-auto max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center">
          <Image className="w-full" src="/logo.png" alt="Budgetize Logo" width={10000} height={100} />
          <p className="mt-2 text-lg font-medium text-white">Spend without guilt</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-lg text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-black">Sign up with your phone</h2>
          <p className="text-sm text-gray-500 mt-4">
            Budgetize works through texting you. Enter your phone number to get started.
          </p>
          <form className="mt-6 space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input id="phone" className="border w-full p-2 rounded-md text-sm mt-2" type="tel" placeholder="(123) 456-7890" required />
            </div>
            <button type="submit" className="w-full text-white bg-black py-2 rounded-lg text-sm font-semibold">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
