"use client";
import NotificationBell from "@/components/notificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings, SquareArrowOutUpLeft, UserPen } from "lucide-react";
import { getSession, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function InstructorHeader() {
   async function logout() {
      await fetch("/api/logout", { method: "POST" });
      await signOut({ redirect: true, callbackUrl: "/" });
   }
   const [ me, setMe ] = useState();
   const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
   const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
   useEffect(()=>{
      const fetchMe = async () => {
         try{
            const session = await getSession();
            const res = await fetch(`${BACKEND}.auth.get_me`, {
               method: "GET",
               headers: {
                  "Accept": "application/json",
                  "Authorization": `Bearer ${session?.user?.accessToken}`
               }
            })
            const response = await res.json();
            console.log(response)
            if (response.responseType === "ok") {
               setMe(response.data)
            } else {
               console.log(response.desc)
            }
         } catch (error) {
            console.log(error)
         }
      }
      fetchMe()
   }, [])
   return (
      <div className="w-full bg-white py-4 px-14 flex justify-end gap-4 shadow">
         <NotificationBell />
         <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
               {me?.user_image ?
                  <Avatar>
                     <AvatarImage src={BASE_URL + me.user_image} alt="profile"/>
                     <AvatarFallback>{me?.first_name?.[0]}
                        {me?.last_name?.[0]}</AvatarFallback>
                  </Avatar>
                  :
                  <Avatar>
                     <AvatarImage className="bg-white" />
                     <AvatarFallback className="text-black">{me?.first_name?.[0]}
                        {me?.last_name?.[0]}
                     </AvatarFallback>
                  </Avatar>
               }
               <div>{me?.first_name}</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuItem>
                  <Link href="/instructor/profile" className="flex gap-2 items-center"><UserPen /> Профайл</Link>
               </DropdownMenuItem>
               <DropdownMenuItem>
                  <Link href="/instructor/settings" className="flex gap-2 items-center"><Settings /> Тохиргоо</Link>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <SquareArrowOutUpLeft /> Гарах
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
}