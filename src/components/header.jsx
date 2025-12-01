"use client";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export async function logout() {
    await fetch("/api/logout", { method: "POST" });
    await signOut({ redirect: true, callbackUrl: "/" });
}

const Header = () => {
    const { data: session } = useSession();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (session && session.user) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, [session]);

    return (
        <header className="bg-linear-to-r from-sky-600 to-purple-800 text-white shadow-md">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <Link href="/" className="text-2xl font-bold">
                <div className="text-2xl font-bold">📚 LMS</div>
                </Link>
                    <ul className="flex space-x-8">
                        <li><a href="/" className="hover:opacity-80 transition-opacity">Нүүр</a></li>
                        <li><a href="/courses" className="hover:opacity-80 transition-opacity">Хичээлүүд</a></li>
                        {authenticated ? (
                            <>
                                <li><a href="/profile" className="hover:opacity-80 transition-opacity">Миний самбар</a></li>
                                <li><button onClick={logout} className="hover:opacity-80 transition-opacity">Гарах</button></li>
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