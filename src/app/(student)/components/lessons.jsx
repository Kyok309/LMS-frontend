"use client";
import { CircleCheck, CirclePlay } from "lucide-react";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function LessonsList({courseId, lessonId}) {
    const [lessons, setLessons] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setIsLoading(true);
                const session = await getSession();
                const res = await fetch(`http://localhost:8000/api/method/lms_app.api.lesson.get_lessons?courseId=${courseId}`, {
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

    const lessonIcon = (status) => {
        switch(status) {
            case "Done":
                return <CircleCheck className="text-green-500"/>
            case "Open":
                return <CirclePlay/>
        }
    }

    if (isLoading) {
        return null;
    }
    return (
        <div className="max-w-[350px] h-full flex flex-col">
            <ScrollArea className="p-4 border border-gray-50 rounded-2xl shadow">
                <h3 className="p-3 font-semibold text-lg">Хичээлүүд</h3>
                <div className="mt-2 pl-2 space-y-1">
                    {lessons?.map((lesson, index) => (
                        <a key={index}
                            className={"flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 group/item transition-colors " +
                                (lessonId === lesson.name ?
                                "bg-blue-50 text-blue-500 border-l-4 border-blue-500" :
                                "")}
                            href={`/courses/${courseId}/lessons/${lesson.name}`}>
                            {lessonIcon(lesson.status)}
                            <div className="flex-1">
                                <p className="font-semibold  group-hover/item:text-primary">
                                    Хичээл {lesson.order}. {lesson.lesson_title}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}