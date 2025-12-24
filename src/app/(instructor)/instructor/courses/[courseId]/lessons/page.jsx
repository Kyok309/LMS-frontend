"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { Reorder } from "framer-motion";

export default function Lessons() {
    const { courseId } = useParams();
    const [course, setCourse] = useState();
    const [lessons, setLessons] = useState([]);
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`${BACKEND}.course.get_course_instructor?id=${courseId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`
                    }
                })
                const response = await res.json();
                console.log(response)
                setCourse(response.data)
            } catch (error) {
                toast.error("Алдаа гарлаа.")
                console.error("Error fetching courses:", error);
            }
        }
        fetchCourse();
    }, [])

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`${BACKEND}.lesson.get_lessons_instructor?courseId=${courseId}`, {
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
                    setLessons(response.data);

                } else (
                    toast.error(response.desc)
                )
            } catch (error) {
                toast.error(error.message);
            }
        }
        fetchLessons();
    }, [])

    const handleReorder = (newOrder) => {
        const updated = newOrder.map((l, i) => ({
            ...l,
            order: i + 1,
        }));

        setLessons(updated);

        const updateLessonsOrder = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`${BACKEND}.lesson.update_lessons_order`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`
                    },
                    body: JSON.stringify({
                        lessons: updated.map(l => ({
                            name: l.name,
                            order:l.order
                        }))
                    })
                })
                const response = await res.json();
                if (response.responseType === "ok") {
                    toast.success("Амжилттай өөрчлөгдлөө.");
                } else {
                    toast.error("Өөрчлөлт хийхэд алдаа гарлаа.")
                }
            } catch (error) {
                toast.error(error)
            }
        }

        updateLessonsOrder();
    };
    return (
        <div className="w-full h-full flex flex-col gap-8">
            <div className="w-full flex justify-between items-center">
                <Breadcrumb>
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
                                <Link href={`/instructor/courses/${courseId}`}>{course?.course_title}</Link>
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
                <ButtonGroup>
                    <Button variant="outline"
                        className="border-blue-800 text-blue-800 hover:text-blue-900">
                        <Link href={`/instructor/courses/${courseId}`}>Сургалт</Link>
                    </Button>
                    <Button variant="outline"
                        className="border-blue-800  text-white bg-blue-800 hover:bg-blue-900 hover:text-white">Хичээлүүд</Button>
                </ButtonGroup>
            </div>

            {/* Lesson list */}
            {
                lessons.length > 0 ?
                <div className="flex flex-col gap-8">
                    <Reorder.Group
                        axis="y"
                        values={lessons}
                        onReorder={handleReorder}
                        className="space-y-2"
                    >
                        {lessons.map((lesson) => (
                            <Reorder.Item
                                key={lesson.name}
                                value={lesson}
                                className="cursor-grab rounded-2xl bg-sky-100 shadow p-4 flex items-center justify-between"
                            >
                                <div className="flex gap-4">
                                    <span className="text-sm text-gray-400">☰</span>
                                    <span className="font-medium">
                                        Хичээл {lesson.order}. {lesson.lesson_title}
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline"><Trash2 className="text-red-500"/></Button>
                                    <Button variant="outline" asChild>
                                        <Link href={`/instructor/courses/${courseId}/lessons/${lesson.name}`}>
                                            <SquarePen/>
                                        </Link>
                                    </Button>
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div> :
                <div className="w-full h-full flex justify-center mt-10">Хичээл байхгүй байна.</div>

            }
        </div>
    );
}