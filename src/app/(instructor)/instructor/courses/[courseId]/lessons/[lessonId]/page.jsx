"use client";

import { getSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Plus} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Lesson from "@/app/(instructor)/components/lesson";
import Loading from "@/components/loading";
import Quizzes from "@/app/(instructor)/components/quizzes";

export default function LessonDetail() {
    const [lesson, setLesson] = useState(null);
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const { courseId, lessonId } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                setIsLoading(true)
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
                if (response.responseType === "ok") {
                    setLesson(response.data);
                }
                else {
                    toast.error(response.desc);
                }
            } catch (error) {
                toast.error("Хичээлийн мэдээлэл авахад алдаа гарлаа.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchLesson();
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="w-full flex flex-col items-end gap-8">
            <Breadcrumb className="w-full flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/instructor/courses">Сургалт</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/instructor/courses/${courseId}`}>{lesson?.course_title}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/instructor/courses/${courseId}/lessons`}>Хичээлүүд</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{lesson?.lesson_title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Lesson lesson={lesson} setLesson={setLesson} isLoading={isLoading}/>
            <Separator/>
            <Quizzes lessonId={lessonId}/>
        </div>
    );
}