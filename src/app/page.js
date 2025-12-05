"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from "@/components/ui/separator"
import Header from '@/app/(student)/components/header';
import { useSession } from 'next-auth/react';

export default function Home() {
  const features = [
    {
      icon: '🎓',
      title: 'Олон төрлийн хичээл',
      description: '100+ өөр салбарын мэргэжлийн хичээлүүд'
    },
    {
      icon: '👨‍🏫',
      title: 'Туршлагатай багш нар',
      description: 'Мэргэжлийн өндөр багш нартай хамтарсан'
    },
    {
      icon: '📱',
      title: 'Хаанаас ч суралцаарай',
      description: 'Утас, компьютер, таблет дээр ашиглах боломжтой'
    },
    {
      icon: '🏆',
      title: 'Сертификат',
      description: 'Төгссөн хичээл бүрт албан ёсны сертификат'
    }
  ];

  const courses = [
    {
      title: 'Вэб хөгжүүлэлт',
      description: 'HTML, CSS, JavaScript суралцаарай',
      students: '1,234 оюутан',
      rating: '4.8',
      url: '/webdevelopment.jpg'
    },
    {
      title: 'Дата шинжилгээ',
      description: 'Python ашиглан дата боловсруулах',
      students: '856 оюутан',
      rating: '4.9',
      url: '/datascience.png'
    },
    {
      title: 'График дизайн',
      description: 'Photoshop болон Illustrator',
      students: '2,103 оюутан',
      rating: '4.7',
      url: '/graphicdesign.jpeg'
    }
  ];

  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header/>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-sky-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Сургалтын Удирдлагын Систем
          </h1>
          <p className="text-xl mb-8">
            Хаанаас ч, хэзээ ч суралцаарай. Таны амжилтын түлхүүр
          </p>
          <Button size="lg" className="bg-white text-indigo-800 hover:bg-gray-100 font-bold" asChild>
            {
              session?.user ?  <Link href="/courses">Эхлэх</Link> : <Link href="/auth?signup">Эхлэх</Link>
            }
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-indigo-800">
            Яагаад биднийг сонгох вэ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-indigo-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Separator/>
      {/* Courses Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-indigo-800">
            Алдартай хичээлүүд
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Card key={index} className="pt-0 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-cover h-48 flex items-center justify-center text-white text-6xl" style={{ backgroundImage: `url(${course.url})` }}>
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>👥 {course.students}</span>
                    <span>⭐ {course.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-8 mt-16">
        <p>&copy; 2025 Сургалтын Удирдлагын Систем. Бүх эрх хуулиар хамгаалагдсан.</p>
      </footer>
    </div>
  );
}