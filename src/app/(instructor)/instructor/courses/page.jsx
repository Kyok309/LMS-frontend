"use client";
import { Button } from "@/components/ui/button";
import { ChartNoAxesColumnIncreasing, Files, Search, Users } from "lucide-react";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link";
import AddCourse from "../../components/addCourse";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function InstructorCourses() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const BASE_URL = "http://localhost:8000";
    useEffect(() => {
        const fetchCourses = async () => {
            const session = await getSession();
            try {
                const res = await fetch('http://localhost:8000/api/method/lms_app.api.course.get_courses_instructor/', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`
                    }
                });
                const response = await res.json();
                setCourses(response.data)
                console.log(response);
            } catch (error) {
                toast.error("Алдаа гарлаа.")
                console.error("Error fetching courses:", error);
            }
        }
        fetchCourses();
    }, [])

    useEffect(() => {
        const fetchCategories = async () => {
            const session = await getSession();
            try {
                const res = await fetch('http://localhost:8000/api/method/lms_app.api.category.get_categories/', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`
                    }
                });
                const response = await res.json();
                setCategories(response.data)
                console.log(response);
            } catch (error) {
                toast.error("Алдаа гарлаа.")
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, [])
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-wrap justify-between items-center">
                <h2 className="text-2xl text-gray-700 font-bold">Сургалтын жагсаалт</h2>
                <AddCourse categories={categories}/>
            </div>
            <div className="flex flex-wrap md:flex-nowrap justify-between gap-4">
                <InputGroup>
                    <InputGroupInput placeholder="Search..." />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">12 илэрц</InputGroupAddon>
                </InputGroup>
                <div className="flex gap-2">
                    <Select>
                        <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Ангилал сонгох" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    categories?.map((category, index) => {
                                        return (
                                            <SelectItem key={index} value={category.category_name}>{category.category_name}</SelectItem>
                                        )
                                    })
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Эрэмбэ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="createdDateAscend">Үүсгэсэн огноо өсөх</SelectItem>
                                <SelectItem value="createdDateDescend">Үүсгэсэн огноо буурах</SelectItem>
                                <SelectItem value="priceAscend">Үнэ өсөх</SelectItem>
                                <SelectItem value="priceDescend">Үнэ буурах</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {courses?.map((course, index) => {
                    return (
                        <Link key={index} href={`/instructor/courses/${course.name}`}>
                            <Card className="pt-0 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 flex text-white text-6xl bg-gray-300 bg-cover bg-center" style={course.thumbnail ? { backgroundImage: `url(${BASE_URL}${course.thumbnail})` } : {}}>
                                    <Badge className="bg-blue-950 mx-3 mt-3 h-8 rounded-md">{course.category_name}</Badge>
                                </div>
                                <CardHeader>
                                    <CardTitle>{course.course_title}</CardTitle>
                                    <CardDescription className="truncate">{course.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-end gap-3">
                                    <div className="w-full flex flex-wrap gap-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <ChartNoAxesColumnIncreasing size={18}/>
                                            {course.level}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={18}/>
                                            <p>{course.student_count} суралцагч</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Files size={18}/>
                                            <p>{course.lesson_count} хичээл</p>
                                        </div>
                                    </div>
                                    <Separator/>
                                    <div className="w-full flex justify-between ">
                                        {course.price_type === "Free" ?
                                            <Badge className="bg-green-500 h-8 text-sm">Үнэгүй</Badge>
                                            :
                                            <Badge className="bg-green-500 h-8 text-sm">{Number(course.price).toLocaleString("en-US").replace(/,/g, ".")}₮</Badge>
                                        }
                                        <Button variant="ghost" className="">Дэлгэрэнгүй</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                }
                )}
            </div>

        </div>
    );
}