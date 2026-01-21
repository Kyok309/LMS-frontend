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
import { formatDate, formatDateTime, formatMoney } from "@/lib/utils";

export default function InstructorPayments() {
    const [payments, setPayments] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const session = await getSession();
                const res = await fetch("http://localhost:8000/api/method/lms_app.api.payment.get_payments_instructor", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`
                    }
                })
                const response = await res.json();
                setPayments(response.data.payments || []);
                setTotalAmount(response.data.total_paid_amount || 0);
            } catch (error) {
                console.log(error)
                toast.error("Төлбөрийн мэдээлэл авахад алдаа гарлаа.");
            }
        }
        fetchPayments();
    }, [])

    return (
        <div className="w-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Миний төлбөр</h2>
            </div>
            <div>
                <Table>
                    <TableCaption>Төлбөрийн жагсаалт</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>№</TableHead>
                            <TableHead>Сургалтын нэр</TableHead>
                            <TableHead>Суралцагч</TableHead>
                            <TableHead>Суралцагчийн и-мейл</TableHead>
                            <TableHead>Төлбөрийн хэлбэр</TableHead>
                            <TableHead>Төлөв</TableHead>
                            <TableHead>Огноо</TableHead>
                            <TableHead>Нийт үнийн дүн</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((payment, index) => (
                            <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell className="font-medium">{payment.course_title}</TableCell>
                                <TableCell>{payment.full_name}</TableCell>
                                <TableCell>{payment.email}</TableCell>
                                <TableCell>{payment.payment_method}</TableCell>
                                <TableCell>
                                    {payment.payment_status === "Paid" && "Төлсөн"}
                                    {payment.payment_status === "Pending" && "Хүлээгдэж буй"}
                                    {payment.payment_status === "Failed" && "Төлөгдөөгүй"}
                                </TableCell>
                                <TableCell>{formatDateTime(payment.paid_on)}</TableCell>
                                <TableCell>{formatMoney(payment.amount)}₮</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={7}>Нийт</TableCell>
                            <TableCell className="">{formatMoney(totalAmount)}₮</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
}