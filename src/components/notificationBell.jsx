// app/components/NotificationBellSocket.jsx
'use client'
import { getSession, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover"
import { Bell } from 'lucide-react'
import { Separator } from "./ui/separator"
import { formatDateTime } from "@/lib/utils"

export default function NotificationBell() {
   const [notifications, setNotifications] = useState([]);
   const { data: session } = useSession();
   const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
   const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
   const unreadNotifs = notifications.filter(notif => notif.read === 0).length

   const fetchNotifications = async () => {
      try {
         const session = await getSession();
         if (!session?.user?.accessToken) return;

         const res = await fetch(`${BACKEND}.notification.get_notifications`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Accept": "application/json",
               "Authorization": `Bearer ${session?.user?.accessToken}`
            }
         })
         const response = await res.json();
         console.log(response)

         if (response.responseType === "ok") {
            setNotifications(response.data)
         } else {
            console.log(response.desc)
         }
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      fetchNotifications();
   }, [BACKEND])

   useEffect(() => {
      if (!session?.user?.accessToken) {
         console.log('No access token available');
         return;
      }

      const accessToken = session?.user?.accessToken
      console.log('Attempting to connect to Socket.IO at:', SOCKET_URL);
      console.log(accessToken)

      const socket = io(SOCKET_URL, {
         path: "/socket.io",
         auth: (cb) => {
            cb({ token: `Bearer ${accessToken}` });
         },
         reconnection: true,
         reconnectionDelay: 1000,
         reconnectionDelayMax: 5000,
         reconnectionAttempts: 5,
         transports: ['websocket', 'polling'],
         secure:false,
         rejectUnauthorized: false,
         extraHeaders: {
            'Authorization': `Bearer ${accessToken}`
         }
      })

      socket.on('connect', () => {
         console.log('✅ socket connected successfully')
      })

      socket.on('connect_error', (error) => {
         console.error('❌ Connect error:', error);
         
      })
      socket.io.engine.on('error', (error) => {
         console.error('❌ Engine error:', error);
      })

      socket.on('disconnect', () => {
         console.log('Socket disconnected')
      })

      socket.on(`notification_${session?.user?.user?.email}`, (message) => {
         console.log('notification received:', message);
         fetchNotifications();
      })

      return () => {
         socket.disconnect()
      }
   }, [session?.user?.accessToken, SOCKET_URL])

   const readNotification = async (notifId, notifRead) => {
      try {
         if (notifRead === 0) {
            const session = await getSession();
            const res = await fetch(`${BACKEND}.notification.read_notification?notifId=${notifId}`, {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  "Authorization": `Bearer ${session?.user?.accessToken}`
               }
            })
            const response = await res.json()
            console.log(response)
            if (response.responseType === "ok") {
               fetchNotifications();
            } else {
               console.log(response.desc)
            }
         }
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <Popover className="overflow-hidden">
         <PopoverTrigger className="relative w-7 h-8 cursor-pointer">
            <Bell fill="#FFFFFF" size={18} />
            <div className="absolute top-0 right-0 text-sm font-semibold">
               {unreadNotifs > 0 && unreadNotifs}
            </div>
         </PopoverTrigger>
         <PopoverContent className="w-80 max-h-96 overflow-y-auto flex flex-col items-center gap-2">
            <div className="w-full">
               <div className="font-semibold">Мэдэгдлүүд</div>
            </div>
            {notifications.length > 0 ?
               notifications.map((notif, index) => (
                  <div onClick={() => { readNotification(notif.name, notif.read) }}
                     key={index}
                     className={notif.read === 0 ? "w-full bg-gray-50 border-l-4 border-blue-500" : "w-full"}>
                     <div className="py-2 px-4">
                        <div className="text-[14px] text-blue-800 font-semibold">{notif.subject}</div>
                        <div className="text-[13px]">{notif.email_content}</div>
                        <div className="text-[13px]">{formatDateTime(notif.creation)}</div>
                     </div>
                     <Separator />
                  </div>))
               :
               <div className="">Хоосон байна.</div>
            }
         </PopoverContent>
      </Popover>
   )
}