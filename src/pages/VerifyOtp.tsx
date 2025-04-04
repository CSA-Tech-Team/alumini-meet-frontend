import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { VerifyOtpRequest, VerifyOtpResponse } from "@/apis/apis.interface";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import { localStorageService } from "@/services/localStorage.service";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const VerifyOtp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<VerifyOtpRequest>({
        email: "",
        otp: "",
    });

    useEffect(() => {
        const storedEmail = localStorageService.getItem<string>("email");
        if (storedEmail) {
            setFormData((prev) => ({ ...prev, email: storedEmail }));
        } else {
            toast.error("No email found! Redirecting to Sign Up...");
            navigate("/signup");
        }
    }, [navigate]);

    const mutation = useApi<VerifyOtpResponse, VerifyOtpRequest>(
        HttpMethod.PUT,
        false,
        "verify-otp",
        { url: ApiEndpoints.VERIFY_OTP }
    ) as UseMutationResult<VerifyOtpResponse, Error, VerifyOtpRequest, unknown>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, otp: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.otp.length !== 4) {
            toast.error("OTP must be a 4-digit number.");
            return;
        }

        mutation.mutate(formData, {
            onSuccess: (data) => {
                localStorageService.removeItem("email");
                toast.success(data.message || "OTP Verified. Redirecting to Sign In...");
                navigate("/signin");
            },
            onError: (error: any) => {
                if (error.response?.status === 401) {
                    toast.error("Invalid OTP. Please try again.");
                } else {
                    toast.error("Something went wrong. Try again.");
                }
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
            <Card className="w-full max-w-md shadow-xl border border-slate-300">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-slate-800">
                        Verify Your OTP 🔐
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
                                value={formData.email}
                                readOnly
                                className="bg-slate-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input
                                id="otp"
                                name="otp"
                                type="text"
                                maxLength={4}
                                placeholder="4-digit OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyOtp;
