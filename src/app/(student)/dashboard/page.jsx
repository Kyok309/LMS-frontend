"use client";
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { BookOpen, CheckCircle2, Clock, Target, TrendingUp, Play, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSession } from "next-auth/react";
import Loading from "@/components/loading";

export default function StudentDashboard() {
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
  const [dashboardData, setDashboardData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  

  const [quizScores] = useState([
    { quiz: 'React Quiz 1', score: 82 },
    { quiz: 'React Quiz 2', score: 88 },
    { quiz: 'React Quiz 3', score: 85 },
    { quiz: 'JS Quiz 1', score: 90 },
    { quiz: 'JS Quiz 2', score: 94 },
  ]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true)
        const session = await getSession();
        const res = await fetch(`${BACKEND}.dashboard.get_dashboard`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${session?.user?.accessToken}`
          }
        })
        const response = await res.json();
        console.log(response)

        if (response.responseType === "ok") {
          setDashboardData(response.data)
        } else {
          console.log(response.desc)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Хяналтын самбар</h1>
          <p className="text-slate-600">Сургалтын прогресс, шалгалтын оноо</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium text-slate-600">Нийт элссэн сургалт</CardTitle>
              <BookOpen className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{dashboardData?.enrolled_courses}</div>
              <p className="text-xs text-slate-500 mt-1">{dashboardData?.finished_courses} дуусгасан</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium text-slate-600">Дуусгасан хичээлүүд</CardTitle>
              <Clock className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{dashboardData?.finished_lessons}</div>
              <p className="text-xs text-slate-500 mt-1">Бүх сургалтын хувьд</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium text-slate-600">Дундаж оноо</CardTitle>
              <Target className="h-6 w-6 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{dashboardData?.average_score.toFixed(2)}%</div>
              <p className="text-xs text-slate-500 mt-1">Бүх шалгалтын хувьд</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium text-slate-600">Сургалтын гүйцэтгэл</CardTitle>
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {dashboardData?.completion_rate.toFixed(2)}%
              </div>
              <p className="text-xs text-slate-500 mt-1">Ерөнхий явц</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white border-slate-200">
            <TabsTrigger value="overview">Ерөнхий</TabsTrigger>
            <TabsTrigger value="skills">Чадвар</TabsTrigger>
            <TabsTrigger value="quizzes">Шалгалт</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Progress */}
              <Card className="bg-white border-slate-200 shadow-sm lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-slate-900">Дуусгасан хичээлүүд</CardTitle>
                  <CardDescription className="text-slate-600">Сүүлийн 6 долоо хоногт</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData?.completed_lesson_week}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" stroke="#64748b" tick={{ "fontSize": 12 }} angle={-35} textAnchor="end" height={100} />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                        labelStyle={{ color: '#1e293b' }}
                      />
                      <Line type="monotone" dataKey="done_count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Course Progress Distribution */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Сургалтууд</CardTitle>
                  <CardDescription className="text-slate-600">Ангилалаар</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData?.course_category}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name }) => `${name}`}
                        nameKey="category_name"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="courses"
                      >
                        {dashboardData?.course_category.map((entry, index) => {
                          const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                          return <Cell key={`cell-${index}`} fill={randomColor} />;
                        })}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                        labelStyle={{ color: '#1e293b' }}
                        formatter={(value) => `${value}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Явц</CardTitle>
                <CardDescription className="text-slate-600">Ангилалаар</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={dashboardData?.progress_category}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="category_name" stroke="#64748b" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#cbd5e1" />
                    <Radar name="Явц" dataKey="progress" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                      labelStyle={{ color: '#1e293b' }}
                      formatter={(value) => `${value}%`}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Дундаж шалгалтын оноо</CardTitle>
                <CardDescription className="text-slate-600">Сургалтаар</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData?.avg_course}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="course_title" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                      labelStyle={{ color: '#1e293b' }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="average_score" fill="#8b5cf6" name="Score %" />
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