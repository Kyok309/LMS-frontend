"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, BookOpen, Calendar, CheckCircle2, Clock, CircleCheck, Play } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Loading from '@/components/loading';
import { Button } from "@/components/ui/button";

export default function EnrollmentsPage() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                setLoading(true);
                const session = await getSession();
                const res = await fetch(
                    `${BACKEND}.enrollment.get_enrollments_student`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${session?.user?.accessToken}`
                        }
                    }
                );
                const response = await res.json();
                console.log(response)
                setEnrollments(response.data || []);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to load enrollments');
                setEnrollments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Finished':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Not started':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Finished':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'In Progress':
                return <Clock className="w-4 h-4" />;
            case 'Not started':
                return <BookOpen className="w-4 h-4" />;
            default:
                return <BookOpen className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Миний сургалтууд</h1>
                <p className="text-gray-600">
                    {enrollments.length} {enrollments.length === 1 ? 'сургалт' : 'сургалтууд'}
                </p>
            </div>

            {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {enrollments.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg">Сургалт байхгүй байна.</p>
                        <p className="text-gray-500">Сургалтанд элсэнэ үү!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment, index) => (

                        <Card key={index}
                            className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg line-clamp-2">
                                            {enrollment.course_title}
                                        </CardTitle>
                                    </div>
                                    <Badge className={`flex items-center gap-1 ${getStatusColor(enrollment.completion_status)}`}>
                                        {getStatusIcon(enrollment.completion_status)}
                                        {enrollment.completion_status}
                                    </Badge>
                                </div>
                                <CardDescription className="text-sm text-gray-500 truncate">
                                    {enrollment.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Дундаж оноо: {enrollment.average_score.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(enrollment.creation)}-д элссэн</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Явц</span>
                                        <span className="font-semibold text-gray-900">
                                            {enrollment.progress_percentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${enrollment.progress_percentage}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex gap-4 flex-wrap justify-between">
                                    <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                                        <Link href={`/courses/${enrollment.course}`}><Play />Үзэх</Link>
                                    </Button>
                                    {
                                        enrollment.certificate_issued == 1 &&
                                        <Button variant="outline" asChild>
                                            <Link href={`/courses/${enrollment.course}/certificate`}>
                                            <CircleCheck /> Сертификат харах</Link>
                                        </Button>
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}