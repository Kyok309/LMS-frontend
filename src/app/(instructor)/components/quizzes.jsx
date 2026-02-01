"use client";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Timer, Trash } from "lucide-react";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AddQuiz from "./addQuiz";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


export default function Quizzes({ lessonId }) {
    const [quizzes, setQuizzes] = useState([]);
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const { courseId } = useParams();

    const fetchQuizzes = async () => {
        try {
            const session = await getSession();
            const res = await fetch(`${BACKEND}.quiz.get_quizzes_instructor?lessonId=${lessonId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            })
            const response = await res.json();
            console.log(response);
            if (response.responseType === "ok") {
                setQuizzes(response.data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchQuizzes();
    }, [])

    const deleteQuiz = async (quizId) => {
        try {
            const session = await getSession();
            const res = await fetch(`${BACKEND}.quiz.delete_quiz?quizId=${quizId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            })
            const response = await res.json();
            console.log(response);
            if (response.responseType === "ok") {
                toast.success(response.desc)
                fetchQuizzes();
            }
            else {
                toast.error(response.desc)
            }
        } catch (error) {
            console.log(error);
            toast.error("Шалгалт устгахад алдаа гарлаа.")
        }
    }
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="w-full flex justify-between">
                <h2 className="text-2xl font-semibold">Шалгалт</h2>
                {quizzes.length === 0 && <AddQuiz lessonId={lessonId} fetchQuizzes={fetchQuizzes} />}
            </div>
            {quizzes.length > 0 ?
                <div className="rounded-2xl shadow border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-200">
                            <TableRow>
                                <TableHead className="text-center">№</TableHead>
                                <TableHead className="text-center">Нэр</TableHead>
                                <TableHead className="text-center">Тайлбар</TableHead>
                                <TableHead className="text-center">Тэнцэх хувь</TableHead>
                                <TableHead className="text-center">Шалгалтын хугацаа (Минут)</TableHead>
                                <TableHead className="text-center">Үйлдэл</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white">
                            {quizzes.map((quiz, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                    <TableCell className="text-center">{quiz.title}</TableCell>
                                    <TableCell className="text-center">{quiz.description}</TableCell>
                                    <TableCell className="text-center">{quiz.passing_score}</TableCell>
                                    <TableCell className="text-center">{quiz.time_limit_minutes}</TableCell>
                                    <TableCell className="space-x-4 text-center">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive"><Trash />Устгах</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Шалгалтыг устгахдаа итгэлтэй байна уу?</AlertDialogTitle>
                                                    <AlertDialogDescription>Уг үйлдлийг буцаах боломжгүй.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Цуцлах</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => { deleteQuiz(quiz.name) }}>
                                                        Устгах
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        <Button variant="outline" asChild>
                                            <Link href={`/instructor/courses/${courseId}/lessons/${lessonId}/${quiz.name}`}><Edit /> Засах</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                :
                <div className="w-full h-full flex justify-center mt-10">Шалгалт байхгүй байна.</div>
            }
        </div>
    );
}