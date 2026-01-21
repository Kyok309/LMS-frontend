// app/components/NotificationBellSocket.jsx
'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import {
   Popover,
   PopoverContent,
   PopoverDescription,
   PopoverHeader,
   PopoverTitle,
   PopoverTrigger,
} from "@/components/ui/popover"
import { Bell } from 'lucide-react'
import { Button } from './ui/button'
import { Label } from './ui/label'

export default function NotificationBell() {
   const [notifications, setNotifications] = useState([])
   const { data: session } = useSession()
   useEffect(() => {
      const accessToken = session?.user?.accessToken

      const socket = io("localhost:9003/lms", {
         auth: {
            token: `Bearer ${accessToken}`
         },   // send cookies for session auth
         transports: ['websocket', 'polling']
      })

      socket.on('connect', () => console.log('socket connected', socket.id))
      socket.on('connect_error', (err) => console.error('socket connect_error', err))

      // listen for the event your server publishes
      socket.on('notification', (message) => {
         console.log(message)
         console.log("dfsdfdsfd")
         setNotifications(prev => [message, ...prev])
      })

      return () => {
         socket.disconnect()
      }
   }, [])

   return (
      <Popover>
         <PopoverTrigger>
            <Bell fill="#FFFFFF" size={18} />
         </PopoverTrigger>
         <PopoverContent className="w-80 flex flex-col items-center">
            <div className="w-full">
               <div className="font-semibold">Мэдэгдлүүд</div>
               <div className="text-gray-500">Мэдэгдлүүд энд харагдана.</div>
            </div>
            <div className="w-full">
               {notifications.length > 0 ?
                  notifications.map((notif, index) => (
                     <div key={index} className="w-full p-4">
                        {notif.text}
                     </div>))
                  :
                  <div className="">Хоосон байна.</div>
               }
            </div>
         </PopoverContent>
      </Popover>
   )
}
