"use client";

import { getSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LessonDetail() {
    const [lesson, setLesson] = useState(null);
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const { lessonId } = useParams();
    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`${BACKEND}.lesson.get_lesson_instructor?lessonId=${lessonId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`
                    }
                })
                const response = await res.json();
                console.log(response);
                if(response.responseType === "ok") {
                    setLesson(response.data);
                }
                else {
                    toast.error(response.desc);
                }
            } catch(error) {
                toast.error("Хичээлийн мэдээлэл авахад алдаа гарлаа.")
            }
        }
        fetchLesson();
    }, [])
    return (
        <div>Lesson Det</div>
    );
}