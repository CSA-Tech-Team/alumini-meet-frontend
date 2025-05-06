import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { VerifyOtpRequest, VerifyOtpResponse } from "@/apis/apis.interface";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import { localStorageService } from "@/services/localStorage.service";

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
        <div className="min-h-screen flex items-center justify-center bg-[#f9f5ef] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-[#c19a5b] mb-8">
                    Verify Your OTP 🔐
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-[#1f1f1f]">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            readOnly
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-[#1f1f1f] cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="otp" className="block text-sm font-medium text-[#1f1f1f]">
                            Enter OTP
                        </label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            maxLength={4}
                            placeholder="4-digit OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#c19a5b] text-white font-semibold py-2 rounded-lg hover:bg-[#a6844a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;