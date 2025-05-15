import { useState } from "react";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { SignupRequest, SignupResponse } from "@/apis/apis.interface";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { localStorageService } from "@/services/localStorage.service";
import { UseMutationResult } from "@tanstack/react-query";
import { z, ZodIssue } from "zod";
import { Eye, EyeOff } from "lucide-react";

const signUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password not matched, retype the password",
    path: ["confirmPassword"],
});

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignupRequest & { confirmPassword: string }>({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const mutation = useApi<SignupResponse>(
        HttpMethod.POST,
        false,
        "signup",
        { url: ApiEndpoints.SIGNUP, body: { email: formData.email, password: formData.password, name: formData.name } }
    ) as UseMutationResult<SignupResponse, Error, void, unknown>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validation = signUpSchema.safeParse(formData);
        if (!validation.success) {
            validation.error.errors.forEach((err: ZodIssue) => toast.error(err.message));
            return;
        }

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
        <>
            <style>{`
                .no-password-toggle::-ms-reveal,
                .no-password-toggle::-ms-clear,
                .no-password-toggle::-webkit-credentials-auto-fill-button {
                    display: none !important;
                }
            `}</style>
            <div className="min-h-screen flex items-center justify-center bg-[#f9f5ef] px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-center font-cormorant uppercase text-[#c19a5b] mb-8">
                        Create Your Account
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-[#1f1f1f]">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your Name"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] placeholder-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-[#1f1f1f]">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] placeholder-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-[#1f1f1f]">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] placeholder-gray-400 no-password-toggle"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1f1f1f]">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] placeholder-gray-400 no-password-toggle"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#c19a5b] text-white font-semibold py-2 rounded-lg hover:bg-[#a6844a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>
                    <div className="text-sm text-center text-[#1f1f1f] mt-6">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-[#c19a5b] hover:underline font-medium">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;