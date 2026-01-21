"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, GraduationCap, Timer } from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Quizzes({lessonId, courseId}) {
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            const session = await getSession();
            const res = await fetch(`${BACKEND}.quiz.get_quizzes?lessonId=${lessonId}`, {
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
                setQuizzes(response.data);
            } else {
                console.log('error')
            }
        }
        fetchQuizzes()
    }, [])
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Шалгалтууд</h2>
            {quizzes.length > 0 ?
                quizzes?.map((quiz, index) => (
                    <div key={index} className="w-full flex justify-between items-center rounded-lg border border-slate-50 shadow p-4">
                        <div className="font-semibold">{quiz.title}</div>
                        <div className="flex items-center gap-2"><GraduationCap size="20"/> {quiz.total_score} оноо</div>
                        <div className="flex items-center gap-2"><Timer size="20"/> {quiz.time_limit_minutes} минут</div>
                        <Button className="bg-blue-900 hover:bg-blue-800" asChild>
                            <Link href={`/courses/${courseId}/lessons/${lessonId}/${quiz.name}`}>
                                Шалгалт өгөх <ChevronRight/>
                            </Link>
                        </Button>
                    </div>
                ))
                :
                <div className="w-full text-center">Шалгалт байхгүй байна.</div>
            }
        </div>
    );
}