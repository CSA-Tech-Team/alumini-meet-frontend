import { useState } from "react";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { SignInRequest, SignInResponse } from "@/apis/apis.interface";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { localStorageService } from "@/services/localStorage.service";
import { UseMutationResult } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SignIn = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignInRequest>({
        email: "",
        password: "",
    });

    const mutation = useApi<SignInResponse>(
        HttpMethod.POST,
        false,
        "signin",
        {
            url: ApiEndpoints.SIGNIN,
            body: formData,
        }
    ) as UseMutationResult<SignInResponse, Error, void, unknown>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(undefined, {
            onSuccess: (data) => {
                toast.success(data.message);
                localStorageService.setItem("access_token", data.access_token);
                if (data.isProfileCompleted === undefined || data.isProfileCompleted) {
                    navigate("/dashboard");
                } else {
                    navigate("/profile-update");
                }
            },
            onError: (error: any) => {
                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 400) {
                        if (Array.isArray(data.message)) {
                            data.message.forEach((msg: string) => toast.error(msg));
                        } else if (data.message === "User is not OTP verified") {
                            toast.error("Please verify your OTP first.");
                        } else {
                            toast.error("Invalid request. Please check your input.");
                        }
                    } else if (status === 500) {
                        toast.error("Server error! Please try again later.");
                    } else {
                        toast.error(data.message || "Something went wrong.");
                    }
                } else {
                    toast.error("Network error. Please check your connection.");
                }
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
            <Card className="w-full max-w-md shadow-xl border-2 border-slate-300">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-slate-800">
                        Welcome Back 👋
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>
                    <div className="text-sm text-center text-gray-600 mt-6">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                            Sign Up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignIn;
