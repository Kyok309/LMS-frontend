"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getSession } from "next-auth/react"
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AddCourse = ({ categories, fetchCourses }) => {
    const [course, setCourse] = useState({
        course_title: "",
        category: "",
        level: "",
        thumbnail: "",
        description: "",
        introduction: "",
        learning_curve: "",
        requirement: "",
        price_type: "",
        price: 0.0
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setCourse(prev => ({
            ...prev,
            [id]: value
        }));
    }

    const handleSelectChange = (name, value) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(course)

        try {
            setIsLoading(true);
            const session = await getSession();
            const res = await fetch('http://localhost:8000/api/method/lms_app.api.course.create_course', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                body: JSON.stringify({
                    ...course,
                    instructor: session?.user?.user?.email
                })
            })

            const response = await res.json();
            if(response.responseType === "ok") {
                toast.success(response.desc)
                fetchCourses();
            } else if (response.responseType === "error") {
                toast.error(response.desc)
            }
            console.log(response);
            setIsLoading(false);
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-900 text-white hover:bg-blue-800 hover:text-white">
                    <Plus />
                    Сургалт нэмэх
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[800px] sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Сургалт нэмэх</DialogTitle>
                    <DialogDescription>
                        Шинэ сургалтын мэдээллийг оруулна уу.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-8 py-4">
                    <div className="col-span-1 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="course_title" className="text-right">
                                Гарчиг
                            </Label>
                            <Input
                                id="course_title"
                                name="course_title"
                                value={course.course_title}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="flex flex-col gap-2">
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
                                        <SelectValue placeholder="Сонгоно уу" />
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
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="level">
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
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="thumbnail">
                                    Зураг
                                </Label>
                                <Input id="thumbnail" name="thumbnail" type="file" onChange={handleImageChange}/>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description" className="text-right">
                                    Тайлбар
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={course.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="introduction" className="text-right">
                                Танилцуулга
                            </Label>
                            <Textarea
                                id="introduction"
                                name="introduction"
                                value={course.introduction}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="learning_curve" className="text-right">
                                Юу сурах вэ?
                            </Label>
                            <Textarea
                                id="learning_curve"
                                name="learning_curve"
                                value={course.learning_curve}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="requirement" className="text-right">
                                Шаардлага
                            </Label>
                            <Textarea
                                id="requirement"
                                name="requirement"
                                value={course.requirement}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="price_type">
                                Үнийн төрөл
                            </Label>
                            <Select
                                name="price_type"
                                value={course.price_type}
                                onValueChange={(value) => handleSelectChange('price_type', value)}
                                required
                            >
                                <SelectTrigger className="w-full text-right">
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
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="price" className="text-right">
                                    Үнэ
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    value={course.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                        }
                    </div>
                </div>
                <DialogFooter className="justify-center">
                    <DialogClose asChild>
                        <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-900 hover:bg-blue-800">
                            {isLoading ? 'Хадгалж байна...' : 'Хадгалах'}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default AddCourse;