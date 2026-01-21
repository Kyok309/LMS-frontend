"use client";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import NotificationBell from './notificationBell';

const Header = () => {
    const { data: session } = useSession();
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    async function logout() {
        await fetch("/api/logout", { method: "POST" });
        await signOut({ redirect: true, callbackUrl: "/" });
    }
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
                        <NotificationBell/>
                        {session && session.user ? (
                            <>
                                {
                                    session.user.roles.includes("Instructor") ?
                                        <>
                                            <li><a href="/instructor/dashboard" className="hover:opacity-80 transition-opacity">Хянах самбар</a></li>
                                            <li><button onClick={logout} className="cursor-pointer">Гарах</button></li>
                                        </> :
                                        <>
                                            <li><a href="/profile/enrollments" className="hover:opacity-80 transition-opacity">Миний сургалтууд</a></li>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="flex items-center gap-2">
                                                    {session.user.user.user_image ?
                                                        <Avatar>
                                                            <AvatarImage src={BASE_URL + session.user.user.user_image} alt="profile" />
                                                            <AvatarFallback>{session.user.user.first_name?.[0]}
                                                                {session.user.user.last_name?.[0]}</AvatarFallback>
                                                        </Avatar>
                                                        :
                                                        <Avatar>
                                                            <AvatarImage className="bg-white" />
                                                            <AvatarFallback className="text-black">{session.user.user.first_name?.[0]}
                                                                {session.user.user.last_name?.[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    }
                                                    {session.user ? <div>{session?.user?.user.first_name}</div> : null}
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        <Link href="/profile">Профайл</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link href="/dashboard">Хяналтын самбар</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link href="/payments">Төлбөр</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={logout}>
                                                        Гарах
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