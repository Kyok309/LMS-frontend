"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTrigger, Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function AddQuiz({ lessonId, fetchQuizzes }) {
   const [quiz, setQuiz] = useState(null);
   const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

   const handleInputChange = (e) => {
      const { id, value } = e.target;
      setQuiz(prev => ({
         ...prev,
         [id]: value
      }))
   }

   const createQuiz = async () => {
      try {
         const session = await getSession();
         const quizData = { ...quiz, lesson: lessonId }
         if (parseInt(quizData.passing_score) > 100 || parseInt(quizData.passing_score) < 0) {
            toast.error("Тэнцэх хувь 0-100 хооронд байна.")
            return
         }
         const res = await fetch(`${BACKEND}.quiz.create_quiz`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "Accept": "application/json",
               "Authorization": `Bearer ${session?.user?.accessToken}`
            },
            body: JSON.stringify(quizData)
         })

         const response = await res.json();
         console.log(response);
         if (response.responseType === "ok") {
            toast.success(response.desc)
            fetchQuizzes();
         } else {
            toast.error(response.desc)
         }

      } catch (error) {
         console.log(error);
         toast.error("Шалгалт бүртгэхэд алдаа гарлаа.")
      }
   }
   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button className="bg-blue-900 hover:bg-blue-800"><Plus />Шалгалт нэмэх</Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Шалгалт нэмэх</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-4">
                  <Label htmlFor="title">Нэр</Label>
                  <Input id="title" onChange={handleInputChange} />
               </div>
               <div className="flex flex-col gap-4">
                  <Label htmlFor="description">Тайлбар</Label>
                  <Input id="description" onChange={handleInputChange} />
               </div>
               <div className="flex flex-col gap-4">
                  <Label htmlFor="passing_score">Тэнцэх хувь (%)</Label>
                  <Input id="passing_score" type="number" min="0" max="100" onChange={handleInputChange} />
               </div>
               <div className="flex flex-col gap-4">
                  <Label htmlFor="time_limit_minutes">Шалгалт үргэлжлэх хугацаа (мин)</Label>
                  <Input id="time_limit_minutes" type="number" onChange={handleInputChange} />
               </div>
            </div>
            <DialogFooter>
               <DialogClose asChild>
                  <Button variant="outline" className="border-blue-900 text-blue-900 hover:text-blue-900">Цуцлах</Button>
               </DialogClose>
               <Button onClick={createQuiz} className="bg-blue-900 hover:bg-blue-800">Хадгалах</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}