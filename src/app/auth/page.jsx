"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const [newUser, setNewUser] = useState({firstname: "", lastname: "", email: "", phone: null, password: "",});
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const type = searchParams.get("signup") !== null ? "signup" : "login";
  const [mode, setMode] = useState("login");

  useEffect(() => {
    setMode(type);
  }, [type]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewUser({
        ...newUser,
      [id]: id === "phone" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url =
      mode === "signup"
        ? "http://localhost:8000/api/signup/"
        : "http://localhost:8000/api/login/";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Алдаа гарсан.");
      toast.success( data.message);
      console.log("Response:", data);
    } catch (err) {
        toast.error( err.message || "Алдаа гарсан." );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black/40 bg- bg-[url(/login_background.jpg)] bg-cover bg-blend-overlay p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-white text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-5xl">📚</span>
            LMS
          </div>
          <p className="text-white text-lg">Сургалтын Удирдлагын Систем</p>
        </div>
        
        <div className="relative z-10 text-white space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Хаана ч, хэзээ ч<br />суралцаарай
          </h2>
          <p className="text-white text-lg">
            Таны амжилтын түлхүүр. Мэргэжлийн багш нар, олон төрлийн хичээлүүд таныг хүлээж байна.
          </p>
          
          <div className="flex gap-8 pt-8 text-white">
            <div>
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm">Хичээлүүд</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5,000+</div>
              <div className="text-sm">Оюутнууд</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm">Багш нар</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-purple-600 text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <span className="text-4xl">📚</span>
              LMS
            </div>
            <p className="text-gray-600">Сургалтын Удирдлагын Систем</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <Link href="/" className="w-fit mb-6 flex items-center gap-2">
              <ArrowLeft size={18}/>
              Буцах
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mode === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
              </h1>
              <p className="text-gray-600">
                {mode === "login" 
                  ? "Өөрийн эрхээр нэвтэрнэ үү" 
                  : "Шинэ эрх үүсгэнэ үү"}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                      Овог
                    </label>
                    <Input
                      placeholder="Овог"
                      name="lastname"
                      id="lastname"
                      value={newUser.lastname}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                      Нэр
                    </label>
                    <Input
                      placeholder="Нэр"
                      name="firstname"
                      id="firstname"
                      value={newUser.firstname}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>
                </div>
              )}
              
              {mode === "signup" && (
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Утасны дугаар
                  </label>
                  <Input
                    placeholder="99119911"
                    name="phone"
                    id="phone"
                    value={newUser?.phone? newUser.phone : ""}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  И-мейл хаяг
                </label>
                <Input
                  placeholder="example@email.com"
                  type="email"
                  name="email"
                  id="email"
                  value={newUser.email}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Нууц үг
                </label>
                <Input
                  placeholder="••••••••"
                  type="password"
                  name="password"
                  id="password"
                  value={newUser.password}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              {mode === "login" && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
                    Нууц үгээ мартсан уу?
                  </a>
                </div>
              )}

              <Button 
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold" 
                disabled={loading}
              >
                {loading
                  ? "Түр хүлээнэ үү..."
                  : mode === "login"
                  ? "Нэвтрэх"
                  : "Бүртгүүлэх"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">эсвэл</span>
              </div>
            </div>

            <div className="text-center">
              {mode === "login" ? (
                <p className="text-gray-600">
                  Бүртгэлгүй юу?{" "}
                  <a href="/auth?signup" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                    Бүртгүүлэх
                  </a>
                </p>
              ) : (
                <p className="text-gray-600">
                  Бүртгэлтэй юу?{" "}
                  <a href="/auth?login" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                    Нэвтрэх
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            © 2025 LMS. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </div>
  );
}