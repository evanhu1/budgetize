"use client";

import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";

const Callback = () => {
    const router = useRouter();

    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace("#", "?"));


        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");


        const queryParams = new URLSearchParams({
            access_token: accessToken || '',
            refresh_token: refreshToken || '',
            next: '/onboarding',
          }).toString();

        fetch(`${location.origin}/api/auth?${queryParams}`).then(() => router.push("/onboarding"))


    }, [router]);

    return <div>Loading account...</div>;
}

export default Callback;