import { useState } from "react";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { Course, SignupRequest, SignupResponse } from "@/apis/apis.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { localStorageService } from "@/services/localStorage.service";

const courseOptions: { label: string; value: Course }[] = [
    { label: "Software Systems", value: Course.SOFTWARE_SYSTEMS },
    { label: "Cyber Security", value: Course.CYBER_SECURITY },
    { label: "Data Science", value: Course.DATA_SCIENCE },
    { label: "Theoretical Computer Science", value: Course.THEORETICAL_COMPUTER_SCIENCE },
    { label: "Applied Mathematics", value: Course.APPLIED_MATHEMATICS },
];

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<SignupRequest>({
        email: "",
        password: "",
        name: "",
        addr: "",
        course: "" as Course,
        designation: "",
        gender: "",
        gradyear: 2027,
        rollno: "",
        phonenumber: "",
    });

    const mutation = useApi<SignupResponse>(
        HttpMethod.POST,
        false,
        "signup",
        { url: ApiEndpoints.SIGNUP, body: formData }
    ) as UseMutationResult<SignupResponse, Error, void, unknown>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "gradyear" ? Number(value) : value,
        }));
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
                    } 
                    else if (status === 500) {
                        toast.error("Server error! Please try again later.");
                    } 
                    else {
                        toast.error(data.message || "Something went wrong.");
                    }
                } 
                else {
                    toast.error("Network error. Please check your connection.");
                }
            },
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Signup</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Email" name="email" type="email" onChange={handleChange} />
                <Input placeholder="Password" name="password" type="password" onChange={handleChange} />
                <Input placeholder="Name" name="name" onChange={handleChange} />
                <Input placeholder="Address" name="addr" onChange={handleChange} />

                <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md text-gray-500"
                >
                    <option value="" disabled>
                        Select your course
                    </option>
                    {courseOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <Input placeholder="Designation" name="designation" onChange={handleChange} />
                <Input placeholder="Gender" name="gender" onChange={handleChange} />
                <Input placeholder="Graduation Year" name="gradyear" type="number" onChange={handleChange} />
                <Input placeholder="Roll Number" name="rollno" onChange={handleChange} />
                <Input placeholder="Phone Number" name="phonenumber" type="tel" onChange={handleChange} />

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Signing Up..." : "Sign Up"}
                </Button>
            </form>
        </div>
    );
};

export default Signup;
