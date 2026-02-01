"use client";
import { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { ChartNoAxesColumnIncreasing, Files, Search, Users } from 'lucide-react';
import { formatMoney } from "@/lib/utils";

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [wageRange, setWageRange] = useState([0, 100000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortBy, setSortBy] = useState("creation_desc");
    const [level, setLevel] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${BACKEND}.category.get_categories`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                });
                const response = await res.json();
                setCategories(response.data);
            } catch (error) {
                toast.error("Ангилал авахад алдаа гарлаа.");
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);

    const fetchCourses = async (pageNum = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", pageNum);
            params.append("sort_by", sortBy);
            params.append("min_price", wageRange[0]);
            params.append("max_price", wageRange[1]);
            params.append("level", level);

            if (selectedCategories.length > 0) {
                params.append("categories", selectedCategories.join(","));
            }

            if (searchQuery) {
                params.append("search", searchQuery);
            }

            const res = await fetch(`${BACKEND}.course.get_courses?${params.toString()}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
            });

            const response = await res.json();
            setCourses(response.data.courses || []);
            setTotalPages(response.data.total_pages || 1);
            setTotalItems(response.data.total_count || 0);
            setPage(pageNum);
            
        } catch (error) {
            toast.error("Сургалт авахад алдаа гарлаа.");
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchCourses(1);
    }, [wageRange[0], wageRange[1], selectedCategories.join(","), sortBy, level]);

    const handleCategoryChange = (categoryName) => {
        setSelectedCategories((prev) => {
            if (prev.includes(categoryName)) {
                return prev.filter(cat => cat !== categoryName);
            } else {
                return [...prev, categoryName];
            }
        });
    };
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
                            disabled={loading}
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
                        disabled={loading}
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
                            disabled={loading}
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
                        disabled={loading}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <div className="w-full h-full flex flex-col py-8 px-0 md:px-10 xl:px-20">
            <div className="flex gap-8 px-4 2xl:px-20">
                <Card className="h-fit hover:translate-y-0 w-64 shrink-0">
                    <CardContent className="flex flex-col gap-4 pt-6">
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold mb-2">Үнийн хүрээ</p>
                            <Slider
                                value={wageRange}
                                onValueChange={setWageRange}
                                min={0}
                                max={100000}
                                step={10000}>
                            </Slider>
                            <div className="flex justify-between mt-2 text-sm text-gray-500">
                                <span>{wageRange[0].toLocaleString()}₮</span>
                                <span>{wageRange[1].toLocaleString()}₮</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold mb-2">Ангилал</p>
                            <div className="flex flex-col gap-2">
                                {categories?.map((category) => {
                                    const isSelected = selectedCategories.includes(category.name);
                                    return (
                                        <Label
                                            key={category.name}
                                            className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-900 cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => handleCategoryChange(category.name)}
                                                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                            />
                                            <div className="grid gap-1.5 font-normal">
                                                <p className="text-sm leading-none font-medium">
                                                    {category.category_name}
                                                </p>
                                            </div>
                                        </Label>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="w-full flex flex-col gap-8">
                    <div className="flex gap-4">
                        <div className="flex gap-2 w-full">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    ref={searchRef}
                                    className="pl-10 pr-4 py-2"
                                    placeholder="Сургалт эсвэл багшийн нэрээр хайх..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button className="bg-blue-900" onClick={fetchCourses}><Search /></Button>
                        </div>
                        <Select value={level} onValueChange={setLevel}>
                            <SelectTrigger className="w-[250px] h-11">
                                <SelectValue placeholder="Түвшин" />
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
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[250px] h-11">
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
                    <div className="text-lg">{totalItems} илэрц</div>
                    {loading ? (
                        <div className="flex justify-center items-center h-96">
                            <p className="text-gray-500">Уншиж байна...</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {courses?.length > 0 ? (
                                    courses.map((course, index) => {
                                        return (
                                            <Link key={index} href={`/courses/${course.name}`}>
                                                <Card className="pt-0 overflow-hidden hover:shadow-lg transition-shadow h-full">
                                                    <div className="h-48 flex text-white text-6xl bg-gray-300 bg-cover bg-center" style={course.thumbnail ? { backgroundImage: `url(${BASE_URL}${course.thumbnail})` } : {}}>
                                                        <Badge className="bg-blue-900 mx-3 mt-3 h-8 rounded-md">{course.category_name}</Badge>
                                                    </div>
                                                    <CardHeader>
                                                        <CardTitle>{course.course_title}</CardTitle>
                                                        <CardDescription className="truncate">{course.description}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="flex flex-col items-end gap-3">
                                                        <div className="w-full flex flex-wrap gap-2 text-[13px]">
                                                            <div className="flex items-center gap-2">
                                                                <ChartNoAxesColumnIncreasing size={14} />
                                                                {course.level}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users size={14} />
                                                                <p>{course.student_count} суралцагч</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Files size={14} />
                                                                <p>{course.lesson_count} хичээл</p>
                                                            </div>
                                                        </div>
                                                        <Separator />
                                                        <div className="w-full flex flex-wrap justify-between gap-2">
                                                            {
                                                                course.instructor_full_name &&
                                                                <div className="flex items-center gap-2">
                                                                    <Avatar>
                                                                        <AvatarImage src={`${BASE_URL}${course.instructor_image}`} alt="profile" />
                                                                        <AvatarFallback>{course.instructor_full_name
                                                                            .split(' ')
                                                                            .map(word => word[0])
                                                                            .join('')}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <p>{course.instructor_full_name}</p>
                                                                </div>
                                                            }
                                                            {course.price_type === "Free" ?
                                                                <Badge className="bg-green-500 h-8 text-sm">Үнэгүй</Badge>
                                                                :
                                                                <Badge className="bg-green-500 h-8 text-sm">{formatMoney(course.price)}₮</Badge>
                                                            }
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        );
                                    })
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
                                                disabled={page === 1 || loading}
                                            />
                                            {generatePaginationItems()}
                                            <PaginationNext
                                                onClick={() => page < totalPages && fetchCourses(page + 1)}
                                                disabled={page === totalPages || loading}
                                            />
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}