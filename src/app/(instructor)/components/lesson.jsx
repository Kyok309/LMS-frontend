"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { File, LayoutDashboard, Link2, Plus, Save, TextInitial, Trash, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Lesson({ lesson, setLesson, isLoading }) {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const router = useRouter();

    const updateContent = (index, field, value) => {
        const updated = [...lesson.lesson_content]
        updated[index][field] = value
        setLesson(prev => ({ ...prev, lesson_content: updated }))
    }

    const addContent = (type) => {
        setLesson(prev => ({
            ...prev,
            lesson_content: [
                ...prev.lesson_content,
                { content_type: type, order: lesson.lesson_content.length + 1 }
            ]
        }))
    }

    const deleteContent = (index) => {
        const newContents = lesson.lesson_content.toSpliced(index, 1)
        setLesson(prev => ({
            ...prev,
            lesson_content: newContents
        }))
    }
    
    const handleFileChange = async (e, field, index) => {
        const file = e.target.files?.[0];
        console.log(e.target.files?.[0])
        if (!file) return;

        const form = new FormData();
        form.append("file", file);
        form.append("is_private", 1);
        const session = await getSession();

        const upload = await fetch(`${BACKEND}/api/method/upload_file`, {
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

        const updated = [...lesson.lesson_content]
        console.log(index)
        updated[index][field] = fileUrl;
        setLesson(prev => ({ ...prev, lesson_content: updated }))

        console.log(lesson)
    }

    const updateLesson = async () => {
        try {
            const session = await getSession();
            const res = await fetch(`${BACKEND}.lesson.update_lesson`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                body: JSON.stringify(lesson)
            })

            const response = await res.json()
            console.log(response)
            if (response.responseType === "ok") {
                toast.success(response.desc)
            } else {
                toast.error(response.desc)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteLesson = async () => {
        try {
            const session = await getSession();
            const res = await fetch(`${BACKEND}.lesson.delete_lesson?lessonId=${lesson?.name}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            })

            const response = await res.json();
            console.log(response)

            if (response.responseType === "ok") {
                toast.success(response.desc);

                router.push(`/instructor/courses/${courseId}/lessons`)
            } else {
                toast.error(response.desc)
            }
        } catch (error) {
            console.log(error)
            toast.error("Хичээл устгахад алдаа гарлаа.")
        }
    }
    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="w-full flex justify-between">
                <h2 className="text-2xl font-semibold">Хичээл</h2>
                <div className="flex gap-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                disabled={isLoading}
                                variant="destructive"
                            >
                                <Trash /> Устгах
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Та энэ хичээлийг устгахдаа итгэлтэй байна уу?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Уг үйлдлийг буцаах боломжгүй болно.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Цуцлах</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteLesson}>
                                    Устгах
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button
                        onClick={updateLesson}
                        disabled={isLoading}
                        className="w-fit bg-blue-900 hover:bg-blue-800"
                    >
                        <Save /> {isLoading ? "Хадгалж байна..." : "Хадгалах"}
                    </Button>
                </div>
            </div>
            <div className="w-full columns-2 gap-8">
                <div className="break-inside-avoid mb-8 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-100 rounded-full">
                            <LayoutDashboard className="text-blue-700" />
                        </div>
                        <h3 className="text-lg font-semibold">Хичээлийн мэдээлэл засах</h3>
                    </div>
                    <div className="bg-white flex flex-col gap-6 border rounded-lg p-4">
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="lesson_title">Хичээлийн нэр</Label>
                            <Input
                                id="lesson_title"
                                placeholder="Хичээлийн нэр"
                                value={lesson?.lesson_title || ""}
                                onChange={e => setLesson(prev => ({ ...prev, lesson_title: e.target.value }))}
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <Label htmlFor="description">Тайлбар</Label>
                            <Textarea
                                id="description"
                                placeholder="Тайлбар"
                                value={lesson?.description || ""}
                                onChange={e => setLesson(prev => ({ ...prev, description: e.target.value }))}
                                className="h-[200px]"
                            />
                        </div>
                    </div>
                </div>

                <div className="break-inside-avoid mb-8 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-100 rounded-full">
                            <Video className="text-blue-700" />
                        </div>
                        <h3 className="text-lg font-semibold">Бичлэг</h3>
                    </div>
                    {lesson?.lesson_content.map((item, index) => {
                        if (item.content_type !== "Video") return null;
                        return (
                            <div key={index} className="bg-white relative flex flex-col gap-6 border py-8 px-6 rounded-lg">
                                <Button
                                    onClick={()=>{deleteContent(index)}}
                                    className="w-fit absolute top-4 right-6"
                                    variant="secondary"
                                >
                                    <Trash/>
                                </Button>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="video">Видео</Label>
                                    {
                                        item.video_url ?
                                        <>
                                            <video src={BASE_URL + item.video_url} controls width="150" />
                                            <div>{item.video_url}</div>
                                        </>  : null
                                    }
                                    <Input
                                        id="video"
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleFileChange(e, "video_url", index)}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="order">Дараалал</Label>
                                    <Input
                                        type="number"
                                        placeholder="Дараалал"
                                        value={item.order || ""}
                                        onChange={e =>
                                            updateContent(index, "order", Number(e.target.value))
                                        }
                                    />
                                </div>
                            </div>
                        );
                    })}
                    <Button variant="outline" onClick={() => addContent("Video")}>
                        <Plus /> Нэмэх
                    </Button>
                </div>

                <div className="break-inside-avoid mb-8 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-100 rounded-full">
                            <TextInitial className="text-blue-700" />
                        </div>
                        <h3 className="text-lg font-semibold">Текст контент</h3>
                    </div>
                    {lesson?.lesson_content.map((item, index) => {
                        if (item.content_type !== "Text") return null;
                        return (
                            <div key={index} className="bg-white relative flex flex-col border py-8 px-6 rounded-lg gap-6">
                                <Button
                                    onClick={()=>{deleteContent(index)}}
                                    className="w-fit absolute top-4 right-6"
                                    variant="secondary"
                                >
                                    <Trash/>
                                </Button>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="text">Текст</Label>
                                    <Textarea
                                        id="text"
                                        placeholder="Текст"
                                        value={item.text_content || ""}
                                        onChange={e => updateContent(index, "text_content", e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="order">Дараалал</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        placeholder="Дараалал"
                                        value={item.order || ""}
                                        onChange={e =>
                                            updateContent(index, "order", Number(e.target.value))
                                        }
                                    />
                                </div>
                            </div>
                        );
                    })}
                    <Button variant="outline" onClick={() => addContent("Text")}>
                        <Plus /> Нэмэх
                    </Button>
                </div>

                <div className="break-inside-avoid mb-8 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-100 rounded-full">
                            <File className="text-blue-700" />
                        </div>
                        <h3 className="text-lg font-semibold">Файл</h3>
                    </div>
                    {lesson?.lesson_content.map((item, index) => {
                        if (item.content_type !== "File") return null;
                        return (
                            <div key={index} className="bg-white relative flex flex-col gap-6 border py-8 px-6 rounded-lg">
                                <Button
                                    onClick={()=>{deleteContent(index)}}
                                    className="w-fit absolute top-4 right-6"
                                    variant="secondary"
                                >
                                    <Trash/>
                                </Button>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="file">Файл</Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        accept=".doc,.docx,.pdf,.xls,.xlsx"
                                        onChange={(e) => handleFileChange(e, "attachment", index)}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="order">Дараалал</Label>
                                    <Input
                                        type="number"
                                        placeholder="Дараалал"
                                        value={item.order || ""}
                                        onChange={e =>
                                            updateContent(index, "order", Number(e.target.value))
                                        }
                                    />
                                </div>
                            </div>
                        );
                    })}
                    <Button variant="outline" onClick={() => addContent("File")}>
                        <Plus /> Нэмэх
                    </Button>
                </div>
                <div className="break-inside-avoid mb-8 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-100 rounded-full">
                            <Link2 className="text-blue-700" />
                        </div>
                        <h3 className="text-lg font-semibold">Холбоос</h3>
                    </div>
                    {lesson?.lesson_content.map((item, index) => {
                        if (item.content_type !== "Link") return null;
                        return (
                            <div key={index} className="bg-white relative flex flex-col gap-6 border py-8 px-6 rounded-lg">
                                <Button
                                    onClick={()=>{deleteContent(index)}}
                                    className="w-fit absolute top-4 right-6"
                                    variant="secondary"
                                >
                                    <Trash/>
                                </Button>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="Link">Холбоос</Label>
                                    <Input
                                        placeholder="Холбоос"
                                        value={item.external_link || ""}
                                        onChange={e => updateContent(index, "external_link", e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="order">Дараалал</Label>
                                    <Input
                                        type="number"
                                        placeholder="Дараалал"
                                        value={item.order || ""}
                                        onChange={e =>
                                            updateContent(index, "order", Number(e.target.value))
                                        }
                                    />
                                </div>
                            </div>
                        );
                    })}
                    <Button variant="outline" onClick={() => addContent("Link")}>
                        <Plus /> Нэмэх
                    </Button>
                </div>
            </div>
        </div>
    );
}