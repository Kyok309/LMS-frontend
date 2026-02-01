"use client";
import Loading from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, Circle, Clock, CornerUpLeft, Dot, FileText, GraduationCap, History, Star } from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Quiz() {
    const { quizId, lessonId, courseId } = useParams();
    const [quiz, setQuiz] = useState();
    const [quizQuestions, setQuizQuestions] = useState([]);
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const [isLoading, setIsLoading] = useState(true);
    const [isStarted, setIsStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);
    const isSubmittingRef = useRef(false);


    const fetchQuiz = async () => {
        try {
            setIsLoading(true);
            const session = await getSession();
            const res = await fetch(`${BACKEND}.quiz.get_quiz?quizId=${quizId}&courseId=${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            })
            const response = await res.json()
            console.log(response);

            if (response.responseType === "ok") {
                setQuiz(response.data);
            } else {
                toast.error(response.desc);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchQuizQuestions = async () => {
        try {
            setIsLoading(true);
            const session = await getSession();
            const res = await fetch(`${BACKEND}.quiz_question.get_quiz_questions?quizId=${quizId}&courseId=${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            })
            const response = await res.json()
            console.log(response);

            if (response.responseType === "ok") {
                setQuizQuestions(response.data);
            } else {
                toast.error(response.desc);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchSubmissions = async () => {
        try {
            const session = await getSession();
            const res = await fetch(`${BACKEND}.submission.get_quiz_submissions?quizId=${quizId}&courseId=${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            });
            const response = await res.json();
            console.log(response);
            if (response.responseType === "ok") {
                setSubmissions(response.data);
                if (response.data.length > 0) {
                    setIsStarted(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchQuiz();
        fetchQuizQuestions();
        fetchSubmissions();
    }, [])



    const handleStartQuiz = () => {
        setIsStarted(true);
        setTimeLeft(quiz.time_limit_minutes * 60);
    }
    const handleSelectedAnswers = (questionId, answerId) => {
        setSelectedAnswers((prevAnswers) => {
            const existingAnswerIndex = prevAnswers.findIndex(
                (answer) => answer.quiz_question === questionId
            );

            if (existingAnswerIndex !== -1) {
                const updatedAnswers = [...prevAnswers];
                updatedAnswers[existingAnswerIndex].quiz_question_answer = answerId;
                console.log(updatedAnswers)
                return updatedAnswers;
            } else {
                console.log("new")
                return [...prevAnswers, { quiz_question: questionId, quiz_question_answer: answerId }];
            }
        });
    }

    const handleSubmitQuiz = () => {
        const submitQuizResult = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`${BACKEND}.submission.create_quiz_submission`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`
                    },
                    body: JSON.stringify({
                        quizId: quiz.name,
                        courseId: courseId,
                        student_answers: selectedAnswers
                    })
                });
                const response = await res.json();
                console.log(response);
                if (response.responseType === "ok") {
                    toast.success("Шалгалтын үр дүн амжилттай хадгалагдлаа.");

                } else {
                    toast.error(response.desc);
                }
            } catch (error) {
                console.log(error);
            } finally {
                isSubmittingRef.current = false;
            }
        };
        submitQuizResult();
        fetchSubmissions();
        setSelectedAnswers([]);
        setCurrentQuestion(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (!isSubmittingRef.current) {
                        isSubmittingRef.current = true;
                        handleSubmitQuiz();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, handleSubmitQuiz]);

    if (isLoading) {
        return <Loading />
    }
    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 p-8 mt-8 border rounded-2xl shadow">
            {isStarted ?
                <div>
                    {quizQuestions && quizQuestions.length > 0 ? (
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Асуулт {currentQuestion + 1} / {quizQuestions.length}
                                </h2>
                                <div className={`text-4xl font-bold ${timeLeft <= 60 ? 'text-red-600' : 'text-indigo-600'}`}>
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                            <div className="p-6 border rounded-lg mb-4">
                                <p className="text-lg">{quizQuestions[currentQuestion].question_text}</p>

                                <div className="mt-4 space-y-3">
                                    {quizQuestions[currentQuestion].quiz_question_answer.map((answer, index) => {
                                        const questionId = quizQuestions[currentQuestion].name;
                                        const isSelected = selectedAnswers.find(
                                            (ans) => ans.quiz_question === questionId
                                        )?.quiz_question_answer === answer.name;

                                        return (
                                            <div key={index} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`answer_${questionId}_${answer.name}`}
                                                    name={`question_${questionId}`}
                                                    value={answer.name}
                                                    checked={isSelected}
                                                    onChange={() => {
                                                        handleSelectedAnswers(questionId, answer.name);
                                                    }}
                                                    className="mr-3"
                                                />
                                                <label htmlFor={`answer_${questionId}_${answer.name}`}>
                                                    {answer.answer_text}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    disabled={currentQuestion === 0}
                                    onClick={() => setCurrentQuestion(prev => prev - 1)}>
                                    Өмнөх
                                </Button>
                                {currentQuestion < quizQuestions.length - 1 ? (
                                    <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>
                                        Дараах
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-500">
                                        Шалгалт дуусгах
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Шалгалтын асуултууд олдсонгүй.</p>
                    )}
                </div>
                :
                <>
                    <h2 className="text-2xl font-semibold">{quiz?.title}</h2>
                    <div className="w-full rounded-xl border border-[#e5e7eb] shadow-sm bg-white p-5 md:p-6">
                        <div className="flex items-start gap-4">
                            <div className="hidden sm:flex items-center justify-center size-10 rounded-full bg-blue-50 text-primary shrink-0">
                                <FileText className="text-blue-00" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-[#111418]">Тайлбар</h3>
                                <p className="text-[#637588] text-base leading-relaxed">
                                    {quiz?.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-between gap-8">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#637588] text-sm font-medium uppercase tracking-wider">
                                    <Star className="shrink-0 text-blue-600" /> Нийт оноо
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-[#111418] text-3xl font-semibold leading-tight">
                                {quiz?.total_score}
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#637588] text-sm font-medium uppercase tracking-wider">
                                    <GraduationCap className="shrink-0 text-blue-600" /> Тэнцэх хувь
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-[#111418] text-3xl font-semibold leading-tight">
                                {quiz?.passing_score}%
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#637588] text-sm font-medium uppercase tracking-wider">
                                    <Clock className="shrink-0 text-blue-600" /> Шалгалт үргэлжлэх хугацаа
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-[#111418] text-3xl font-semibold leading-tight">
                                {quiz?.time_limit_minutes} мин
                            </CardContent>
                        </Card>
                    </div>
                    <div className="w-full flex gap-4 justify-end">
                        <Button variant="outline" className="w-fit border-blue-900 text-blue-900 hover:text-blue-900" asChild>
                            <Link href={`/courses/${courseId}/lessons/${lessonId}`}><CornerUpLeft /> Буцах</Link>
                        </Button>
                        <Button
                            className="w-fit bg-blue-900 hover:bg-blue-800"
                            onClick={handleStartQuiz}>
                            Шалгалт эхлүүлэх <ChevronRight />
                        </Button>
                    </div>
                    <div>
                        {submissions.length > 0 &&
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl font-semibold flex gap-2 items-center">
                                    <History className="text-blue-600" /> Таны өмнөх шалгалтууд
                                </h3>
                                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-gray-100">
                                            <TableRow>
                                                <TableHead className="px-8">№</TableHead>
                                                <TableHead>Огноо</TableHead>
                                                <TableHead>Нийт оноо</TableHead>
                                                <TableHead>Хувь</TableHead>
                                                <TableHead>Тэнцсэн эсэх</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {submissions?.map((submission, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="px-8">#{index + 1}</TableCell>
                                                    <TableCell>{new Date(submission.creation).toLocaleString()}</TableCell>
                                                    <TableCell>{submission.score} / {quiz.total_score}</TableCell>
                                                    <TableCell>{submission.score_percent.toFixed(2)}%</TableCell>
                                                    <TableCell>
                                                        {submission.passed ?
                                                            <Badge size="lg" className="h-8 bg-green-200 text-green-600">
                                                                <Circle fill="#00c951" className="text-green-100" /> Тэнцсэн
                                                            </Badge>
                                                            :
                                                            <Badge size="lg" className="h-8 bg-red-200 text-red-600">
                                                                <Circle fill="#fb2c36" className="text-red-100" /> Тэнцээгүй
                                                            </Badge>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        }
                    </div>
                </>
            }
        </div>
    );
}