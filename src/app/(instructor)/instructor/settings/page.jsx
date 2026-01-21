"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save, Share2 } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function InstructorSettings() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
    const [stripeAccount, setStripeAccount] = useState(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    async function connectStripe() {
        const res = await fetch(
            "http://localhost:8000/api/method/lms_app.api.stripe.create_onboarding_link",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${await getSession().then(session => session?.user?.accessToken)}`
                }
            }
        );

        const response = await res.json();
        console.log(response);
        router.push(response.data.url)
    }

    const fetchStripeAccount = async () => {
        const session = await getSession();
        const res = await fetch(
            `${BACKEND}.stripe.get_stripe_account_status`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                }
            }
        );

        const response = await res.json();
        setStripeAccount(response.data);
        console.log(response);
    }

    useEffect(() => {
        fetchStripeAccount();
    }, []);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const passwordsMatch = newPassword.length > 0 && newPassword === confirmNewPassword;

    const passwordRepeat = oldPassword.length > 0 && oldPassword === newPassword;

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "oldPassword") {
            setOldPassword(value);
        } else if (id === "newPassword") {
            setNewPassword(value);
        } else if (id === "confirmNewPassword") {
            setConfirmNewPassword(value);
        }
    }

    const changePassword = async () => {
        try {
            if (!passwordsMatch) {
                toast.error("Шинэ нууц үг таарахгүй байна.");
                return;
            }
            if (passwordRepeat) {
                toast.error("Шинэ нууц үг хуучин нууц үгтэй ижил байна.");
                return;
            }
            const session = await getSession();
            const res = await fetch(`${BACKEND}.auth.change_password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                })
            });
            const response = await res.json();
            console.log(response);
            if (response.responseType === "ok") {
                toast.success(response.desc);
            } else {
                toast.error(response.desc);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">Stripe хаяг</h3>
                <div className="flex items-end gap-10">
                    <div className="flex flex-col gap-4">
                        <Label>Stripe хаяг ID</Label>
                        <p className="border border-gray-200 rounded-md shadow-xs px-4 py-2 font-semibold text-blue-500">
                            {stripeAccount?.account_id}
                        </p>
                    </div>
                    <Button size="lg" onClick={connectStripe} className="bg-blue-900 hover:bg-blue-800">
                        <Share2/> Stripe холбох
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">Нууц үг солих</h3>
                <div className="flex items-start gap-8">
                    <div className="flex flex-col gap-3">
                        <Label>Хуучин нууц үг</Label>
                        <InputGroup className="h-11 overflow-hidden">
                            <InputGroupInput
                                placeholder="••••••••"
                                name="oldPassword"
                                id="oldPassword"
                                required
                                className="h-11"
                                value={oldPassword}
                                onChange={handleInputChange}
                                type={showPassword ? "text" : "password"}
                            />
                            <InputGroupAddon align="inline-end">
                                <Button onClick={handleShowPassword} type="button" variant="ghost" className="h-10 w-10 p-0 hover:bg-none">
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Шинэ нууц үг</Label>
                        <InputGroup className="h-11 overflow-hidden">
                            <InputGroupInput
                                placeholder="••••••••"
                                name="newPassword"
                                id="newPassword"
                                required
                                className="h-11"
                                value={newPassword}
                                onChange={handleInputChange}
                                type={showPassword ? "text" : "password"}
                            />
                            <InputGroupAddon align="inline-end">
                                <Button onClick={handleShowPassword} type="button" variant="ghost" className="h-10 w-10 p-0 hover:bg-none">
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                        {newPassword.length > 0 && passwordRepeat ? 
                            <p className="text-red-500">
                                Passwords can't be the same
                            </p> 
                            :
                            null
                        }
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Шинэ нууц үг давтах</Label>
                        <InputGroup className="h-11 overflow-hidden">
                            <InputGroupInput
                                placeholder="••••••••"
                                name="confirmNewPassword"
                                id="confirmNewPassword"
                                required
                                className="h-11"
                                value={confirmNewPassword}
                                onChange={handleInputChange}
                                type={showPassword ? "text" : "password"}
                            />
                            <InputGroupAddon align="inline-end">
                                <Button onClick={handleShowPassword} type="button" variant="ghost" className="h-10 w-10 p-0 hover:bg-none">
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                        {confirmNewPassword.length > 0 && passwordsMatch ? 
                            null
                            :
                            <p className="text-red-500">
                                Passwords do not match
                            </p> 
                        }
                    </div>
                    <Button size="lg" onClick={changePassword} className="mt-7 bg-blue-900 hover:bg-blue-800">
                        <Save /> Хадгалах
                    </Button>
                </div>
            </div>
        </div>
    );
}