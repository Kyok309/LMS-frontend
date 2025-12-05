"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getSession, useSession } from "next-auth/react"
import { Textarea } from "@/components/ui/textarea";

const AddCourse = ({ categories }) => {
    const [formData, setFormData] = useState({
        course_title: "",
        category: "",
        description: "",
        thumbnail: "",
        price_type: "",
        price: 0.0,
        level: "",
        status: ""
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    }

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
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

        setFormData(prev => ({
            ...prev,
            thumbnail: fileUrl
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        
        try {
            const session = await getSession();
            const res = await fetch('http://localhost:8000/api/method/lms_app.api.course.create_course', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                body: JSON.stringify({
                    ...formData,
                    instructor: session?.user?.user?.email
                })
            })

            const response = await res.json();
            console.log(response);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} className="sm:max-w-[600px]">
            <DialogTrigger asChild>
                <Button className="bg-blue-950 text-white hover:bg-blue-800 hover:text-white">
                    <Plus/>
                    Сургалт нэмэх
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Сургалт нэмэх</DialogTitle>
                    <DialogDescription>
                        Шинэ сургалтын мэдээллийг оруулна уу.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="course_title" className="text-right">
                            Гарчиг
                        </Label>
                        <Input
                            id="course_title"
                            name="course_title"
                            value={formData.course_title}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Тайлбар
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Ангилал
                        </Label>
                        <Select
                            name="category"
                            value={formData.category}
                            onValueChange={(value) => handleSelectChange('category', value)}
                            required
                            
                        >
                            <SelectTrigger className="col-span-2 w-full text-right">
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="level">
                            Түвшин
                        </Label>
                        <Select
                            name="level"
                            value={formData.level}
                            onValueChange={(value) => handleSelectChange('level', value)}
                            required
                        >
                            <SelectTrigger className="col-span-2 w-full text-right">
                                <SelectValue placeholder="Сонгоно уу" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Beginner">Анхлан суралцагч</SelectItem>
                                <SelectItem value="Intermediate">Дунд шат</SelectItem>
                                <SelectItem value="Advanced">Ахисан шат</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="thumbnail">
                            Зураг
                        </Label>
                        <Input id="thumbnail" name="thumbnail" type="file" onChange={handleImageChange} className="col-span-2"/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price_type">
                            Үнийн төрөл
                        </Label>
                        <Select
                            name="price_type"
                            value={formData.price_type}
                            onValueChange={(value) => handleSelectChange('price_type', value)}
                            required
                        >
                            <SelectTrigger className="col-span-2 w-full text-right">
                                <SelectValue placeholder="Сонгоно уу" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Free">Үнэгүй</SelectItem>
                                <SelectItem value="Paid">Төлбөртэй</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {
                        formData.price_type === "Paid" && 
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Үнэ
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="col-span-2"
                            />
                        </div>
                    }
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Төлөв
                        </Label>
                        <Select
                            name="status"
                            value={formData.status}
                            onValueChange={(value) => handleSelectChange('status', value)}
                            required
                        >
                            <SelectTrigger className="col-span-2 w-full text-right">
                                <SelectValue placeholder="Сонгоно уу" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Хадгалсан</SelectItem>
                                <SelectItem value="Published">Нийтэлсэн</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Хадгалж байна...' : 'Хадгалах'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
export default AddCourse;