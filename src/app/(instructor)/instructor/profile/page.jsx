"use client";

import ReviewList from "@/components/instructorReview";
import Loading from "@/components/loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BadgeCheck, Boxes, Briefcase, Edit, Mail, Phone, Save, School, Star, Trash, UploadIcon, X } from "lucide-react";
import { getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
    const [instructor, setInstructor] = useState(null);
    const [isEditting, setIsEditting] = useState(false);
    const fileInputRef = useRef(null);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const [isLoading, setIsLoading] = useState(true);
    const [ currentView, setCurrentView ] = useState("about");

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                setIsLoading(true);
                const session = await getSession();
                const res = await fetch(`${BACKEND}.instructor.get_instructor_profile?instructorId=${session?.user?.user?.email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "applicatin/json"
                    }
                })
                const response = await res.json();
                console.log(response)
                if (response.responseType === "error") {
                    toast.error(response.desc);
                    return
                }
                setInstructor(response.data)
            } catch (error) {
                toast.error(error.message)
            } finally {
                setIsLoading(false);
            }
        }
        fetchInstructor();
    }, [])

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setInstructor(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        console.log(e.target.files)
        console.log(e.target)
        if (!file) return;

        const form = new FormData();
        form.append("file", file);
        form.append("doctype", "User");
        form.append("docname", instructor.name)
        const session = await getSession();

        const upload = await fetch(`${BASE_URL}/api/method/upload_file`, {
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

        setInstructor(prev => ({
            ...prev,
            user_image: fileUrl
        }))
    }

    const updateInstructor = async () => {
        try {
            const session = await getSession();
            const res = await fetch(`${BACKEND}.instructor.update_instructor_profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                body: JSON.stringify(instructor)
            })
            const response = await res.json();
            console.log(response)

            if (response.responseType === "ok") {
                toast.success(response.desc);
                setIsEditting(false);
            } else {
                toast.error(response.desc);
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (isLoading && !instructor) {
        return <Loading />
    }
    return (
        <div className="w-full bg-white flex flex-col gap-6">
            {!isEditting ?
                <div className="rounded-xl shadow-sm border border-[#cfd7e7] overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left w-full">
                                <div className="relative group">
                                    <Avatar className="w-44 h-44 shadow border-white border-4">
                                        <AvatarImage src={`${BASE_URL}/api/method/frappe.utils.file_manager.download_file?file_url=${instructor?.user_image}`}/>
                                    </Avatar>
                                    <div className="absolute bottom-1 right-1 bg-green-500 border-2 border-white size-5 rounded-full"></div>
                                </div>
                                <div className="flex flex-col justify-center gap-1 mt-2">
                                    <h2 className="text-[#0d121b] text-2xl md:text-3xl font-bold leading-tight tracking-tight">{instructor?.first_name + " " + instructor?.last_name}</h2>
                                    <p className="text-[#4c669a] text-base md:text-lg font-normal">{instructor?.profession}</p>
                                    <div className="flex gap-2 mt-2 justify-center sm:justify-start">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <BadgeCheck /> Баталгаажсан
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Star fill="#fcc800" className="text-yellow-400"/> {instructor?.rating.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                className="bg-blue-900 hover:bg-blue-800"
                                onClick={() => { setIsEditting(true) }}>
                                <Edit />
                                <span>Засах</span>
                            </Button>
                        </div>
                    </div>
                    <div className="border-b border-[#cfd7e7] px-6 md:px-8">
                        {currentView === "about" ?
                            <div className="flex gap-8 overflow-x-auto no-scrollbar">
                                <button className="flex items-center justify-center border-b-[3px] border-blue-500 text-[#0d121b] pb-3 pt-2 px-1" onClick={() => {setCurrentView("about")}}>
                                    <p className="text-sm font-bold leading-normal tracking-wide">Миний тухай</p>
                                </button>
                                <button className="flex items-center justify-center border-b-[3px] border-transparent text-[#4c669a] pb-3 pt-2 px-1" onClick={() => {setCurrentView("rating")}}>
                                    <p className="text-sm font-bold leading-normal tracking-wide">Үнэлгээ</p>
                                </button>
                            </div>
                            :
                            <div className="flex gap-8 overflow-x-auto no-scrollbar">
                                <button className="flex items-center justify-center border-b-[3px] border-transparent text-[#4c669a]  pb-3 pt-2 px-1" onClick={() => {setCurrentView("about")}}>
                                    <p className="text-sm font-bold leading-normal tracking-wide">Миний тухай</p>
                                </button>
                                <button className="flex items-center justify-center border-b-[3px] border-blue-500 text-[#0d121b] pb-3 pt-2 px-1" onClick={() => {setCurrentView("rating")}}>
                                    <p className="text-sm font-bold leading-normal tracking-wide">Үнэлгээ</p>
                                </button>
                            </div>
                        }
                    </div>
                    {currentView === "about" ? 
                        <div className="flex flex-col gap-4 p-6 md:p-8">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold text-[#0d121b]">Био</h3>
                                <div className="w-full">{instructor?.bio}</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold text-[#0d121b]">Хувийн мэдээлэл</h3>
                                <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 gap-y-0">
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-b md:border-b-0 border-[#cfd7e7] py-5 items-center group hover:bg-gray-50 rounded-lg px-2 -mx-2">
                                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                                            <div className="text-blue-500 size-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                <School />
                                            </div>
                                            <p className="text-[#4c669a] text-sm font-medium">Мэргэшил</p>
                                        </div>
                                        <p className="text-[#0d121b] text-sm font-medium leading-relaxed pl-11 md:pl-0">{instructor?.qualification}</p>
                                    </div>
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-b md:border-b-0 border-t border-[#cfd7e7] py-5 items-center group hover:bg-gray-50 rounded-lg px-2 -mx-2">
                                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                                            <div className="text-blue-500 size-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                <Boxes />
                                            </div>
                                            <p className="text-[#4c669a] text-sm font-medium">Чадвар</p>
                                        </div>
                                        <p className="text-[#0d121b] text-sm font-medium leading-relaxed pl-11 md:pl-0">{instructor?.expertise}</p>
                                    </div>
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-b md:border-b-0 border-t border-[#cfd7e7] py-5 items-center group hover:bg-gray-50 rounded-lg px-2 -mx-2">
                                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                                            <div className="text-blue-500 size-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                <Briefcase />
                                            </div>
                                            <p className="text-[#4c669a] text-sm font-medium">Туршлага</p>
                                        </div>
                                        <p className="text-[#0d121b] text-sm font-medium leading-relaxed pl-11 md:pl-0">{instructor?.experience}</p>
                                    </div>
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-t border-[#cfd7e7]  py-5 items-center group hover:bg-gray-50 rounded-lg px-2 -mx-2">
                                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                                            <div className="text-blue-500 size-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                <Phone />
                                            </div>
                                            <p className="text-[#4c669a] text-sm font-medium">Утасны дугаар</p>
                                        </div>
                                        <p className="text-[#0d121b] text-sm font-medium leading-relaxed pl-11 md:pl-0">{instructor?.phone}</p>
                                    </div>
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-t border-[#cfd7e7] py-5 items-center group hover:bg-gray-50 rounded-lg px-2 -mx-2">
                                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                                            <div className="text-blue-500 size-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                <Phone />
                                            </div>
                                            <p className="text-[#4c669a] text-sm font-medium">И-мейл</p>
                                        </div>
                                        <p className="text-[#0d121b] text-sm font-medium leading-relaxed pl-11 md:pl-0">{instructor?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="flex flex-col gap-4 p-6 md:p-8">
                            <ReviewList instructorId={instructor?.name}/>
                        </div>
                    }
                </div>
                :
                <div className="flex flex-col gap-8 rounded-xl p-8 shadow-sm border border-[#cfd7e7] overflow-hidden">
                    <div className="w-full flex justify-between">
                        <div className="flex gap-12">
                            <div className="flex flex-col gap-4">
                                <div className="relative group">
                                    <Avatar className="w-44 h-44 shadow border-white border-4">
                                        <AvatarImage src={`${BASE_URL }/api/method/frappe.utils.file_manager.download_file?file_url=${instructor?.user_image}`} />
                                    </Avatar>
                                    <div className="absolute bottom-1 right-1 bg-green-500 border-2 border-white size-5 rounded-full"></div>
                                </div>
                                <div className="flex justify-center gap-4">
                                    {instructor?.user_image && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => setInstructor(prev => ({ ...prev, user_image: "" }))}
                                        >
                                            <Trash />
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <UploadIcon />
                                    </Button>
                                    <Input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex  gap-4">
                                    <div className="flex flex-col gap-4">
                                        <Label htmlFor="last_name">Овог</Label>
                                        <Input id="last_name" value={instructor?.last_name} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <Label htmlFor="first_name">Нэр</Label>
                                        <Input id="first_name" value={instructor?.first_name} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="profession">Мэргэжил</Label>
                                    <Input id="profession" value={instructor?.profession} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="border-blue-900 text-blue-900 hover:text-blue-900"
                                onClick={() => { setIsEditting(false) }}
                            >
                                <X /> Цуцлах
                            </Button>
                            <Button
                                onClick={updateInstructor}
                                className="bg-blue-900 hover:bg-blue-800"
                            >
                                <Save /> Хадгалах
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-[#0d121b]">Био</h3>
                            <Textarea
                                id="bio"
                                value={instructor?.bio}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-[#0d121b]">Хувийн мэдээлэл</h3>
                            <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 gap-y-0">
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-b md:border-b-0 border-[#cfd7e7] py-5 items-center group hover:bg-gray-50 rounded-lg px-2 -mx-2">
                                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                                        <div className="text-blue-500 size-10 rounded-full bg-blue-50 flex items-center justify-center">
                                            <School />
                                        </div>
                                        <p className="text-[#4c669a] text-sm font-medium">Мэргэшил</p>
                                    </div>
                                    <Input
                                        id="qualification"
                                        value={instructor?.qualification}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-b md:border-b-0 border-t border-[#cfd7e7] py-5 items-center group hover:bg-gray-50 rounded-lg px-2 -mx-2">
                                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                                        <div className="text-blue-500 size-10 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Boxes />
                                        </div>
                                        <p className="text-[#4c669a] text-sm font-medium">Чадвар</p>
                                    </div>
                                    <Input
                                        id="expertise"
                                        value={instructor?.expertise}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-b md:border-b-0 border-t border-[#cfd7e7] py-5 items-center group hover:bg-gray-50 rounded-lg px-2 -mx-2">
                                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                                        <div className="text-blue-500 size-10 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Briefcase />
                                        </div>
                                        <p className="text-[#4c669a] text-sm font-medium">Туршлага</p>
                                    </div>
                                    <Input
                                        id="experience"
                                        value={instructor?.experience}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-subgrid border-t border-[#cfd7e7]  py-5 items-center group hover:bg-gray-50 rounded-lg px-2 -mx-2">
                                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                                        <div className="text-blue-500 size-10 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Phone />
                                        </div>
                                        <p className="text-[#4c669a] text-sm font-medium">Утасны дугаар</p>
                                    </div>
                                    <Input
                                        id="phone"
                                        value={instructor?.phone}
                                        type="number"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}