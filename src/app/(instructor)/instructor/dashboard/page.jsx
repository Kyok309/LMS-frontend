"use client";
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, CheckCircle2, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getSession } from "next-auth/react";
import Loading from "@/components/loading";
import { formatMoney } from "@/lib/utils";

export default function InstructorDashboard() {
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
  const [dashboardData, setDashboardData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const session = await getSession()
        const res = await fetch(`${BACKEND}.dashboard.get_dashboard_instructor`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${session?.user?.accessToken}`
          }
        })
        const response = await res.json()
        console.log(response)
        if (response.responseType === "ok") {
          setDashboardData(response.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard()
  }, [])

  const combinedData = dashboardData?.total_enrollments.map(enrollment => {
    const scoreData = dashboardData?.average_score_course.find(
      score => score.course_title === enrollment.course_title
    );

    return {
      title: enrollment.course_title,
      enrollments: enrollment.enrollment,
      avgQuizScore: scoreData?.avg.toFixed(2) || 0
    };
  });


  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Хяналтын самбар</h2>
          <p className="text-slate-800"></p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium">Нийт суралцагчид</CardTitle>
              <Users className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.total_enrollments?.reduce((sum, item) => sum + item.enrollment, 0)}
              </div>
              <p className="text-xs text-slate-800 mt-1">Бүх сургалтаас</p>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium">Нийт орлого</CardTitle>
              <DollarSign className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₮{formatMoney(dashboardData?.total_revenue?.reduce((sum, item) => sum + item.revenue, 0))}
              </div>
              <p className="text-xs text-slate-800 mt-1">Төлбөртэй сургалтуудаас</p>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium">Нийт хичээлүүд</CardTitle>
              <BookOpen className="h-6 w-6 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.total_lessons?.reduce((sum, item) => sum + item.lessons, 0)}
              </div>
              <p className="text-xs text-slate-800 mt-1">Бүх сургалтуудаас</p>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium">Дундаж шалгалтын оноо</CardTitle>
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(dashboardData?.average_score_course?.reduce((sum, item) => sum + item.avg, 0) / dashboardData?.average_score_course?.length).toFixed(2)}%
              </div>
              <p className="text-xs text-slate-800 mt-1">Суралцагчийн гүйцэтгэл</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-gray-200">
            <TabsTrigger value="overview">Ерөнхий</TabsTrigger>
            <TabsTrigger value="courses">Сургалтууд</TabsTrigger>
            <TabsTrigger value="performance">Гүйцэтгэл</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enrollment Trend */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="">Элсэлтийн тоо</CardTitle>
                  <CardDescription className="text-slate-800">Сүүлийн 6 сард</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData?.enrollment_month}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="month" stroke="#94a3b8"/>
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ border: '1px solid #cad5e2', borderRadius: '8px' }}
                      />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Course Distribution */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="">Сургалт дах суралцагчид</CardTitle>
                  <CardDescription className="text-slate-800">Тархалт</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData?.total_enrollments}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ course_title }) => `${course_title}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="enrollment"
                        nameKey="course_title"
                      >
                        {dashboardData?.total_enrollments.map((entry, index) => {
                          const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                          return <Cell key={`cell-${index}`} fill={randomColor} />;
                        })}
                      </Pie>
                      <Tooltip
                        contentStyle={{ border: '1px solid #cad5e2', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card className="">
              <CardHeader>
                <CardTitle className="">Сургалтын аналитик</CardTitle>
                <CardDescription className="text-slate-800">Орлого ба элсэлтийн дэлгэрэнгүй</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="title" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ border: '1px solid #cad5e2', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="enrollments" fill="#3b82f6" name="Enrollments" />
                    <Bar dataKey="avgQuizScore" fill="#8b5cf6" name="Avg Quiz Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="">
              <CardHeader>
                <CardTitle className="">Сургалт дах орлого</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData?.total_revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="course_title" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ border: '1px solid #cad5e2', borderRadius: '8px' }}
                      formatter={(value) => `₮${value}`}
                    />
                    <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="">
              <CardHeader>
                <CardTitle className="">Сургалтын явц</CardTitle>
                <CardDescription className="text-slate-800">Суралцагчдын гүйцэтгэл сургалтаар</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart data={dashboardData?.completion_rate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="course_title" stroke="#94a3b8" angle={-45} textAnchor="end" height={200} interval={0} tick={{ fontSize: 12 }}/>
                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ border: '1px solid #cad5e2', borderRadius: '8px' }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="completion_rate" fill="#f59e0b" name="Дуусгасан" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}