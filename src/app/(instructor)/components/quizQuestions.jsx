"use client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Loading from "@/components/loading";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function QuizQuestions({ quizId, fetchQuiz }) {
   const [questions, setQuestions] = useState([]);
   const [answers, setAnswers] = useState([]);
   const [question, setQuestion] = useState({
      quizId: quizId,
      question_text: "",
      question_file: "",
      score: "",
      order: ""
   });
   const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
   const [isLoading, setIsLoading] = useState(false);


   const fetchQuestions = async () => {
      try {
         setIsLoading(true)
         const session = await getSession();
         const res = await fetch(`${BACKEND}.quiz_question.get_quiz_questions_instructor?quizId=${quizId}`, {
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
            setQuestions(response.data);
         }
      } catch (error) {
         console.log(error);
      } finally {
         setIsLoading(false)
      }
   };

   const fetchQuestion = async (questionId) => {
      try {
         const session = await getSession();
         const res = await fetch(`${BACKEND}.quiz_question.get_quiz_question_instructor?quizId=${quizId}&questionId=${questionId}`, {
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
            setQuestion(response.data);
            setAnswers(response.data.quiz_question_answer)
         }
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      fetchQuestions();
   }, [quizId]);

   const clearQuestion = () => {
      setAnswers([]);
      setQuestion({
         quizId: quizId,
         question_text: "",
         question_file: "",
         score: "",
         order: ""
      })
   }

   const addAnswer = () => {
      setAnswers(prev => ([
         ...prev,
         {
            answer_text: "",
            is_correct: false
         }
      ]))
   }
   const handleAnswerChange = (index, field, value) => {
      const changedAnswer = [...answers];
      changedAnswer[index][field] = value;
      setAnswers(changedAnswer);
   }

   const handleInputChange = (e) => {
      const { id, value } = e.target;
      setQuestion(prev => ({
         ...prev,
         [id]: value
      }))
   }
   const handleAnswerCorrect = (index, checked) => {
      const newAnswers = [...answers];
      newAnswers[index].is_correct = Boolean(checked);
      setAnswers(newAnswers);
   };

   const handleFileChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const form = new FormData();
      form.append("file", file);
      form.append("is_private", 1);
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
      const fileUrl = res.message?.file_url;

      setQuestion(prev => ({ ...prev, question_file: fileUrl }))
   }
   const createQuestion = async () => {
      try {
         const session = await getSession();
         const res = await fetch(`${BACKEND}.quiz_question.create_quiz_question`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "Accept": "application/json",
               "Authorization": `Bearer ${session?.user?.accessToken}`
            },
            body: JSON.stringify({
               ...question,
               quiz_question_answer: answers
            })
         })
         const response = await res.json()
         console.log(response)
         if (response.responseType === "ok") {
            toast.success(response.desc)
            clearQuestion();
            fetchQuestions();
            fetchQuiz();
         } else {
            toast.error(response.desc)
         }
      } catch (error) {
         console.log(error)
         toast.error("Асуулт бүртгэхэд алдаа гарлаа.")
      }
   }

   const updateQuestion = async (questionId) => {
      try {
         const session = await getSession();
         const res = await fetch(`${BACKEND}.quiz_question.update_quiz_question`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               "Accept": "application/json",
               "Authorization": `Bearer ${session?.user?.accessToken}`
            },
            body: JSON.stringify({
               ...question,
               quiz: quizId,
               questionId: questionId,
               quiz_question_answer: answers
            })
         })
         const response = await res.json();
         console.log(response);

         if (response.responseType === "ok") {
            toast.success(response.desc);
            fetchQuestions();
            fetchQuiz();
         } else {
            toast.error(response.desc);
         }
      } catch (error) {
         console.log(error);
         toast.error("Асуулт засахад алдаа гарлаа.")
      }
   }

   const deleteQuestion = async (questionId) => {
      try {
         const session = await getSession();
         const res = await fetch(`${BACKEND}.quiz_question.delete_quiz_question?questionId=${questionId}`, {
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
            fetchQuestions();
            fetchQuiz();
         } else {
            toast.error(response.desc)
         }
      } catch (error) {
         console.log(error);
         toast.error("Асуулт устгахад алдаа гарлаа.")
      }
   }

   if (isLoading) {
      return <Loading />
   }

   return (
      <div className="w-full flex flex-col gap-4">
         <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold">Асуултууд</h3>
            <Dialog onOpenChange={clearQuestion}>
               <DialogTrigger asChild>
                  <Button className="bg-blue-900 hover:bg-blue-800">
                     <Plus className="w-4 h-4 mr-2" />
                     Асуулт нэмэх
                  </Button>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Асуулт нэмэх</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col gap-4">
                        <Label htmlFor="question_text">Асуулт текст</Label>
                        <Textarea id="question_text" value={question.question_text} onChange={handleInputChange} />
                     </div>
                     <div className="flex flex-col gap-4">
                        <Label htmlFor="question_file">Файл</Label>
                        <Input id="question_file" type="file" onChange={handleFileChange} />
                     </div>
                     <div className="flex flex-col gap-4">
                        <Label htmlFor="score">Оноо</Label>
                        <Input id="score" type="number" value={question.score} onChange={handleInputChange} />
                     </div>
                     <div className="flex flex-col gap-4">
                        <Label htmlFor="order">Дараалал</Label>
                        <Input id="order" type="number" value={question.order} onChange={handleInputChange} />
                     </div>
                  </div>

                  {answers?.map((answer, index) => (
                     <div key={index} className="flex gap-4">
                        <div className="flex flex-col gap-4">
                           <Label>Хариулт {index + 1}.</Label>
                           <Input
                              value={answer.answer_text}
                              onChange={(e) => { handleAnswerChange(index, "answer_text", e.target.value) }} />
                        </div>
                        <div className="flex flex-col gap-4">
                           <Label>Зөв эсэх</Label>
                           <Checkbox
                              checked={Boolean(answer.is_correct)}
                              onCheckedChange={(checked) => { handleAnswerCorrect(index, checked) }}
                              className="text-white"
                           />
                        </div>
                     </div>
                  ))}
                  <Button onClick={addAnswer}>Хариулт нэмэх</Button>
                  <DialogFooter>
                     <DialogClose asChild>
                        <Button variant="outline" className="border-blue-900 text-blue-900 hover:text-blue-900">
                           Цуцлах
                        </Button>
                     </DialogClose>
                     <Button onClick={createQuestion} className="bg-blue-900 hover:bg-blue-800">
                        Хадгалах
                     </Button>
                  </DialogFooter>
               </DialogContent>
            </Dialog>
         </div>
         {
            questions.length > 0 ?
               <div className="rounded-2xl shadow border overflow-clip">
                  <Table>
                     <TableHeader className="bg-gray-200">
                        <TableRow>
                           <TableHead className="text-center">Дараалал</TableHead>
                           <TableHead className="text-center">Асуултын текст</TableHead>
                           <TableHead className="text-center">Оноо</TableHead>
                           <TableHead className="text-center">Үйлдэл</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {questions?.map((q) => (
                           <TableRow key={q.order}>
                              <TableCell className="text-center">{q.order}</TableCell>
                              <TableCell className="text-center">{q.question_text}</TableCell>
                              <TableCell className="text-center">{q.score}</TableCell>
                              <TableCell className="text-center">
                                 <div className="space-x-4">
                                    <AlertDialog>
                                       <AlertDialogTrigger asChild>
                                          <Button variant="destructive"><Trash />Устгах</Button>
                                       </AlertDialogTrigger>
                                       <AlertDialogContent>
                                          <AlertDialogHeader>
                                             <AlertDialogTitle>Асуултыг устгахдаа итгэлтэй байна уу?</AlertDialogTitle>
                                             <AlertDialogDescription>Уг үйлдлийг буцаах боломжгүй.</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                             <AlertDialogCancel>Цуцлах</AlertDialogCancel>
                                             <AlertDialogAction onClick={() => { deleteQuestion(q.name) }}>
                                                Устгах
                                             </AlertDialogAction>
                                          </AlertDialogFooter>
                                       </AlertDialogContent>
                                    </AlertDialog>
                                    <Dialog onOpenChange={clearQuestion}>
                                       <DialogTrigger asChild>
                                          <Button onClick={() => { fetchQuestion(q.name) }}
                                             variant="outline">
                                             <Edit className="w-4 h-4 mr-2" />
                                             Засах
                                          </Button>
                                       </DialogTrigger>
                                       <DialogContent className="w-[500px]">
                                          <DialogHeader>
                                             <DialogTitle>Асуулт засах</DialogTitle>
                                          </DialogHeader>
                                          <div className="flex flex-col gap-4">
                                             <div className="flex flex-col gap-4">
                                                <Label htmlFor="question_text">Асуулт текст</Label>
                                                <Textarea
                                                   id="question_text"
                                                   value={question.question_text}
                                                   onChange={handleInputChange}
                                                   rows="5"
                                                   cols="60"
                                                   className="resize-y" />
                                             </div>
                                             <div className="flex flex-col gap-4">
                                                <Label htmlFor="question_file">Файл</Label>
                                                <Input id="question_file" type="file" onChange={handleFileChange} />
                                             </div>
                                             <div className="flex flex-col gap-4">
                                                <Label htmlFor="score">Оноо</Label>
                                                <Input id="score" type="number" value={question.score} onChange={handleInputChange} />
                                             </div>
                                             <div className="flex flex-col gap-4">
                                                <Label htmlFor="order">Дараалал</Label>
                                                <Input id="order" type="number" value={question.order} onChange={handleInputChange} />
                                             </div>
                                          </div>

                                          {answers?.map((answer, index) => (
                                             <div key={index} className="flex gap-4">
                                                <div className="w-full flex flex-col gap-4">
                                                   <Label>Хариулт {index + 1}.</Label>
                                                   <Input
                                                      value={answer.answer_text}
                                                      onChange={(e) => { handleAnswerChange(index, "answer_text", e.target.value) }} />
                                                </div>
                                                <div className="flex flex-col gap-4">
                                                   <Label>Зөв эсэх</Label>
                                                   <Checkbox
                                                      checked={answer.is_correct}
                                                      onCheckedChange={(checked) => {handleAnswerCorrect(index, checked)}} />
                                                </div>
                                             </div>
                                          ))}
                                          <Button variant="outline" onClick={addAnswer}><Plus/> Хариулт нэмэх</Button>
                                          <DialogFooter>
                                             <DialogClose asChild>
                                                <Button variant="outline" className="border-blue-900 text-blue-900 hover:text-blue-900">
                                                   Цуцлах
                                                </Button>
                                             </DialogClose>

                                             <Button onClick={() => { updateQuestion(question.name) }} className="bg-blue-900 hover:bg-blue-800">
                                                Хадгалах
                                             </Button>
                                          </DialogFooter>
                                       </DialogContent>
                                    </Dialog>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>
               :
               <div className="w-full h-full flex justify-center mt-10">Асуулт байхгүй байна.</div>
         }
      </div>
   );
}