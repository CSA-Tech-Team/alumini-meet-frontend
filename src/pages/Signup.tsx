import { useState } from "react";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { SignupRequest, SignupResponse } from "@/apis/apis.interface";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { localStorageService } from "@/services/localStorage.service";
import { UseMutationResult } from "@tanstack/react-query";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignupRequest>({
        email: "",
        password: "",
        name: "",
    });

    const mutation = useApi<SignupResponse>(
        HttpMethod.POST,
        false,
        "signup",
        { url: ApiEndpoints.SIGNUP, body: formData }
    ) as UseMutationResult<SignupResponse, Error, void, unknown>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(undefined, {
            onSuccess: (data) => {
                toast.success(data.message);
                localStorageService.setItem("email", formData.email);
                navigate("/verify-otp");
            },
            onError: (error: any) => {
                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 400) {
                        if (Array.isArray(data.message)) {
                            data.message.forEach((msg: string) => toast.error(msg));
                        } else if (data.message === "User already exists") {
                            toast.error("This email is already registered. Try logging in.");
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
                        Create Your Account ✨
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your Name"
                                onChange={handleChange}
                                required
                            />
                        </div>
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
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Signing Up..." : "Sign Up"}
                        </Button>
                    </form>
                    <div className="text-sm text-center text-gray-600 mt-6">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-emerald-600 hover:underline font-medium">
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;
