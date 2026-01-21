"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Save, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Loading from "@/components/loading";


export default function CourseDetail() {
    const [categories, setCategories] = useState([]);
    const params = useParams();
    const pathname = usePathname();
    const BASE_URL = "http://localhost:8000";
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [course, setCourse] = useState({
        course_title: "",
        category: "",
        description: "",
        introduction: "",
        learning_curve: "",
        requirement: "",
        thumbnail: "",
        price_type: "",
        price: 0.0,
        level: "",
        status: ""
    });

    const fetchCategories = async () => {
        
        try {
            setIsLoading(true)
            const session = await getSession();
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
        } finally {
            setIsLoading(false);
        }
    }

    const fetchCourse = async () => {
        try {
            setIsLoading(true);
            const session = await getSession();
            const res = await fetch(`http://localhost:8000/api/method/lms_app.api.course.get_course_instructor?id=${params.courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            })
            const response = await res.json();
            console.log(response)
            setCourse(response.data);
        } catch (error) {
            toast.error("Алдаа гарлаа.")
            console.error("Error fetching courses:", error);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchCourse();
        fetchCategories();
    }, [])

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setCourse(prev => ({
            ...prev,
            [id]: value
        }));
    }

    const handleSelectChange = (name, value) => {
        if (name === "price_type" && value === "Free") {
            setCourse({ ...course, price: 0 })
        }
        setCourse(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function handleImageChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const form = new FormData();
        form.append("file", file);
        form.append("doctype", "Course")
        form.append("docname", params.courseId)
        form.append("fieldname", "thumbnail")
        const session = await getSession();

        const upload = await fetch("http://localhost:8000/api/method/upload_file", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${session?.user?.accessToken}`
            },
            body: form,
        });

        const res = await upload.json();
        console.log(res)
        const fileUrl = res.message?.file_url;

        setCourse(prev => ({
            ...prev,
            thumbnail: fileUrl
        }))
    }

    const updateCourse = async () => {
        try {
            const session = await getSession();
            const res = await fetch("http://localhost:8000/api/method/lms_app.api.course.update_course", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                body: JSON.stringify({
                    ...course,
                    instructor: session?.user?.user?.email,
                    courseId: params.courseId
                })
            })

            const response = await res.json()
            console.log(response)
            if (response.responseType === "ok") {
                toast.success(response.desc)
                fetchCourse();
            } else if (response.responseType === "error") {
                toast.error(response.desc)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const deleteCourse = async () => {
        try {
            const session = await getSession();
            const res = await fetch(`http://localhost:8000/api/method/lms_app.api.course.delete_course?courseId=${params.courseId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            })
            const response = await res.json()
            console.log(response);
            if (response.responseType === "ok") {
                toast.success(response.desc);
                router.push("/instructor/courses");
            } else if (response.responseType === "error") {
                toast.error(response.desc);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    if (isLoading) {
        return <Loading/>
    }
    return (
        <div className="w-full flex flex-col gap-6">
            <div className="w-full flex justify-between items-center">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/instructor/courses">Сургалт</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRight />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage>{course?.course_title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <ButtonGroup>
                    <Button variant="outline"
                        className="border-blue-800  text-white bg-blue-800 hover:bg-blue-900 hover:text-white">
                        Сургалт
                    </Button>
                    <Button variant="outline"
                        className="border-blue-800 text-blue-800 hover:text-blue-900" asChild>
                        <Link href={`${pathname}/lessons`}>Хичээлүүд</Link>
                    </Button>
                </ButtonGroup>
            </div>

            <div className="w-full flex flex-wrap md:flex-nowrap gap-8">
                <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex flex-col gap-2">
                        <Label htmlFor="course_title" className="text-right">
                            Сургалтын нэр
                        </Label>
                        <Input
                            id="course_title"
                            value={course.course_title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="w-full flex gap-4">
                        <div className="w-full flex flex-col gap-2">
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="category" className="text-right">
                                    Ангилал
                                </Label>
                                <Select
                                    name="category"
                                    value={course.category}
                                    onValueChange={(value) => handleSelectChange('category', value)}
                                    required

                                >
                                    <SelectTrigger className="w-full text-right">
                                        <SelectValue placeholder="Ангилал сонгоно уу" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            categories?.map((category, index) => {
                                                return (
                                                    <SelectItem key={index} value={category.name}>{category.category_name}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectContent>
                                </Select>

                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="level" className="text-right">
                                    Түвшин
                                </Label>
                                <Select
                                    name="level"
                                    value={course.level}
                                    onValueChange={(value) => handleSelectChange('level', value)}
                                    required

                                >
                                    <SelectTrigger className="w-full text-right">
                                        <SelectValue placeholder="Сонгоно уу" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Анхлан суралцагч</SelectItem>
                                        <SelectItem value="Intermediate">Дунд шат</SelectItem>
                                        <SelectItem value="Advanced">Ахисан шат</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <Label htmlFor="thumbnail">
                            Зураг
                        </Label>
                        <div className="border-input w-full flex flex-col items-center rounded-md border bg-transparent p-4 shadow-xs">
                            {
                                course.thumbnail ?
                                    <div className="relative w-fit">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="absolute top-4 right-4"
                                            onClick={() => setCourse({ ...course, thumbnail: null })}
                                        >
                                            <Trash /> Устгах
                                        </Button>
                                        <img
                                            src={BASE_URL + course.thumbnail}
                                            className="rounded-3xl max-h-[300px]"
                                        />
                                        <Input
                                            id="thumbnail"
                                            name="thumbnail"
                                            type="file"
                                            onChange={handleImageChange}
                                            className="w-fit absolute bottom-2 left-1/2 transform -translate-1/2 bg-white"
                                        />
                                    </div> :
                                    <Input
                                        id="thumbnail"
                                        name="thumbnail"
                                        type="file"
                                        onChange={handleImageChange}
                                        className="w-fit"
                                    />
                            }

                        </div>

                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <Label htmlFor="description" className="text-right">
                            Тайлбар
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={course.description ? course.description : ""}
                            onChange={handleInputChange}
                            required
                            className="h-48"
                        />

                    </div>
                </div>

                <div className="w-full flex items-center flex-col gap-4">

                    <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex flex-col gap-2">
                            <Label htmlFor="introduction" className="text-right">
                                Танилцуулга
                            </Label>
                            <Textarea
                                id="introduction"
                                name="introduction"
                                value={course.introduction ? course.introduction : ""}
                                onChange={handleInputChange}
                                required
                                className="h-48"
                            />
                        </div>

                        <Label htmlFor="learning_curve" className="text-right">Юу сурах вэ?</Label>
                        <Textarea
                            id="learning_curve"
                            name="learning_curve"
                            value={course.learning_curve ? course.learning_curve : ""}
                            onChange={handleInputChange}
                            required
                            className="h-48"
                        />

                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <Label htmlFor="requirement" className="text-right">
                            Шаардлага
                        </Label>
                        <Textarea
                            id="requirement"
                            name="requirement"
                            value={course.requirement ? course.requirement : ""}
                            onChange={handleInputChange}
                            required
                            className="h-48"
                        />
                    </div>


                    <div className="w-full flex flex-wrap 2xl:flex-nowrap gap-4">
                        <div className="w-full flex gap-2">
                            <Label htmlFor="price_type" className="shrink-0 text-right">
                                Үнийн төрөл
                            </Label>
                            <Select
                                name="price_type"
                                value={course.price_type}
                                onValueChange={(value) => handleSelectChange('price_type', value)}
                                required
                            >
                                <SelectTrigger className="w-fit text-right">
                                    <SelectValue placeholder="Сонгоно уу" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Free">Үнэгүй</SelectItem>
                                    <SelectItem value="Paid">Төлбөртэй</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {
                            course.price_type === "Paid" &&
                            <div className="w-full flex gap-2">
                                <Label htmlFor="price" className="text-right">
                                    Үнэ
                                </Label>
                                <Input
                                    id="price"
                                    value={course.price ? course.price : ""}
                                    onChange={handleInputChange}
                                    required
                                    className="w-fit"
                                />
                            </div>
                        }
                    </div>

                    <div className="w-full flex items-center space-x-2">
                        <Switch id="status"
                            checked={course.status === "Published"}
                            onCheckedChange={(checked) => { setCourse({ ...course, status: checked ? "Published" : "Draft", }) }}
                        />
                        <Label htmlFor="status">Нийтлэх</Label>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive"><Trash/> Устгах</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="sm:max-w-[425px]">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Та устгахдаа итгэлтэй байна уу?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Устгагдсан сургалтыг дахин сэргээх боломжгүйг анхаарна уу.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Цуцлах
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={deleteCourse}>
                                        Устгах
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button
                            onClick={updateCourse}
                            className="w-fit bg-blue-900 hover:bg-blue-800">
                                <Save/> Хадгалах
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}