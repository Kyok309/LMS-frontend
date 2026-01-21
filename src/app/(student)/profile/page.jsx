"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectContent, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Save } from "lucide-react";
import { getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
    const [studentProfile, setStudentProfile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`http://localhost:8000/api/method/lms_app.api.student.get_student_profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`
                    }
                });
                const response = await res.json();
                console.log(response);
                setStudentProfile(response.data);
            } catch (error) {
                toast.error("Профайл мэдээлэл авахад алдаа гарлаа.");
                console.log(error);
            }
        };
        fetchProfile();
    }, [])

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setStudentProfile((prevProfile) => ({
            ...prevProfile,
            [id]: value,
        }));
    }

    const handleSelectChange = (value) => {
        setStudentProfile((prevProfile) => ({
            ...prevProfile,
            education_level: value,
        }));
    }
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

        setStudentProfile(prev => ({
            ...prev,
            profile: fileUrl
        }))
        console.log(studentProfile.profile)
    }

    const updateProfile = async () => {
        try {
            const session = await getSession();
            const res = await fetch("http://localhost:8000/api/method/lms_app.api.student.update_student_profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                body: JSON.stringify(studentProfile),
            });
            const response = await res.json();
            console.log(response);
            if (response.responseType === "ok") {
                toast.success("Профайл амжилттай шинэчлэгдлээ.");
            }
            else {
                toast.error(response.desc);
            }
        } catch (error) {
            toast.error("Профайл шинэчлэхэд алдаа гарлаа.");
            console.log(error);
        }
    }
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-6">Миний профайл</h1>
            {studentProfile ? (
                <div className="w-full bg-white flex flex-col items-center gap-10 shadow-lg rounded-lg py-8 px-14">
                    <div className="w-50 h-50 relative">
                        {
                            studentProfile.profile ? 
                            <Avatar className="w-full h-full">
                                <AvatarImage
                                    src={`http://localhost:8000${studentProfile.profile}`}
                                    alt="Profile"
                                /> 
                                <AvatarFallback>Profile</AvatarFallback>
                            </Avatar>
                            :
                            <Avatar className="w-full h-full">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        }
                        <div className="absolute bottom-0 right-0 w-12 h-12 rounded-full border-2 border-gray-300 overflow-hidden">
                            <Button variant="ghost" className="w-full h-full bg-white" onClick={() => fileInputRef.current?.click()}>
                                <Camera className="text-gray-500"/>
                            </Button>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <Label className="text-base text-gray-500">Хувийн мэдээлэл</Label>
                        <div className="w-full grid grid-cols-2 gap-8">
                            <div className="grid grid-cols-4 gap-4">
                                <Label className="col-span-1">Овог</Label>
                                <Input
                                    id="last_name"
                                    value={studentProfile.last_name}
                                    className="col-span-3"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <Label className="col-span-1">Нэр</Label>
                                <Input
                                    id="first_name"
                                    value={studentProfile.first_name}
                                    className="col-span-3"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="w-full grid grid-cols-4 gap-4">
                                <Label className="col-span-1">Боловсрол</Label>
                                <Select
                                    value={studentProfile.education_level}
                                    onValueChange={handleSelectChange}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Сонгоно уу"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High School">Ахлах сургууль</SelectItem>
                                        <SelectItem value="Bachelor">Бакалавр</SelectItem>
                                        <SelectItem value="Masters">Магистр</SelectItem>
                                        <SelectItem value="Doctor">Доктор</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <Label className="col-span-1">Сургууль</Label>
                                <Input
                                    id="school"
                                    value={studentProfile.school ? studentProfile.school : ""}
                                    className="col-span-3"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                        <Label className="text-base text-gray-500">Холбогдох</Label>
                        <div className="w-full grid grid-cols-2 gap-8">
                            <div className="grid grid-cols-4 gap-4">
                                <Label className="col-span-1">И-мэйл</Label>
                                <Input
                                    id="email"
                                    value={studentProfile.email}
                                    className="col-span-3"
                                    disabled
                                    required/>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <Label className="col-span-1">Утасны дугаар</Label>
                                <Input
                                    id="phone"
                                    value={studentProfile.phone}
                                    className="col-span-3"
                                    disabled
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <Button className="bg-blue-900 hover:bg-blue-800" onClick={updateProfile}><Save/>Хадгалах</Button>
                </div>
            ) :
                <div className="w-full flex justify-center items-center">Профайл мэдээлэл олдсонгүй.</div>
            }
        </div>
    );
}