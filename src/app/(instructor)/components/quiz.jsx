"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Edit, FileText, GraduationCap, Save, Star } from "lucide-react";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { formatDateTime } from "@/lib/utils";
import { useState } from "react";

export default function Quiz({ quiz, setQuiz }) {
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const [isEditting, setIsEditting] = useState(false);

    const updateQuiz = async () => {
        try {
            if (parseInt(quiz.passing_score) > 100 || parseInt(quiz.passing_score) < 0) {
                toast.error("Тэнцэх хувь 0-100 хооронд байна.")
                return
            }
            const session = await getSession();
            const res = await fetch(`${BACKEND}.quiz.update_quiz`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                body: JSON.stringify({
                    quizId: quiz.name,
                    title: quiz.title,
                    description: quiz.description,
                    passing_score: quiz.passing_score,
                    time_limit_minutes: quiz.time_limit_minutes
                })
            });
            const response = await res.json();
            if (response.responseType === "ok") {
                toast.success(response.desc);
                setIsEditting(false);
            } else {
                toast.error(response.desc);
            }
        } catch (error) {
            console.log(error);
            toast.error("Шалгалт засахад алдаа гарлаа.");
        }
    };

    return (
        <div className="w-full flex flex-col items-end gap-4">
            <div className="w-full flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{quiz.title}</h2>
                {isEditting ?
                    <Button onClick={updateQuiz} className="bg-blue-900 hover:bg-blue-800">
                        <Save className="w-4 h-4 mr-2" />
                        Хадгалах
                    </Button> :
                    <Button onClick={() => { setIsEditting(true) }} variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Засах
                    </Button>
                }
            </div>
            {
                !isEditting ?
                    <div className="w-full flex flex-col gap-8">
                        <div className="w-full flex gap-8">
                            <div className="w-full flex flex-col gap-1 rounded-xl p-5 border border-[#e5e7eb] bg-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="text-blue-500" />
                                    <p className="text-[#637588] text-sm font-medium uppercase tracking-wider">Шалгалтын хугацаа</p>
                                </div>
                                <p className="text-[#111418] text-3xl font-semibold leading-tight">{quiz.time_limit_minutes} мин</p>
                            </div>
                            <div className="w-full flex flex-col gap-1 rounded-xl p-5 border border-[#e5e7eb] bg-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <Star className="text-blue-500" />
                                    <p className="text-[#637588] text-sm font-medium uppercase tracking-wider">Нийт оноо</p>
                                </div>
                                <p className="text-[#111418] text-3xl font-semibold leading-tight">{quiz.total_score}</p>
                            </div>
                            <div className="w-full flex flex-col gap-1 rounded-xl p-5 border border-[#e5e7eb] bg-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <GraduationCap className="text-blue-500" />
                                    <p className="text-[#637588] text-sm font-medium uppercase tracking-wider">Тэнцэх хувь</p>
                                </div>
                                <p className="text-[#111418] text-3xl font-semibold leading-tight">{quiz.passing_score}%</p>
                            </div>
                        </div>
                        <div className="w-full rounded-xl border border-[#e5e7eb] bg-white p-5 md:p-6">
                            <div className="flex items-start gap-4">
                                <div className="hidden sm:flex items-center justify-center size-10 rounded-full bg-blue-50 text-primary shrink-0">
                                    <FileText className="text-blue-500"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-bold text-[#111418]">Тайлбар</h3>
                                    <p className="text-[#637588] text-base leading-relaxed">
                                        {quiz.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> :
                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="title">Нэр</Label>
                            <Input
                                id="title"
                                value={quiz.title || ""}
                                onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="passing_score">Тэнцэх хувь</Label>
                            <Input
                                id="passing_score"
                                type="number"
                                value={quiz.passing_score || ""}
                                onChange={(e) => setQuiz(prev => ({ ...prev, passing_score: parseInt(e.target.value) }))}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="description">Тайлбар</Label>
                            <Textarea
                                id="description"
                                value={quiz.description || ""}
                                onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="time_limit_minutes">Шалгалтын хугацаа (Минут)</Label>
                            <Input
                                id="time_limit_minutes"
                                type="number"
                                value={quiz.time_limit_minutes || ""}
                                onChange={(e) => setQuiz(prev => ({ ...prev, time_limit_minutes: parseInt(e.target.value) }))}
                            />
                        </div>
                    </div>
            }
            <div className="text-sm text-gray-500">
                Үүсгэсэн: {formatDateTime(quiz.creation)} | Өөрчилсөн: {formatDateTime(quiz.modified)}
            </div>
        </div >
    );
}