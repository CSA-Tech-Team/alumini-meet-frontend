import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { VerifyOtpRequest, VerifyOtpResponse } from "@/apis/apis.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

                if (!data.message) {
                    toast.success("OTP Verification Successful. Redirecting to Login page...");
                } else {
                    toast.success(data.message);
                }

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
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Verify OTP</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Email" name="email" type="email" value={formData.email} readOnly />
                <Input placeholder="Enter OTP" name="otp" type="text" maxLength={4} value={formData.otp} onChange={handleChange} />
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Verifying..." : "Verify OTP"}
                </Button>
            </form>
        </div>
    );
};

export default VerifyOtp;
