"use client";
import LessonsList from "@/app/(student)/components/lessons";
import { useParams } from "next/navigation";

export default function LessonLayout({ children }) {
  const {courseId, lessonId} = useParams();
  return (
    <div className="max-w-7xl h-full flex gap-8 mx-auto py-10">
        <LessonsList courseId={courseId} lessonId={lessonId}/>
        <div className="w-full h-full flex-1">
          {children}
        </div>
    </div>
  );
}