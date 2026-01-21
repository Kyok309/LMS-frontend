"use client";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function Reviews({courseId}) {
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState();
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`${BACKEND}.review.get_reviews?courseId=${courseId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`
                    }
                })

                const response = await res.json();
                console.log(response);

                if (response.responseType === "ok") {
                    setReviews(response.data);
                } else {
                    toast.error(response.desc);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        }
    })

    if (isLoading) {
        return null;
    }

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                {reviews?.map((r, index) => (
                    <div>{r.review}</div>
                ))}
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        Үнэлгээ өгөх
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Үнэлгээ өгөх
                        </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button></Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button></Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}