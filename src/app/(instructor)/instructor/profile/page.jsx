"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadIcon } from "lucide-react";
import { getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
    const [instructor, setInstructor] = useState(null);
    const [isEditting, setIsEditting] = useState(false);
    const fileInputRef = useRef(null);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`http://localhost:8000/api/method/lms_app.api.instructor.get_instructor_profile?instructorId=${session?.user?.user?.email}`, {
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
            }
        }
        fetchInstructor();
    }, [])
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl text-blue-950 font-bold">
                Профайл
            </h2>
            {!isEditting ?
                <div className="w-fit flex flex-col gap-2">
                    {instructor?.user_image && (
                        <div className="w-50">
                            <img src={`${BASE_URL+instructor.user_image}`}/>
                        </div>
                    )}
                    
                </div> :
                <div className="">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadIcon className="mr-2" />
                        {instructor?.user_image ? 'Зураг солих' : 'Зураг сонгох'}
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                    />
                    {instructor?.user_image && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setInstructor(prev => ({ ...prev, user_image: "" }))}
                        >
                            Зураг устгах
                        </Button>
                    )}
                    <div>
                        <Label></Label>
                        <Input/>
                    </div>
                </div>
            }
        </div>
    );
}