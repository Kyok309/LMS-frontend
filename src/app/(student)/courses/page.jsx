"use client";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Courses = () => {
    const courses = [
        {
            title: 'Вэб хөгжүүлэлт',
            description: 'HTML, CSS, JavaScript суралцаарай',
            students: '1,234 оюутан',
            rating: '4.8',
            imageUrl: '../webdevelopment.jpg'
        },
    ]
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/method/lms_app.api.category.get_categories/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include"
                });
                const response = await res.json();
                console.log(response);
                setCategories(response.data);
                
            } catch (error) {
                toast.error("Алдаа гарлаа.")
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);
    
    return ( 
        <div className="w-full h-full flex flex-col">
            <Header/>
            <div className="flex px-4 sm:px-6 lg:px-10">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => {
                    return (
                        <Card key={index} className="pt-0 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 flex items-center justify-center text-white text-6xl" style={{ backgroundImage: `url(${course.imageUrl})` }}>
                            </div>
                            <CardHeader>
                                <CardTitle>{course.title}</CardTitle>
                                <CardDescription>{course.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>👥 {course.students}</span>
                                    <span>⭐ {course.rating}</span>
                                </div>
                            </CardContent>
                        </Card>)
                        }
                    )
                }
                </div>
            </div>
        </div>
    );
}
 
export default Courses;