"use client";

import Loading from "@/components/loading";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Lessons() {
    const {courseId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [lessons, setLessons] = useState([])
    const [course, setCourse] = useState(null);
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setIsLoading(true);
                const session = await getSession();
                const res = await fetch(`${BACKEND}.lesson.get_lessons?courseId=${courseId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`,
                    },
                });
                const response = await res.json();
                console.log(response)
                if (response.responseType === "ok") {
                    setLessons(response.data.lessons);
                    setCourse(response.data.course_title);
                } else {
                    console.log(response.desc);
                }
            } catch (error) {
                console.log("Error fetching lessons:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLessons();
    }, [])
    if (isLoading) {
        return <Loading/>
    }
    return (
        <div className="max-w-7xl mx-auto py-10 flex flex-col gap-8">
            <Breadcrumb className="w-full flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/courses">Сургалт</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/courses/${courseId}`}>{course}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Хичээлүүд</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="w-full h-full p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-semibold">Хичээлүүд</h2>
                {lessons.length > 0 ? 
                    <div className="">
                        {lessons.map((lesson, index) => (
                            <div key={index} className="flex justify-between items-center p-4 border-b border-gray-200 last:border-0">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-lg font-medium">{index + 1}. {lesson.lesson_title}</h3>
                                    <p className="text-gray-600 mt-1">{lesson.description}</p>
                                </div>
                                <Link href={`/courses/${courseId}/lessons/${lesson.name}`}
                                    className="flex gap-2 text-blue-600 hover:underline">
                                        Хичээл үзэх <ArrowRight/>
                                </Link>
                            </div>
                        ))}
                    </div>
                    :
                    <div className="w-full h-full text-center mt-4 text-gray-500">Энэ сургалтанд хичээл нэмэгдээгүй байна.</div>
                }
            </div>
        </div>
    );
}