"use client";
import Link from 'next/link';
import { useSession, signOut, getSession } from 'next-auth/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import NotificationBell from './notificationBell';
import { LayoutDashboard, SquareArrowOutUpLeft, User, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
    const { data: session } = useSession();
    async function logout() {
        await fetch("/api/logout", { method: "POST" });
        await signOut({ redirect: true, callbackUrl: "/" });
    }

    const [me, setMe] = useState();
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    useEffect(() => {
        const fetchMe = async () => {
            try {
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
        <header className="bg-blue-950 text-white shadow-md">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-2xl font-bold">
                        <div className="text-2xl font-bold">📚 LMS</div>
                    </Link>
                    <ul className="flex items-center space-x-8">
                        <li><a href="/" className="hover:opacity-80 transition-opacity">Нүүр</a></li>
                        <li><a href="/courses" className="hover:opacity-80 transition-opacity">Сургалтууд</a></li>

                        {session && session.user ? (
                            <>
                                {
                                    session.user.roles.includes("Instructor") ?
                                        <>
                                            <li><a href="/instructor/dashboard" className="hover:opacity-80 transition-opacity">Хянах самбар</a></li>
                                            <NotificationBell />
                                            <li><button onClick={logout} className="cursor-pointer">Гарах</button></li>
                                        </> :
                                        <>
                                            <li><a href="/profile/enrollments" className="hover:opacity-80 transition-opacity">Миний сургалтууд</a></li>
                                            <NotificationBell />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
                                                    {me?.user_image ?
                                                        <Avatar>
                                                            <AvatarImage src={BASE_URL + me.user_image} alt="profile" />
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
                                                    <div>{session?.user?.user.first_name}</div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        <Link href="/profile" className="flex gap-2 items-center"><User /> Профайл</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link href="/dashboard" className="flex gap-2 items-center"><LayoutDashboard /> Хяналтын самбар</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link href="/payments" className="flex gap-2 items-center"><Wallet /> Төлбөр</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                                                        <SquareArrowOutUpLeft /> Гарах
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </>
                                }
                            </>
                        ) : (
                            <>
                                <li><a href="/auth?login" className="hover:opacity-80 transition-opacity">Нэвтрэх</a></li>
                                <li><a href="/auth?signup" className="hover:opacity-80 transition-opacity">Бүртгүүлэх</a></li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Header;