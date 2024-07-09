"use client"

import { Tree } from "@/components/Tree";
import type { Node } from "@/components/Tree";
import Image from "next/image";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'


type Profile = {
    first_name: string,
    last_name: string,
    phone: string,
}

type DecodedProfile = {
    given_name: string,
    family_name: string,
}

const rootNode: Node = {
    id: '0',
    label: 'Food',
    children: [
        {
            id: '1',
            label: 'Eating Out',
            children: [],
        },
        {
            id: '2',
            label: 'Groceries',
            children: [
                {
                    id: '3',
                    label: 'Trader Joes',
                    children: [],
                },
            ],
        },
    ],
};

const OnboardingPage = () => {
    const [stage, setStage] = useState<string>("set_number")
    const [profile, setProfile] = useState<Profile | undefined>()
    const router = useRouter();
    const searchParams = useSearchParams()


    useEffect(() => {
        if (searchParams.get('first_name') != null && searchParams.get('last_name') != null && searchParams.get('phone') != null) {
            setProfile({
                first_name: searchParams.get('first_name') as string,
                last_name: searchParams.get('last_name') as string,
                phone: searchParams.get('phone') as string,
            })
        }

        console.log(searchParams.get('phone'))
        if (searchParams.get('phone') !== null && searchParams.get('phone') !== "N/A") {
            setStage("set_buckets")
        }
    }, [searchParams])

    return (
        <div className="flex h-screen w-full md:items-center justify-center bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] px-4 sm:px-6">
            <div className="mt-8 md:mt-0 mx-auto max-w-md space-y-6">
                <div className="rounded-xl bg-white p-6 shadow-lg text-center md:text-left">

                    {
                        stage === "set_number" ?
                            <>
                                <h2 className="text-xl sm:text-2xl font-bold text-black">Step 1: Sign up with your phone</h2>
                                <p className="text-sm text-gray-500 mt-4">
                                    Budgetize works through texting you. Enter your phone number to get started.
                                </p>
                                <form className="mt-6 space-y-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Phone number
                                        </label>
                                        <input id="phone" className="border w-full p-2 rounded-md text-sm mt-2 text-black" type="tel" placeholder="(123) 456-7890" required />
                                    </div>
                                    <button type="submit" className="w-full text-white bg-black py-2 rounded-lg text-sm font-semibold" onClick={() => { alert("Create account in the DB") }}>
                                        Sign up
                                    </button>
                                </form>
                            </>
                            : stage === "set_buckets" ?
                                <>
                                    <h2 className="text-xl sm:text-2xl font-bold text-black">Step 2: Create your first budget buckets!</h2>
                                    <p className="text-sm text-gray-500 mt-4">
                                        Now lets come up with some budget buckets. You can always add more later!
                                    </p>
                                    <Tree root={rootNode} depth={0} mode="edit" />
                                    <button className="border rounded px-3 py-1">Next</button>
                                </>
                                : <></>
                    }
                </div>

            </div>
        </div>
    );
};

export default OnboardingPage;