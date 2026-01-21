"use client";
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, CheckCircle2, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function InstructorDashboard() {
  // Mock data
  const [courses] = useState([
    {
      id: 1,
      title: 'React Fundamentals',
      enrollments: 45,
      revenue: 4500,
      avgQuizScore: 82,
      lessons: 12,
      isPaid: true,
    },
    {
      id: 2,
      title: 'JavaScript Basics',
      enrollments: 78,
      revenue: 0,
      avgQuizScore: 76,
      lessons: 20,
      isPaid: false,
    },
    {
      id: 3,
      title: 'Advanced Node.js',
      enrollments: 32,
      revenue: 3200,
      avgQuizScore: 88,
      lessons: 15,
      isPaid: true,
    },
  ]);

  const [enrollmentTrend] = useState([
    { month: 'Jan', enrollments: 25 },
    { month: 'Feb', enrollments: 38 },
    { month: 'Mar', enrollments: 52 },
    { month: 'Apr', enrollments: 48 },
    { month: 'May', enrollments: 65 },
    { month: 'Jun', enrollments: 78 },
  ]);

  const [quizPerformance] = useState([
    { lesson: 'Lesson 1', avgScore: 78 },
    { lesson: 'Lesson 2', avgScore: 82 },
    { lesson: 'Lesson 3', avgScore: 85 },
    { lesson: 'Lesson 4', avgScore: 80 },
    { lesson: 'Lesson 5', avgScore: 88 },
  ]);

  const [courseDistribution] = useState([
    { name: 'React', value: 45, color: '#3b82f6' },
    { name: 'JavaScript', value: 78, color: '#8b5cf6' },
    { name: 'Node.js', value: 32, color: '#ec4899' },
  ]);

  const [revenueData] = useState([
    { course: 'React', revenue: 4500 },
    { course: 'Node.js', revenue: 3200 },
  ]);

  const totalEnrollments = courses.reduce((sum, c) => sum + c.enrollments, 0);
  const totalRevenue = courses.reduce((sum, c) => sum + c.revenue, 0);
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons, 0);
  const avgScore = (courses.reduce((sum, c) => sum + c.avgQuizScore, 0) / courses.length).toFixed(1);

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
              <CardTitle className="font-medium">Total Enrollments</CardTitle>
              <Users className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrollments}</div>
              <p className="text-xs text-slate-800 mt-1">Across all courses</p>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-slate-800 mt-1">From paid courses</p>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium">Total Lessons</CardTitle>
              <BookOpen className="h-6 w-6 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLessons}</div>
              <p className="text-xs text-slate-800 mt-1">Published lessons</p>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium">Avg Quiz Score</CardTitle>
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgScore}%</div>
              <p className="text-xs text-slate-800 mt-1">Student performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enrollment Trend */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="">Enrollment Trend</CardTitle>
                  <CardDescription className="text-slate-800">Last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={enrollmentTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ border: '1px solid #cad5e2', borderRadius: '8px' }}
                      />
                      <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Course Distribution */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="">Students per Course</CardTitle>
                  <CardDescription className="text-slate-800">Distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={courseDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {courseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
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
                <CardTitle className="">Course Analytics</CardTitle>
                <CardDescription className="text-slate-800">Revenue and enrollment details</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={courses}>
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
                <CardTitle className="">Revenue by Course</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="course" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ border: '1px solid #cad5e2', borderRadius: '8px' }}
                      formatter={(value) => `$${value}`}
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
                <CardTitle className="">Quiz Performance by Lesson</CardTitle>
                <CardDescription className="text-slate-800">Average student scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quizPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="lesson" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ border: '1px solid #cad5e2', borderRadius: '8px' }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="avgScore" fill="#f59e0b" name="Score %" />
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