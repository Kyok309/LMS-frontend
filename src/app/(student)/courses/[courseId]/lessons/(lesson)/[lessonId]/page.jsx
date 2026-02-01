"use client";
import Quizzes from "@/app/(student)/components/quizzes";
import Loading from "@/components/loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowBigRight, ArrowRight, ChevronRight, Download, Globe } from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Lesson() {
    const [lesson, setLesson] = useState(null)
    const { courseId, lessonId } = useParams("lessonId")
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingFiles, setDownloadingFiles] = useState({});
    const [fileUrls, setFileUrls] = useState({})

    const fetchLesson = async () => {
        try {
            setIsLoading(true);
            const session = await getSession();
            const res = await fetch(`${BACKEND}.lesson.get_lesson?courseId=${courseId}&lessonId=${lessonId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            })
            const response = await res.json();
            console.log(response)

            if (response.responseType === "ok") {
                setLesson(response.data)
            } else {
                toast.error(response.desc)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchLesson()
    }, [])

    async function loadContentFile(contentId, fileUrl) {
        try {
            setIsLoading(true);
            const session = await getSession();
            const res = await fetch(
                `${BACKEND}.lesson.get_lesson_file`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session?.user?.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        lesson_id: lesson.name,
                        file_url: fileUrl,
                    }),
                }
            )
            console.log(res)
    
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
    
            setFileUrls(prev => ({
                ...prev,
                [contentId]: url,
            }))
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    async function downloadFile(contentId, fileUrl, fileName) {
        try {
            setDownloadingFiles(prev => ({
                ...prev,
                [contentId]: true
            }))

            const session = await getSession();
            const res = await fetch(
                `${BACKEND}.lesson.get_lesson_file`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session?.user?.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        lesson_id: lesson.name,
                        file_url: fileUrl,
                    }),
                }
            )

            if (!res.ok) {
                toast.error("Файл татахад алдаа гарлаа.")
                return
            }

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)

            // Create temporary link and trigger download
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 100)
            toast.success("Файл амжилттай татагдлаа.")
        } catch (error) {
            console.error(error)
            toast.error("Файл татахад алдаа гарлаа.")
        } finally {
            setDownloadingFiles(prev => ({
                ...prev,
                [contentId]: false
            }))
        }
    }

    if (isLoading) {
        return <Loading/>
    }

    return (
        <div className="w-full h-full border border-slate-50 p-8 shadow rounded-2xl flex flex-col gap-4">
            <Breadcrumb className="w-full flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Нүүр хуудас</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/courses/${courseId}`}>{lesson?.course_title}</Link>
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
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">{lesson?.lesson_title}</h2>
                <Link href={`/courses/${courseId}/instructor/${lesson?.instructor}`} className="w-fit group">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={`${BASE_URL+lesson?.user_image}`}/>
                        </Avatar>
                        <div className="group-hover:text-blue-500">{lesson?.last_name+" "+lesson?.first_name}</div>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col gap-8">
                {lesson?.lesson_content.map(item => {
                    if (item.content_type === "Video") {
                        if (!fileUrls[item.name]) {
                            loadContentFile(item.name, item.video_url)
                        }
                        return (
                            <div key={item.name} className="w-full rounded-2xl overflow-hidden">
                                <video
                                    controls
                                    src={fileUrls[item.name]}
                                    className="w-full max-h-[500px] border rounded-2xl"
                                />
                            </div>
                        )
                    }

                    if (item.content_type === "Text") {
                        return (
                            <div key={item.name} className="">
                                {item.text_content}
                            </div>
                        )
                    }

                    if (item.content_type === "File") {

                        if (!fileUrls[item.name]) {
                            loadContentFile(item.name, item.attachment)
                        }

                        return (
                            <div key={item.name} className="rounded-2xl shadow overflow-hidden flex flex-wrap items-center gap-8">
                                <iframe src={`${fileUrls[item.name]}#navpanes=0&scrollbar=0`} width="100%" height="860px"/>
                            </div>
                        )
                    }

                    if (item.content_type === "Link") {
                        return (
                            <div key={item.name} className="flex flex-wrap items-center gap-8">
                                <div>Хичээлд хэрэгтэй холбоос: </div>
                                <Link href={`https://${item.external_link}`} className="text-blue-600 hover:underline">
                                    <div className="flex gap-3 px-4 py-2 border border-slate-100 rounded-lg">
                                        <Globe/> {item.external_link}
                                    </div>
                                </Link>
                            </div>
                        )
                    }
                })}
            </div>
            <Quizzes lessonId={lessonId} courseId={courseId}/>
        </div>
    );
}