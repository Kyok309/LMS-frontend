"use client";
import { cn } from "@/lib/utils";
import { BanknoteArrowUp, ChartColumnBigIcon, CornerUpLeft, GraduationCap, LayoutDashboardIcon, LogOutIcon, Settings, UserPen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut, getSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from "react";

const Sidebar = () => {
    const pathname = usePathname();
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
        <div className="bg-[#0e1b3d] lg:min-w-[350px] lg:w-[350px] lg:shrink-0 md:min-w-1/4 md:w-1/4 w-1/2 max-h-screen flex flex-col justify-between py-8  text-white">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-center gap-2 mb-4">
                    <div className="w-full flex px-4 gap-2 items-center mb-4">
                        <CornerUpLeft size={18} />
                        <Link href="/">Буцах</Link>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
                        {me?.user_image ?
                            <Avatar className="w-full h-full">
                                <AvatarImage src={BASE_URL + me.user_image} alt="profile" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            :
                            <Avatar className="w-full h-full">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        }
                    </div>
                    {
                        session?.user && session.user?.user && (
                            <>
                                <p className="text-white text-lg font-semibold">{me?.full_name}</p>
                                <p className="text-white">{me?.email}</p>
                            </>
                        )
                    }

                </div>
                <Link href="/instructor/dashboard">
                    <div className={cn(
                        "mx-2 py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                        pathname === "/instructor/dashboard" && "bg-[#093073]"
                    )}>
                        <LayoutDashboardIcon />
                        Хянах самбар
                    </div>
                </Link>
                <Link href="/instructor/courses">
                    <div className={cn(
                        "mx-2 py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                        pathname === "/instructor/courses" && "bg-[#093073]"
                    )}>
                        <GraduationCap />
                        Миний сургалтууд
                    </div>
                </Link>
                <Link href="/instructor/profile">
                    <div className={cn(
                        "mx-2 py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                        pathname === "/instructor/profile" && "bg-[#093073]"
                    )}>
                        <UserPen />
                        Профайл
                    </div>
                </Link>
                <Link href="/instructor/payments">
                    <div className={cn(
                        "mx-2 py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                        pathname === "/instructor/payments" && "bg-[#093073]"
                    )}>
                        <BanknoteArrowUp />
                        Төлбөр
                    </div>
                </Link>
                <Link href="/instructor/report">
                    <div className={cn(
                        "mx-2 py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                        pathname === "/instructor/report" && "bg-[#093073]"
                    )}>
                        <ChartColumnBigIcon />
                        Тайлан
                    </div>
                </Link>
                <Link href="/instructor/settings">
                    <div className={cn(
                        "mx-2 py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                        pathname === "/instructor/settings" && "bg-[#093073]"
                    )}>
                        <Settings />
                        Тохиргоо
                    </div>
                </Link>
            </div>
            <div className="mx-2 py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a] cursor-pointer" onClick={logout}>
                <LogOutIcon />
                Гарах
            </div>
        </div>
    );
}

export default Sidebar;