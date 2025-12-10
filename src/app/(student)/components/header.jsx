"use client";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
    const { data: session } = useSession();

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
                        <li><a href="/courses" className="hover:opacity-80 transition-opacity">Хичээлүүд</a></li>
                        {session && session.user ? (
                            <>
                                {
                                    session.user.roles.includes("Instructor") ?
                                        <li><a href="/instructor/dashboard" className="hover:opacity-80 transition-opacity">Хянах самбар</a></li> :
                                        <>
                                            <li><a href="/profile" className="hover:opacity-80 transition-opacity">Профайл</a></li>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="flex items-center gap-2">
                                                    {session.user.image ?
                                                        <Avatar>
                                                            <AvatarImage src={session.user.image} alt="profile" />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        :
                                                        <Avatar>
                                                            <AvatarImage className="bg-white"/>
                                                                <AvatarFallback className="text-black">{session.user.user.first_name?.[0]}
                                                                    {session.user.user.last_name?.[0]}
                                                                </AvatarFallback>
                                                        </Avatar>
                                                    }
                                                    {session.user ? <div>{session?.user?.user.first_name}</div> : null}
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        <Link href="/profile/enrollments">Миний хичээлүүд</Link>
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