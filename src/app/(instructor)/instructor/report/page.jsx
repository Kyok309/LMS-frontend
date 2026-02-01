"use client";

import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { formatDateTime, formatMoney } from "@/lib/utils";
import Loading from "@/components/loading";

export default function InstructorReport() {
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const [ reportData, setReportData ] = useState();
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setIsLoading(true);
                const session = await getSession();
                const res = await fetch(`${BACKEND}.report.get_report_instructor`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`
                    }
                })
                const response = await res.json();
                console.log(response)
                setReportData(response.data);
            } catch (error) {
                console.log(error)
                toast.error("Тайлангийн мэдээлэл авахад алдаа гарлаа.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchReport();
    }, [])

    if (isLoading) {
        return <Loading/>
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Тайлан</h2>
            </div>
            <div className="border rounded-2xl shadow overflow-hidden">
                <Table>
                    <TableCaption>Сургалтын тайлан</TableCaption>
                    <TableHeader className="bg-gray-200">
                        <TableRow>
                            <TableHead>№</TableHead>
                            <TableHead>Сургалтын нэр</TableHead>
                            <TableHead>Төлбөр</TableHead>
                            <TableHead>Суралцагчдын тоо</TableHead>
                            <TableHead>Нийт орлого</TableHead>
                            <TableHead>Нийтэлсэн огноо</TableHead>
                            <TableHead>Төлөв</TableHead>
                            <TableHead>Зөвшөөрөл</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                        {reportData?.map((course, index) => (
                            <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell className="font-medium">{course.course_title}</TableCell>
                                {course.price_type === "Free" ? 
                                    <TableCell className="">Үнэгүй</TableCell> :
                                    <TableCell className="font-semibold">{formatMoney(course.price)}₮</TableCell>
                                }
                                <TableCell>{course.enrollments}</TableCell>
                                <TableCell>{formatMoney(course.total_revenue)}₮</TableCell>
                                <TableCell>{formatDateTime(course.published_on)}</TableCell>
                                <TableCell
                                    className={course.status === "Published" ? "text-green-500" : "text-gray-500"}>
                                    {course.status}
                                </TableCell>
                                <TableCell
                                    className={course.workflow_state === "Approved" ? "text-green-500" : course.workflow_state === "Pending" ? "text-gray-500" : "text-red-500"}>
                                    {course.workflow_state}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}