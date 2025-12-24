"use client";
import { Button } from "@/components/ui/button";
import { ChartNoAxesColumnIncreasing, Files, Search, Users } from "lucide-react";
import { getSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import AddCourse from "../../components/addCourse";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/utils";

export default function InstructorCourses() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const BASE_URL = "http://localhost:8000";
    const [level, setLevel] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("creation_desc");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);
    const [status, setStatus] = useState("");

    const fetchCourses = async (pageNum = 1) => {
        setIsLoading(true);
        const session = await getSession();
        try {
            const params = new URLSearchParams();
            params.append("page", pageNum);
            params.append("sort_by", sortBy);
            params.append("level", level);
            params.append("status", status);
            params.append("category", selectedCategory)
            params.append("search", searchQuery)
            
            const res = await fetch(`http://localhost:8000/api/method/lms_app.api.course.get_courses_instructor?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            });
            const response = await res.json();
            setCourses(response.data.courses);
            setTotalItems(response.data.total_count);
            setTotalPages(response.data.total_pages);
            setPage(pageNum);
            console.log(response);
        } catch (error) {
            toast.error("Алдаа гарлаа.")
            console.error("Error fetching courses:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setPage(1);
        fetchCourses(1);
    }, [sortBy, level, selectedCategory, status])

    useEffect(() => {
        const inputEl = searchRef.current;
        if (!inputEl) return;

        function handleKeyDown(event) {
            if (event.key === "Enter") {
                fetchCourses();
            }
        }

        inputEl.addEventListener("keydown", handleKeyDown);

        return () => {
            inputEl.removeEventListener("keydown", handleKeyDown);
        };
    }, [fetchCourses]);

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


    const generatePaginationItems = () => {
        const items = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => fetchCourses(i)}
                            isActive={page === i}
                            disabled={isLoading}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            // Always show first page
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        onClick={() => fetchCourses(1)}
                        isActive={page === 1}
                        disabled={isLoading}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            // Show ellipsis if needed
            if (page > 3) {
                items.push(
                    <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            // Show middle pages
            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => fetchCourses(i)}
                            isActive={page === i}
                            disabled={isLoading}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            // Show ellipsis if needed
            if (page < totalPages - 2) {
                items.push(
                    <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            // Always show last page
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        onClick={() => fetchCourses(totalPages)}
                        isActive={page === totalPages}
                        disabled={isLoading}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-wrap justify-between items-center">
                <h2 className="text-2xl text-gray-700 font-bold">Сургалтын жагсаалт</h2>
                <AddCourse categories={categories} fetchCourses={fetchCourses}/>
            </div>
            <div className="flex flex-wrap xl:flex-nowrap justify-between gap-4">
                <div className="flex flex-1 gap-2">
                    <InputGroup>
                        <InputGroupInput
                            ref={searchRef}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value) }}
                            placeholder="Search..."
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                    <Button onClick={fetchCourses} variant="outline" className="border-blue-950 text-blue-950"><Search /> Хайх</Button>
                </div>
                <div className="flex gap-2">
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Төлөв" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="All">Бүгд</SelectItem>
                                <SelectItem value="Published">Нийтэлсэн</SelectItem>
                                <SelectItem value="Draft">Хадгалсан</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Түвшин сонгох" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="All">Бүгд</SelectItem>
                                <SelectItem value="Beginner">Анхлан суралцагч</SelectItem>
                                <SelectItem value="Intermediate">Дунд шат</SelectItem>
                                <SelectItem value="Advanced">Ахисан шат</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Ангилал сонгох" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="All">Бүгд</SelectItem>
                                {
                                    categories?.map((category, index) => {
                                        return (
                                            <SelectItem key={index} value={category.name}>{category.category_name}</SelectItem>
                                        )
                                    })
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Эрэмбэ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="creation_asc">Үүсгэсэн огноо өсөх</SelectItem>
                                <SelectItem value="creation_desc">Үүсгэсэн огноо буурах</SelectItem>
                                <SelectItem value="price_asc">Үнэ өсөх</SelectItem>
                                <SelectItem value="price_desc">Үнэ буурах</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="font-semibold">{totalItems} илэрц</div>
            {
                isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <p className="text-gray-500">Уншиж байна...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">

                            {courses?.length > 0 ? (
                                courses.map((course, index) => {
                                    return (
                                        <Link key={index} href={`/instructor/courses/${course.name}`}>
                                            <Card className="pt-0 overflow-hidden hover:shadow-lg transition-shadow">
                                                <div className="h-48 flex text-white text-6xl bg-gray-300 bg-cover bg-center" style={course.thumbnail ? { backgroundImage: `url(${BASE_URL}${course.thumbnail.replace(/ /g, "%20")})` } : {}}>
                                                    <Badge className="bg-blue-950 mx-3 mt-3 h-8 rounded-md">{course.category_name}</Badge>
                                                </div>
                                                <CardHeader>
                                                    <CardTitle>{course.course_title}</CardTitle>
                                                    <CardDescription className="truncate">{course.description}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="flex flex-col items-end gap-3">
                                                    <div className="w-full flex flex-wrap gap-2 text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <ChartNoAxesColumnIncreasing size={16} />
                                                            {course.level}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users size={16} />
                                                            <p>{course.student_count} суралцагч</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Files size={16} />
                                                            <p>{course.lesson_count} хичээл</p>
                                                        </div>
                                                    </div>
                                                    <Separator />
                                                    <div className="w-full flex justify-between ">
                                                        {course.price_type === "Free" ?
                                                            <div>Үнэгүй</div>
                                                            :
                                                            <div>{formatMoney(course.price)}₮</div>
                                                        }
                                                        {
                                                            course.status === "Published" ?
                                                            <Badge className="p-2 bg-green-100 text-green-700 rounded-md">Нийтэлсэн</Badge> :
                                                            <Badge className="p-2 bg-gray-200 text-gray-800 rounded-md">Хадгалсан</Badge>
                                                        }
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    )
                                }
                                )
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500">Сургалт олдсонгүй</p>
                                </div>
                            )}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationPrevious
                                            onClick={() => page > 1 && fetchCourses(page - 1)}
                                            disabled={page === 1 || isLoading}
                                        />
                                        {generatePaginationItems()}
                                        <PaginationNext
                                            onClick={() => page < totalPages && fetchCourses(page + 1)}
                                            disabled={page === totalPages || isLoading}
                                        />
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>


                )
            }

        </div>
    );
}