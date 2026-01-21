"use client";

import { getSession } from "next-auth/react";
import { BadgeCheck, Boxes, Briefcase, CornerUpLeft, Edit, Mail, Phone, Save, School, Trash, UploadIcon, X } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";


export default function CourseInstructor() {
    const [instructor, setInstructor] = useState(null);
    const { courseId, instructorId } = useParams();
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`http://localhost:8000/api/method/lms_app.api.instructor.get_instructor_profile?instructorId=${instructorId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`,
                    },
                });
                const response = await res.json();
                setInstructor(response.data);
            } catch (error) {
                console.error("Error fetching instructor:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInstructor();
    }, [])

    if(isLoading || !instructor) {
        return <Loading/>
    }
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button variant="ghost" onClick={()=>router.back()} className="mb-4"><CornerUpLeft/> Буцах</Button>
            <div className="rounded-xl shadow-sm border border-[#cfd7e7] overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left w-full">
                            <div className="relative group">
                                <Avatar className="w-44 h-44 shadow border-white border-4">
                                    <AvatarImage src={`${BASE_URL + instructor?.user_image}`} />
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
                                    <div>{instructor?.rating}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-b border-[#cfd7e7] px-6 md:px-8">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        <a className="flex flex-col items-center justify-center border-b-[3px] border-blue-500 text-[#0d121b] pb-3 pt-2 px-1" href="#">
                            <p className="text-sm font-bold leading-normal tracking-wide">Миний тухай</p>
                        </a>
                        <a className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-[#4c669a] pb-3 pt-2 px-1" href="#">
                            <p className="text-sm font-bold leading-normal tracking-wide">Үнэлгээ</p>
                        </a>
                    </div>
                </div>
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
            </div>
        </div>
    );
}