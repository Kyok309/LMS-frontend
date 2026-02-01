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

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`${BACKEND}.payment.get_payments_student`, {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Миний төлбөр</h1>
            </div>
            <div>
                <Table>
                    <TableCaption>Төлбөрийн жагсаалт</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>№</TableHead>
                            <TableHead>Сургалтын нэр</TableHead>
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
                            <TableCell colSpan={5}>Нийт</TableCell>
                            <TableCell className="">{formatMoney(totalAmount)}₮</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
}