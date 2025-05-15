import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { localStorageService } from "@/services/localStorage.service";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { SignInRequest, SignInResponse } from "@/apis/apis.interface";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import { z, ZodIssue } from "zod";
import { Eye, EyeOff } from "lucide-react";

// Define Zod schema for SignInRequest
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});

const SignIn = () => {
  const navigate = useNavigate();

  // Check for access token on mount
  useEffect(() => {
    const accessToken = localStorageService.getItem<string>("access_token");
    if (accessToken) {
      navigate("/dashboard", { replace: true });
    }
    // No redirect for unauthenticated users; allow them to stay on /signin
  }, [navigate]);

  const [formData, setFormData] = useState<SignInRequest>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Define mutation with correct input type (SignInRequest)
  const mutation = useApi<SignInResponse, SignInRequest>(
    HttpMethod.POST,
    false,
    "signin",
    {
      url: ApiEndpoints.SIGNIN,
    }
  ) as UseMutationResult<SignInResponse, Error, SignInRequest, unknown>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input using Zod
    const validation = signInSchema.safeParse(formData);
    if (!validation.success) {
      validation.error.errors.forEach((err: ZodIssue) => toast.error(err.message));
      return;
    }

    // Pass formData to mutation
    mutation.mutate(formData, {
      onSuccess: (data) => {
        toast.success("Signed in successfully");
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
          <h2 className="text-3xl font-bold text-center text-[#c19a5b] mb-8">
            Welcome Back 👋
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
            <button
              type="submit"
              className="w-full bg-[#c19a5b] text-white font-semibold py-2 rounded-lg hover:bg-[#a6844a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <div className="text-sm text-center text-[#1f1f1f] mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#c19a5b] hover:underline font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;