"use client";

import { TreeNode } from "@/components/categoryTree/Tree";
import { CategoryCreation } from "@/components/onboarding/CategoryCreation";
import PhoneSignIn from "@/components/onboarding/PhoneSignIn";
import { useCategoryStore } from "@/stores/store";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const OnboardingPage = () => {
    const [stage, setStage] = useState<string>("set_phone");
    const router = useRouter();
    const supabase = createClient();
    const setCategories = useCategoryStore((state) => state.setCategories);

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user && user.id) {
                const supabaseUser = await (await fetch(`/api/users?id=${user.id}`)).json()
                console.log({supabaseUser})

                if (supabaseUser.length == 0) {
                    // Creating a new user if no user with the id is found
                    fetch('/api/users',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ username: user.user_metadata.full_name, email: user.email, id: user.id }),
                        }
                    )
                    setStage("set_phone")
                } else if (supabaseUser[0].phone == null) {
                    setStage("set_phone")
                } else {
                    setStage("set_buckets")
                }
            }
        };
        checkUser();
    }, [router, supabase.auth]);

    const handleSaveTreeData = (treeData: TreeNode[]) => {
        setCategories(treeData);
        router.push("/dashboard");
    };

    return (
        <div className="flex h-screen w-full md:items-center justify-center bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] px-4 sm:px-6 overflow-y-scroll">
            <div className="rounded-xl bg-white p-8 shadow-lg text-center md:text-left">
                {stage === "set_phone" ? (
                    <PhoneSignIn next={() => setStage("set_buckets")} />
                ) : stage === "set_buckets" ? (
                    <CategoryCreation handleSaveTreeData={handleSaveTreeData} />
                ) : null}
            </div>
        </div>
    );
};

export default OnboardingPage;
