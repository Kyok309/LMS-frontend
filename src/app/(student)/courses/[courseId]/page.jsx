"use client";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Loading from "@/components/loading";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { getSession } from "next-auth/react";
import { formatDate, formatMoney } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import Rating from "../../components/rating";
export default function CourseDetail() {
    const [course, setCourse] = useState(null);
    const { courseId } = useParams();
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const [selectedInfo, setSelectedInfo] = useState("introduction")
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchCourse = async () => {
        try {
            setIsLoading(true);
            const session = await getSession();
            const res = await fetch(`${BACKEND}.course.get_course?courseId=${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken ? session.user.accessToken : ""}`,
                }
            })
            const response = await res.json();

            console.log(response);
            setCourse(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCourse();
    }, [])

    async function buyCourse(courseId) {
        try {
            const session = await getSession();
            if (!session?.user?.roles?.includes("Student")) {
                toast.error("Суралцагчийн эрхээр нэвтэрч орно уу.");
                return;
            }
            const res = await fetch(`${BACKEND}.stripe.create_checkout_session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                body: JSON.stringify({ course_id: courseId })
            });

            const response = await res.json();
            console.log(response);
            if (response.responseType === "error") {
                console.log(response);
                toast.error(response.desc);
                return;
            }
            router.push(response.data.session_url);
        } catch (error) {
            toast.error("Сургалт авахад алдаа гарлаа.");
            console.log(error);
        }
    }
    async function enrollFreeCourse(courseId) {
        try {
            const session = await getSession();
            if (!session?.user?.roles?.includes("Student")) {
                toast.error("Суралцагчийн эрхээр нэвтэрч орно уу.");
                return;
            }
            const res = await fetch(`${BACKEND}.enrollment.create_enrollment?courseId=${courseId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            });
            const response = await res.json();
            if (response.responseType === "ok") {
                toast.success(response.desc)
                fetchCourse();
            }
            else {
                toast.error(response.desc)
            }
        } catch (error) {
            toast.error("Сургалтанд элсэхэд алдаа гарлаа.")
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="max-w-7xl h-full mx-auto flex flex-col gap-8 items-start py-8">
            <h1 className="w-full text-3xl font-semibold">Сургалтын агуулга</h1>
            <div className="flex gap-8">
                <div className="w-3/5 flex flex-col gap-5">
                    <div className="w-full flex flex-col gap-5">
                        <div className="relative">
                            <Badge className="bg-blue-900 top-4 left-4 absolute h-8 rounded-md">{course?.category_name}</Badge>
                            <img src={BASE_URL + course?.thumbnail} className="w-full h-[400px] object-cover rounded-2xl"></img>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className={`border-blue-600  ${selectedInfo === "introduction" ? "text-white bg-blue-600 hover:bg-blue-700 hover:text-white" : "text-blue-500 hover:text-blue-700"}`}
                                onClick={() => setSelectedInfo("introduction")}>
                                Сургалтын танилцуулга
                            </Button>
                            <Button
                                variant="outline"
                                className={`border-blue-600  ${selectedInfo === "learning" ? "text-white bg-blue-600 hover:bg-blue-700 hover:text-white" : "text-blue-500 hover:text-blue-700"}`}
                                onClick={() => setSelectedInfo("learning")}>
                                Юу сурах вэ?
                            </Button>
                            <Button
                                variant="outline"
                                className={`border-blue-600  ${selectedInfo === "requirement" ? "text-white bg-blue-600 hover:bg-blue-700 hover:text-white" : "text-blue-500 hover:text-blue-700"}`}
                                onClick={() => setSelectedInfo("requirement")}>
                                Шаардлага
                            </Button>
                            <Button
                                variant="outline"
                                className={`border-blue-600  ${selectedInfo === "lessons" ? "text-white bg-blue-600 hover:bg-blue-700 hover:text-white" : "text-blue-500 hover:text-blue-700"}`}
                                onClick={() => setSelectedInfo("lessons")}>
                                Хичээлүүд
                            </Button>
                        </div>
                        {selectedInfo === "introduction" && <div>{course?.introduction}</div>}
                        {selectedInfo === "learning" && <div style={{ whiteSpace: "pre-line" }}>{course.learning_curve}</div>}
                        {selectedInfo === "requirement" && <div>{course?.requirement}</div>}
                        {selectedInfo === "lessons" && <div>{ }</div>}
                    </div>
                    <Rating courseId={courseId} setIsLoading={setIsLoading} fetchCourse={fetchCourse}/>
                </div>
                <div className="w-2/5 min-h-[500px] h-fit flex flex-col justify-between gap-6">
                    <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex justify-between">
                            <h2 className="text-2xl font-semibold">{course?.course_title}</h2>
                            <div className="flex items-center gap-1">{course?.rating?.toFixed(1)}<Star color="yellow" fill="yellow" /></div>
                        </div>
                        <div>{course?.description}</div>
                        <div className="w-full flex justify-between">
                            <div className="flex gap-2">
                                {
                                    course?.instructor_name &&
                                    <Link href={`/courses/${courseId}/instructor/${course?.instructor}`} className="flex flex-col group">
                                        <div className="flex items-center gap-2">
                                            <Avatar>
                                                <AvatarImage src={`${BASE_URL}${course?.instructor_image}`} alt="profile" />
                                                <AvatarFallback>{course?.instructor_name
                                                    .split(' ')
                                                    .map(word => word[0])
                                                    .join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <p className="group-hover:text-blue-500">{course?.instructor_name}</p>
                                        </div>
                                    </Link>
                                }
                            </div>
                            <div>{formatDate(course?.creation)}</div>
                        </div>
                    </div>
                    {course?.is_enrolled ?
                        <div className="w-full flex justify-center">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/courses/${course?.name}/lessons`)}
                                className="w-fit bg-blue-900 text-white border-0 hover:bg-blue-800 hover:text-white">
                                Сургалт руу орох
                            </Button>

                        </div> :
                        <div className="flex flex-col items-end gap-4">
                            {course?.price_type === "Paid" ?
                                <>
                                    <div className="font-semibold"> {formatMoney(course?.price)}₮ </div>
                                    <Separator />
                                    <div className="w-full flex justify-center">
                                        <Button
                                            variant="outline"
                                            onClick={() => buyCourse(course?.name)}
                                            className="w-fit bg-blue-900 text-white border-0 hover:bg-blue-800 hover:text-white">
                                            Сургалт авах
                                        </Button>
                                    </div>
                                </> :
                                <>
                                    <div className="font-semibold">Үнэгүй</div>
                                    <Separator />
                                    <div className="w-full flex justify-center">
                                        <Button
                                            variant="outline"
                                            onClick={() => enrollFreeCourse(course?.name)}
                                            className="w-fit bg-blue-900 text-white border-0 hover:bg-blue-800 hover:text-white">
                                            Сургалт авах
                                        </Button>
                                    </div>
                                </>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}