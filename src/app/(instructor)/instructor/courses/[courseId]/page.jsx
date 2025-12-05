"use client";
import { getSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseDetail() {
    const [ course, setCourse ] = useState();
    const params = useParams();
    useEffect(() => {
        const fetchCourse = async () => {
            try{
                const session = await getSession();
                const res = await fetch(`http://localhost:8000/api/method/lms_app.api.course.get_course?id=${params.courseId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`
                    }
                })
                const response = await res.json();
                console.log(response)
                setCourse(response.data.course)
            } catch (error) {
                toast.error("Алдаа гарлаа.")
                console.error("Error fetching courses:", error);
            }
        }
        fetchCourse();
    }, [])
    return (
        <div>
            {
                course ? <p>{course.course_title}</p> : <p>{params.courseId}</p>
            }
        </div>
    );
}