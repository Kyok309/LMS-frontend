"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function InstructorSettings() {
    const router = useRouter();
    async function connectStripe() {
        const res = await fetch(
            "http://localhost:8000/api/method/lms_app.api.stripe.create_onboarding_link",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${await getSession().then(session => session?.user?.accessToken)}`
                }
            }
        );

        const response = await res.json();
        console.log(response);
        router.push(response.data.url)
    }


    return (
        <div className="flex flex-col gap-8">
            <Button onClick={connectStripe} size="lg">
                Stripe холбох
            </Button>
        </div>
    );
}