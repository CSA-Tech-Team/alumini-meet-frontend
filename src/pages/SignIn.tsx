import { useState } from "react";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { SignInRequest, SignInResponse } from "@/apis/apis.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { localStorageService } from "@/services/localStorage.service";

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
        { url: ApiEndpoints.SIGNIN, body: formData }
    ) as UseMutationResult<SignInResponse, Error, void, unknown>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(undefined, {
            onSuccess: (data) => {
                toast.success(data.message);

                // Store access token in localStorage
                localStorageService.setItem("access_token", data.access_token);

                // Navigate based on profile completion
                // TODO: Remove undefined condition once api is fixed
                if (data.isProfileCompleted === undefined || data.isProfileCompleted === true) {
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
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    placeholder="Email"
                    name="email"
                    type="email"
                    onChange={handleChange}
                />
                <Input
                    placeholder="Password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                />
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Signing In..." : "Sign In"}
                </Button>
            </form>
        </div>
    );
};

export default SignIn;
