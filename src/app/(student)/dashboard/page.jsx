"use client";
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { BookOpen, CheckCircle2, Clock, Target, TrendingUp, Play, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function StudentDashboard() {
  // Mock data
  const [enrolledCourses] = useState([
    {
      id: 1,
      title: 'React Fundamentals',
      instructor: 'John Doe',
      progress: 75,
      lessons: { completed: 9, total: 12 },
      avgScore: 85,
      isPaid: true,
      dueDate: '2026-03-15',
    },
    {
      id: 2,
      title: 'JavaScript Basics',
      instructor: 'Jane Smith',
      progress: 100,
      lessons: { completed: 20, total: 20 },
      avgScore: 92,
      isPaid: false,
      dueDate: null,
    },
    {
      id: 3,
      title: 'Advanced Node.js',
      instructor: 'Mike Johnson',
      progress: 45,
      lessons: { completed: 7, total: 15 },
      avgScore: 78,
      isPaid: true,
      dueDate: '2026-04-30',
    },
  ]);

  const [learningProgress] = useState([
    { month: 'Week 1', hoursLearned: 4 },
    { month: 'Week 2', hoursLearned: 6 },
    { month: 'Week 3', hoursLearned: 5 },
    { month: 'Week 4', hoursLearned: 8 },
    { month: 'Week 5', hoursLearned: 7 },
    { month: 'Week 6', hoursLearned: 9 },
  ]);

  const [skillAssessment] = useState([
    { skill: 'React', level: 75 },
    { skill: 'JavaScript', level: 92 },
    { skill: 'CSS', level: 68 },
    { skill: 'HTML', level: 88 },
    { skill: 'Node.js', level: 60 },
  ]);

  const [quizScores] = useState([
    { quiz: 'React Quiz 1', score: 82 },
    { quiz: 'React Quiz 2', score: 88 },
    { quiz: 'React Quiz 3', score: 85 },
    { quiz: 'JS Quiz 1', score: 90 },
    { quiz: 'JS Quiz 2', score: 94 },
  ]);

  const [courseDistribution] = useState([
    { name: 'React', value: 75, color: '#3b82f6' },
    { name: 'JavaScript', value: 100, color: '#8b5cf6' },
    { name: 'Node.js', value: 45, color: '#ec4899' },
  ]);

  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(c => c.progress === 100).length;
  const avgScore = (enrolledCourses.reduce((sum, c) => sum + c.avgScore, 0) / enrolledCourses.length).toFixed(1);
  const totalHoursLearned = learningProgress.reduce((sum, w) => sum + w.hoursLearned, 0);

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
              <CardTitle className="font-medium text-slate-600">Enrolled Courses</CardTitle>
              <BookOpen className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalCourses}</div>
              <p className="text-xs text-slate-500 mt-1">{completedCourses} completed</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium text-slate-600">Hours Learned</CardTitle>
              <Clock className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalHoursLearned}h</div>
              <p className="text-xs text-slate-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium text-slate-600">Average Score</CardTitle>
              <Target className="h-6 w-6 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{avgScore}%</div>
              <p className="text-xs text-slate-500 mt-1">Across quizzes</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-medium text-slate-600">Completion Rate</CardTitle>
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {Math.round((enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length))}%
              </div>
              <p className="text-xs text-slate-500 mt-1">Overall progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white border-slate-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Progress */}
              <Card className="bg-white border-slate-200 shadow-sm lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-slate-900">Learning Hours</CardTitle>
                  <CardDescription className="text-slate-600">Last 6 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={learningProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                        labelStyle={{ color: '#1e293b' }}
                      />
                      <Line type="monotone" dataKey="hoursLearned" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Course Progress Distribution */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Progress Distribution</CardTitle>
                  <CardDescription className="text-slate-600">By course</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={courseDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {courseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                        labelStyle={{ color: '#1e293b' }}
                        formatter={(value) => `${value}%`}
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
                <CardTitle className="text-slate-900">Your Skills Assessment</CardTitle>
                <CardDescription className="text-slate-600">Based on your quiz performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={skillAssessment}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="skill" stroke="#64748b" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#cbd5e1" />
                    <Radar name="Skill Level" dataKey="level" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
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
                <CardTitle className="text-slate-900">Recent Quiz Scores</CardTitle>
                <CardDescription className="text-slate-600">Your latest quiz results</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quizScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="quiz" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                      labelStyle={{ color: '#1e293b' }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="score" fill="#8b5cf6" name="Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enrolled Courses */}
        <Card className="bg-white border-slate-200 shadow-sm mt-8">
          <CardHeader>
            <CardTitle className="text-slate-900">My Courses</CardTitle>
            <CardDescription className="text-slate-600">Continue learning or start a new course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                      <p className="text-sm text-slate-600">by {course.instructor}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={course.progress === 100 ? 'default' : 'secondary'}>
                        {course.progress === 100 ? 'Completed' : 'In Progress'}
                      </Badge>
                      <Badge variant="outline">
                        {course.isPaid ? 'Paid' : 'Free'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700 font-medium">Progress</span>
                        <span className="text-slate-600">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Lessons</p>
                        <p className="text-slate-900 font-semibold">{course.lessons.completed}/{course.lessons.total}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Average Score</p>
                        <p className="text-slate-900 font-semibold">{course.avgScore}%</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Due Date</p>
                        <p className="text-slate-900 font-semibold">{course.dueDate || 'No deadline'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Play className="h-4 w-4 mr-1" />
                      Continue Learning
                    </Button>
                    {course.progress === 100 && (
                      <Button size="sm" variant="outline" className="text-slate-700">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        View Certificate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}