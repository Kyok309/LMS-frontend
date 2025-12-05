"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner";

function formatDate(dateStr) {
    if (!dateStr) return "—"
    try {
        const d = new Date(dateStr)
        return d.toLocaleDateString()
    } catch {
        return dateStr
    }
}

export default function CourseDetail() {
    const [course, setCourse] = useState([]);
    const params = useParams();
    useEffect(() => {
        const fetchCourse = async () => {
            try{
                const res = await fetch(`http://localhost:8000/api/method/lms_app.api.course.get_course?id=${params.courseId}`, {
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                    }
                })
                const response = await res.json();

                console.log(response);
                setCourse(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchCourse();
    },[])

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="shrink-0">
                        {course.thumbnail ? 
                            <img
                                src={course.thumbnail}
                                alt={course.course_title}
                                className="rounded-md object-cover"
                                style={{ width: 240, height: 140 }}
                            />
                            :
                            <div/>
                        
                        }
                        </div>

                    <div className="flex-1">
                        <CardTitle>{course.course_title}</CardTitle>
                        <CardDescription>{course.category}</CardDescription>

                        <div className="mt-3 flex items-center gap-3">
                            <Avatar>
                                {course.instructor?.avatar ? (
                                    <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                                ) : (
                                    <AvatarFallback>{(course.instructor?.name || "U").slice(0, 1)}</AvatarFallback>
                                )}
                            </Avatar>

                            <div>
                                <div className="font-medium">{course.instructor?.name || course.instructor}</div>
                                <div className="text-sm text-muted-foreground">Instructor</div>
                            </div>
                        </div>
                    </div>

                    <div className="ml-auto flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                            <Badge variant={course.status === "Published" ? "default" : "secondary"}>{course.level}</Badge>
                            <Badge variant="outline">{course.price_type}</Badge>
                        </div>

                        <div className="mt-2">
                            {course.price_type === "Paid" ? (
                                <div className="text-lg font-semibold">${Number(course.price).toFixed(2)}</div>
                            ) : (
                                <div className="text-lg font-semibold">Free</div>
                            )}
                        </div>

                        <div className="mt-2">
                            <Button>Enroll</Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <h3 className="font-semibold mb-2">About this course</h3>
                    <p className="text-muted-foreground">{course.description}</p>
                </CardContent>

                <CardFooter className="justify-between">
                    <div className="text-sm text-muted-foreground">Published on: {formatDate(course.published_on)}</div>
                </CardFooter>
            </Card>
        </div>
    )
}