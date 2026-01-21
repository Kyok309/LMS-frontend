"use client";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Loading from "@/components/loading";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import { formatDate, formatDateTime, formatMoney } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
export default function CourseDetail() {
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { courseId } = useParams();
    const BASE_URL = "http://localhost:8000";
    const [selectedInfo, setSelectedInfo] = useState("introduction")
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const { data: session } = useSession();
    const [comment, setComment] = useState("");

    const handleStarClick = (value) => {
        setRating(rating === value ? 0 : value);
    };

    const handleStarHover = (value) => {
        setHoveredRating(value);
    };

    const displayRating = hoveredRating || rating;

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

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${BACKEND}.review.get_reviews_course?courseId=${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            })
            const response = await res.json();
            console.log(response);

            if (response.responseType === "ok") {
                setReviews(response.data || []);
            } else {
                console.log(response.desc);
            }
        } catch (error) {
            console.log("Error fetching reviews:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCourse();
        fetchReviews();
    }, [])

    async function buyCourse(courseId) {
        try {
            const session = await getSession();
            if (!session?.user?.roles?.includes("Student")) {
                toast.error("Суралцагчийн эрхээр нэвтэрч орно уу.");
                return;
            }
            const res = await fetch("http://localhost:8000/api/method/lms_app.api.stripe.create_checkout_session", {
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
            const res = await fetch(`http://localhost:8000/api/method/lms_app.api.enrollment.create_enrollment?courseId=${courseId}`, {
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

    const submitReview = async () => {
        try {
            const session = await getSession();
            const res = await fetch(`${BACKEND}.review.create_review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                body: JSON.stringify({
                    courseId: courseId,
                    rating: parseFloat(rating),
                    reviewText: comment
                })
            });
            const response = await res.json();
            if (response.responseType === "ok") {
                toast.success("Сэтгэгдэл амжилттай илгээгдлээ.");
                setRating(0);
                setComment("");
                fetchReviews();
                fetchCourse();
            } else {
                toast.error(response.desc || "Сэтгэгдэл илгээхэд алдаа гарлаа.");
            }
        } catch (error) {
            toast.error("Сэтгэгдэл илгээхэд алдаа гарлаа.");
            console.log(error);
        }
    }

    function StarRating(rating, maxRating = 5) {
        const filledStars = Math.round(rating);
        const emptyStars = maxRating - filledStars;

        return (
            <div className="flex gap-1">
                {/* Filled stars */}
                {[...Array(filledStars)].map((_, i) => (
                    <Star
                        key={`filled-${i}`}
                        size={20}
                        className="fill-yellow-400 text-yellow-400"
                    />
                ))}

                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star
                        key={`empty-${i}`}
                        size={20}
                        className="text-gray-300"
                    />
                ))}
            </div>
        );
    }

    if (isLoading && !course) {
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
                    <h2 className="text-xl font-semibold">Сургалтын үнэлгээ, сэтгэгдэл</h2>
                    <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-xl p-6">
                        <div className="flex flex-col gap-4 border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={`${BASE_URL}/${session?.user?.user?.user_image}`} alt="profile" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="font-semibold">{session?.user?.user?.first_name} {session?.user?.user?.last_name}</div>
                                    <div className="text-sm text-gray-600">{session?.user?.user?.email}</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                Үнэлгээ:
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => handleStarClick(value)}
                                        onMouseEnter={() => handleStarHover(value)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-transform transform hover:scale-110 focus:outline-none"
                                        aria-label={`Rate ${value} stars`}
                                    >
                                        <Star
                                            size={24}
                                            className={`transition-all ${value <= displayRating
                                                ? 'fill-yellow-400 stroke-yellow-400'
                                                : 'stroke-gray-300 fill-none'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <Textarea
                                placeholder="Сургалтын сэтгэгдэл оруулах..."
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <Button
                                className="bg-yellow-500 hover:bg-yellow-600"
                                onClick={submitReview}
                            >Илгээх</Button>
                        </div>
                        {reviews.length > 0 ?
                            <>
                                <div className="flex flex-col gap-4">
                                    {reviews.map((review, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-4">
                                            <div className="flex justify-between items-center gap-4 mb-2">
                                                <div className="flex items-center gap-4">
                                                    <Avatar>
                                                        <AvatarImage src={`${BASE_URL}/${review.user_image}`} alt="profile" />
                                                        <AvatarFallback>{review.full_name
                                                            .split(' ')
                                                            .map(word => word[0])
                                                            .join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold">{review.full_name}</p>
                                                        <div className="flex items-center gap-1">
                                                            {StarRating(review.rating)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>{formatDateTime(review.creation)}</div>
                                            </div>
                                            <div>{review.review_text}</div>
                                        </div>
                                    ))}
                                </div>
                            </> :
                            <p className="w-full text-center">Хоосон байна.</p>
                        }
                    </div>
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