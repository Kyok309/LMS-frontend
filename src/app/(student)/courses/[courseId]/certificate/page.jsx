"use client";
import React from "react";
import Loading from "@/components/loading";
import { getSession, useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";


export default function Certificate() {
   const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
   const { courseId } = useParams()
   const { data: session } = useSession();
   const [certificate, setCertificate] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
   let certificateId;
   const [ pdfUrl, setPdfUrl ] = useState();

   const fetchCertificate = async () => {
      try {
         setIsLoading(true)
         const session = await getSession();
         const res = await fetch(`${BACKEND}.certificate.get_certificate?courseId=${courseId}`, {
            method: "GET",
            headers: {
               "Accept": "application/json",
               "Authorization": `Bearer ${session?.user?.accessToken}`
            }
         })

         const response = await res.json();
         console.log(response)

         if (response.responseType === "ok" && response.data) {
            setCertificate(response.data)
            certificateId = response.data.name
         } else {
            console.log(response.desc)
         }
      } catch (error) {
         console.log(error)
      } finally {
         setIsLoading(false)
         fetchCertificateFile()
      }
   }
   const fetchCertificateFile = async () => {
      try {
         setIsLoading(true);
         const session = await getSession();
         const res = await fetch(`${BACKEND}.certificate.get_certificate_file?certificateId=${certificateId}`, {
            method: "GET",
            headers: {
               "Authorization": `Bearer ${session?.user?.accessToken}`
            }
         })

         const blob = await res.blob();
         const pdfUrl = URL.createObjectURL(blob);
         setPdfUrl(pdfUrl);
      } catch (error) {
         console.log(error)
      } finally {
         setIsLoading(false)
      }
   }
   useEffect(() => {
      fetchCertificate()
   }, [])

   if (isLoading) {
      return <Loading />
   }

   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
         {certificate ?
            <>
               {/* Header */}
               <div className="w-full flex flex-col gap-2 items-center">
                  <div className="w-14 h-14 bg-blue-100 text-blue-500 rounded-full flex justify-center items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#2b7fff"><path d="m387-412 35-114-92-74h114l36-112 36 112h114l-93 74 35 114-92-71-93 71ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm240-280q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold">
                     Баяр хүргэе, {session?.user?.user.first_name + " " + session?.user?.user.last_name}!
                  </h2>
                  <p className="text-gray-500">{certificate?.name} сургалтыг амжилттай суралцаж дуусгасан байна.</p>
                  <p className="text-gray-500">хичээл</p>
               </div>
               {/* Main */}
               <main className="flex flex-col gap-4 px-4 sm:px-6 lg:px-8">
                  <div className="rounded-2xl shadow overflow-hidden">
                     <iframe
                        src={`${pdfUrl}#navpanes=0&scrollbar=0`}
                        width="100%"
                        height="860px"
                     />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                     <button
                        onClick={() => {
                           // LinkedIn share functionality
                           const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`;
                           window.open(shareUrl, '_blank');
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                     >
                        <span>🔗</span>
                        LinkedIn-д хуваалцах
                     </button>

                     <button
                        onClick={() => {
                           navigator.clipboard.writeText(window.location.href);
                           alert('Link copied to clipboard!');
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                     >
                        <span>🔗</span>
                        Холбоос хуулах
                     </button>
                  </div>

                  {/* Recommended Courses Section */}
                  <div className="mb-12">
                     <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Санал болгож буй сургалтууд</h2>
                        <Link href="/courses" className="text-blue-500 font-semibold hover:text-blue-700">
                           Илүү үзэх →
                        </Link>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Course Card 1 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                           <div className="h-40 bg-gradient-to-br from-teal-500 to-teal-700 relative">
                              <div className="absolute top-4 left-4 bg-teal-900 text-white px-3 py-1 rounded text-xs font-bold">
                                 ADVANCED
                              </div>
                           </div>
                           <div className="p-6">
                              <h3 className="font-bold text-gray-900 mb-2">Investment Banking...</h3>
                              <div className="flex items-center gap-1 mb-3">
                                 <span className="text-yellow-400">★</span>
                                 <span className="text-gray-700 font-semibold">4.9</span>
                                 <span className="text-gray-500 text-sm">(246 reviews)</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                                 <span>⏱️</span>
                                 <span>24 Hours</span>
                              </div>
                              <button className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition-colors">
                                 Enroll Now
                              </button>
                           </div>
                        </div>

                        {/* Course Card 2 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                           <div className="h-40 bg-gradient-to-br from-slate-600 to-slate-800 relative">
                              <div className="absolute top-4 left-4 bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold">
                                 EXPERT
                              </div>
                           </div>
                           <div className="p-6">
                              <h3 className="font-bold text-gray-900 mb-2">Mergers & Acquisitions...</h3>
                              <div className="flex items-center gap-1 mb-3">
                                 <span className="text-yellow-400">★</span>
                                 <span className="text-gray-700 font-semibold">4.8</span>
                                 <span className="text-gray-500 text-sm">(115 reviews)</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                                 <span>⏱️</span>
                                 <span>32 Hours</span>
                              </div>
                              <button className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition-colors">
                                 Enroll Now
                              </button>
                           </div>
                        </div>

                        {/* Course Card 3 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                           <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-900 relative">
                              <div className="absolute top-4 left-4 bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold">
                                 INTERMEDIATE
                              </div>
                           </div>
                           <div className="p-6">
                              <h3 className="font-bold text-gray-900 mb-2">Venture Capital & Private...</h3>
                              <div className="flex items-center gap-1 mb-3">
                                 <span className="text-yellow-400">★</span>
                                 <span className="text-gray-700 font-semibold">4.7</span>
                                 <span className="text-gray-500 text-sm">(950 reviews)</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                                 <span>⏱️</span>
                                 <span>18 Hours</span>
                              </div>
                              <button className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition-colors">
                                 Enroll Now
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Back to Dashboard */}
                  <div className="text-center">
                     <Link href="/profile/enrollments">
                        <button className="text-blue-500 font-semibold hover:text-blue-700">
                           ← Миний сургалт руу буцах
                        </button>
                     </Link>
                  </div>
               </main>
            </> :
            <>
               <div className="w-full flex flex-col gap-8 items-center">
                  <h2 className="text-2xl font-semibold">Сертификат олдсонгүй!</h2>
                  <Link href="/profile/enrollments">
                     <button className="text-blue-500 font-semibold hover:text-blue-700">
                        ← Миний сургалт руу буцах
                     </button>
                  </Link>
               </div>
            </>
         }
      </div>
   );
}