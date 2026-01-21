"use client";

import Loading from "@/components/loading";
import { getSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Quiz from "@/app/(instructor)/components/quiz";
import QuizQuestions from "@/app/(instructor)/components/quizQuestions";


function EditQuiz() {
    const [quiz, setQuiz] = useState(null);
    const [lesson, setLesson] = useState(null);
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const { courseId, lessonId, quizId } = useParams();
    const [isLoading, setIsLoading] = useState(false);

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
            });
            const response = await res.json();
            if (response.responseType === "ok") {
                setLesson(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchQuiz = async () => {
        try {
            setIsLoading(true);
            const session = await getSession();
            console.log(quizId)
            const res = await fetch(`${BACKEND}.quiz.get_quiz_instructor?quizId=${quizId}`, {
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
                setQuiz(response.data)
            } else {
                toast.error(response.desc)
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchLesson();
        fetchQuiz();
    }, [])

    if (isLoading || !quiz || !lesson) {
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
                        <BreadcrumbLink asChild>
                            <Link href={`/instructor/courses/${courseId}/lessons/${lessonId}`}>{lesson?.lesson_title}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{quiz?.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Quiz quiz={quiz} setQuiz={setQuiz} />
            <Separator />
            <QuizQuestions quizId={quizId} fetchQuiz={fetchQuiz}/>
        </div>
    );
}

export default EditQuiz;