"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AuthClient() {
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
  const router = useRouter();
  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: null,
    password: "",
    role: ""
  });
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const type = searchParams.get("signup") !== null ? "signup" : "login";
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

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

    if (mode === "login") {
      try {
        const result = await signIn("credentials", {
          email: newUser.email,
          password: newUser.password,
          redirect: false
        })
        if (result.error) {
          toast.error("Имэйл эсвэл нууц үг буруу байна.");
          setLoading(false);
          return;
        }
        if (result.ok) {
          router.push("/");
        }
      } catch (err) {
        console.log("error " + err)
      } finally {
        setLoading(false);
      }
      return;
    }
    else if (mode === "signup") {
      const payload = {
        first_name: newUser.firstname,
        last_name: newUser.lastname,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        role: newUser.role
      };
      console.log("Payload:", payload);
      
      try {
        const res = await fetch(`${BACKEND}.auth.signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const response = await res.json();

        console.log("Response:", response);

        if (response.responseType === "ok") {
          setMode("login");
          router.push("/auth?login");
          toast.success(response.desc);
        } else {
          toast.error(response.desc);
        }
      } catch (err) {
        toast.error(err.desc || "Алдаа гарсан.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-black/40 bg- bg-[url(/login_background.jpg)] bg-cover bg-blend-overlay p-12 flex-col justify-between relative overflow-hidden">
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

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="text-purple-600 text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <span className="text-4xl">📚</span>
              LMS
            </div>
            <p className="text-gray-600">Сургалтын Удирдлагын Систем</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <Link href="/" className="w-fit mb-6 flex items-center gap-2">
              <ArrowLeft size={18} />
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
                    <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                      Овог
                    </Label>
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
                    <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                      Нэр
                    </Label>
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
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Утасны дугаар
                  </Label>
                  <Input
                    placeholder="99119911"
                    name="phone"
                    id="phone"
                    value={newUser?.phone ? newUser.phone : ""}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  И-мейл хаяг
                </Label>
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
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Нууц үг
                </Label>
                <InputGroup className="h-11 overflow-hidden">
                  <InputGroupInput
                    placeholder="••••••••"
                    name="password"
                    id="password"
                    value={newUser.password}
                    onChange={handleChange}
                    required
                    className="h-11"
                    type={showPassword ? "text" : "password"}
                  />
                  <InputGroupAddon align="inline-end">
                    <Button type="button" onClick={handleShowPassword} variant="ghost" className="h-10 w-10 p-0 hover:bg-none">
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              {mode === "login" && (
                <div className="flex justify-end">
                  <a href="/auth/forgotPassword" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                    Нууц үгээ мартсан уу?
                  </a>
                </div>
              )}

              {mode === "signup" && (
                <Select onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Бүртгүүлэх хэлбэр" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Student">Суралцагч</SelectItem>
                      <SelectItem value="Instructor">Багш</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              <Button
                className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
                disabled={loading}
                type="submit"
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
                  <a href="/auth?signup" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                    Бүртгүүлэх
                  </a>
                </p>
              ) : (
                <p className="text-gray-600">
                  Бүртгэлтэй юу?{" "}
                  <a href="/auth?login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                    Нэвтрэх
                  </a>
                </p>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            © 2025 LMS. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </div>
  );
}