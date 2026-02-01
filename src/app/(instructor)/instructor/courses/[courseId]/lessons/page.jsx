"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, GripVertical, Plus, SquarePen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { Reorder } from "framer-motion";
import Loading from "@/components/loading";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


export default function Lessons() {
   const { courseId } = useParams();
   const [course, setCourse] = useState();
   const [lessons, setLessons] = useState([]);
   const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
   const [isLoading, setIsLoading] = useState(true);

   const fetchCourse = async () => {
      try {
         const session = await getSession();
         const res = await fetch(`${BACKEND}.course.get_course_instructor?id=${courseId}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Accept": "application/json",
               "Authorization": `Bearer ${session?.user?.accessToken}`
            }
         })
         const response = await res.json();
         console.log(response)
         setCourse(response.data)
      } catch (error) {
         toast.error("Алдаа гарлаа.")
         console.error("Error fetching courses:", error);
      }
   }

   const fetchLessons = async () => {
      try {
         setIsLoading(true);
         const session = await getSession();
         const res = await fetch(`${BACKEND}.lesson.get_lessons_instructor?courseId=${courseId}`, {
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
            setLessons(response.data);

         } else (
            toast.error(response.desc)
         )
      } catch (error) {
         toast.error(error.message);
      } finally {
         setIsLoading(false);
      }
   }

   useEffect(() => {
      fetchCourse();
      fetchLessons();
   }, [])

   const handleReorder = (newOrder) => {
      const updated = newOrder.map((l, i) => ({
         ...l,
         order: i + 1,
      }));

      setLessons(updated);

      const updateLessonsOrder = async () => {
         try {
            const session = await getSession();
            const res = await fetch(`${BACKEND}.lesson.update_lessons_order`, {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  "Authorization": `Bearer ${session?.user?.accessToken}`
               },
               body: JSON.stringify({
                  lessons: updated.map(l => ({
                     name: l.name,
                     order: l.order
                  }))
               })
            })
            const response = await res.json();
            if (response.responseType === "ok") {
               toast.success("Амжилттай өөрчлөгдлөө.");
            } else {
               toast.error("Өөрчлөлт хийхэд алдаа гарлаа.")
            }
         } catch (error) {
            toast.error(error)
         }
      }

      updateLessonsOrder();
   };
   const deleteLesson = async (lessonId) => {
      try {
         const session = await getSession();
         const res = await fetch(`${BACKEND}.lesson.delete_lesson?lessonId=${lessonId}`, {
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
            fetchLessons();
         } else {
            toast.error(response.desc)
         }
      } catch (error) {
         console.log(error)
         toast.error("Хичээл устгахад алдаа гарлаа.")
      }
   }

   if (isLoading) {
      return <Loading />
   }

   return (
      <div className="w-full h-full flex flex-col gap-8">
         <div className="w-full flex justify-between items-center">
            <Breadcrumb>
               <BreadcrumbList>
                  <BreadcrumbItem>
                     <BreadcrumbLink asChild>
                        <Link href="/instructor/courses">Сургалт</Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                     <ChevronRight />
                  </BreadcrumbSeparator>

                  <BreadcrumbItem>
                     <BreadcrumbLink asChild>
                        <Link href={`/instructor/courses/${courseId}`}>{course?.course_title}</Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                     <ChevronRight />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                     <BreadcrumbPage>Хичээлүүд</BreadcrumbPage>
                  </BreadcrumbItem>
               </BreadcrumbList>
            </Breadcrumb>
            <ButtonGroup>
               <Button variant="outline"
                  className="border-blue-800 text-blue-800 hover:text-blue-900">
                  <Link href={`/instructor/courses/${courseId}`}>Сургалт</Link>
               </Button>
               <Button variant="outline"
                  className="border-blue-800  text-white bg-blue-800 hover:bg-blue-900 hover:text-white">Хичээлүүд</Button>
            </ButtonGroup>
         </div>
         <div className="w-full flex justify-between items-center">
            <h3 className="text-lg text-gray-700">{lessons.length} хичээл</h3>
            <Button className="bg-blue-900 hover:bg-blue-800" asChild>
               <Link href={`/instructor/courses/${courseId}/lessons/create`}><Plus /> Хичээл нэмэх</Link>
            </Button>
         </div>
         {/* Lesson list */}
         {
            lessons.length > 0 ?
               <div className="flex flex-col gap-8">
                  <Reorder.Group
                     axis="y"
                     values={lessons}
                     onReorder={handleReorder}
                     className="space-y-2"
                  >
                     {lessons.map((lesson) => (
                        <Reorder.Item
                           key={lesson.name}
                           value={lesson}
                           className="bg-white cursor-grab rounded-2xl shadow p-4 flex items-center justify-between"
                        >
                           <div className="flex gap-4">
                              <span className="text-sm text-blue-500"><GripVertical/></span>
                              <span className="font-medium">
                                 Хичээл {lesson.order}. {lesson.lesson_title}
                              </span>
                           </div>
                           <div className="flex gap-4">
                              <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                    <Button
                                       disabled={isLoading}
                                       variant="outline"
                                       className="w-fit text-red-500"
                                    >
                                       <Trash />
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
                                       <AlertDialogAction onClick={() => { deleteLesson(lesson.name) }}>
                                          Устгах
                                       </AlertDialogAction>
                                    </AlertDialogFooter>
                                 </AlertDialogContent>
                              </AlertDialog>
                              <Button variant="outline" asChild>
                                 <Link href={`/instructor/courses/${courseId}/lessons/${lesson.name}`}>
                                    <SquarePen />
                                 </Link>
                              </Button>
                           </div>
                        </Reorder.Item>
                     ))}
                  </Reorder.Group>
               </div> :
               <div className="w-full h-full flex justify-center mt-10">Хичээл байхгүй байна.</div>
         }
      </div>
   );
}