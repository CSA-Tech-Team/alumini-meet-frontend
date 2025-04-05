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
import { z, ZodIssue } from "zod";

// Zod schema for signup request validation
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
});

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl shadow-2xl border border-blue-300 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold ">
          Create Your Account ✨
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
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
              <Label htmlFor="email">Email Address</Label>
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
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition-colors duration-300"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <div className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-700 hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
