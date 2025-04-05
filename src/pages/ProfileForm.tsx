import { useState } from "react";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import {
    ProfileUpdateRequest,
    ProfileUpdateResponse,
    Course,
    FoodPreference,
    Gender
} from "@/apis/apis.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { z, ZodIssue } from "zod";

const courseOptions = [
    { label: "Software Systems", value: Course.SOFTWARE_SYSTEMS },
    { label: "Cyber Security", value: Course.CYBER_SECURITY },
    { label: "Data Science", value: Course.DATA_SCIENCE },
    { label: "Theoretical Computer Science", value: Course.THEORETICAL_COMPUTER_SCIENCE },
    { label: "Applied Mathematics", value: Course.APPLIED_MATHEMATICS },
];

const foodPreferenceOptions = [
    { label: "Veg", value: FoodPreference.VEG },
    { label: "Non-Veg", value: FoodPreference.NON_VEG },
];

const profileSchema = z.object({
    addr: z.string().optional(),

    course: z
        .nativeEnum(Course, {
            errorMap: () => ({ message: "Please select a valid course" }),
        })
        .optional(),

    foodPreference: z.nativeEnum(FoodPreference, {
        errorMap: () => ({ message: "Please select a food preference" }),
    }),

    designation: z.string().optional(),

    gender: z.nativeEnum(Gender, {
        errorMap: () => ({ message: "Please select a gender" }),
    }),

    gradyear: z
        .union([
            z.number()
                .max(2025, "Graduation year must be 2025 or earlier")
                .refine((val) => !isNaN(val), {
                    message: "Graduation year must be a number",
                }),
            z.undefined(),
        ]),

    rollno: z
        .string()
        .trim()
        .optional()
        .refine((val) => !val || val.length > 0, {
            message: "Roll number is required",
        }),

    phonenumber: z
        .string({ required_error: "Phone number is required" })
        .regex(/^\d{10}$/, "Phone number must be 10 digits"),
});



const ProfileForm = () => {
    const [formData, setFormData] = useState<ProfileUpdateRequest>({
        addr: "",
        course: "" as Course,
        foodPreference: "" as FoodPreference,
        designation: "",
        gender: "" as Gender,
        gradyear: 2027,
        rollno: "",
        phonenumber: "",
    });

    const navigate = useNavigate();

    const mutation = useApi<ProfileUpdateResponse, ProfileUpdateRequest>(
        HttpMethod.PUT,
        true,
        "updateProfile",
        { url: ApiEndpoints.UPDATE_PROFILE }
    ) as UseMutationResult<ProfileUpdateResponse, Error, ProfileUpdateRequest, unknown>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "gradyear" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validation = profileSchema.safeParse(formData);

        if (!validation.success) {
            validation.error.errors.forEach((err: ZodIssue) => toast.error(err.message));
            return;
        }

        mutation.mutate(formData, {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
                navigate("/dashboard");
            },
            onError: (error: any) => {
                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 401) {
                        toast.error("Unauthorized! Please login again.");
                    } else if (status === 400) {
                        if (Array.isArray(data.message)) {
                            data.message.forEach((msg: string) => toast.error(msg));
                        } else {
                            toast.error(data.message);
                        }
                    } else {
                        toast.error("An error occurred. Please try again later.");
                    }
                } else {
                    toast.error("Network error. Please check your connection.");
                }
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100 px-4">
            <Card className="w-full max-w-2xl border border-slate-200 shadow-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-slate-800">
                        Update Profile 👤
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="addr">Address</Label>
                            <Input id="addr" name="addr" value={formData.addr} onChange={handleChange} />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="course">Course</Label>
                            <select
                                id="course"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md bg-white text-gray-700"
                            >
                                <option value="" disabled>Select your course</option>
                                {courseOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="foodPreference">Food Preference</Label>
                            <select
                                id="foodPreference"
                                name="foodPreference"
                                value={formData.foodPreference}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md bg-white text-gray-700"
                            >
                                <option value="" disabled>Select your preference</option>
                                {foodPreferenceOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="designation">Designation</Label>
                            <Input
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="gender">Gender</Label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="" disabled>Select your gender</option>
                                {Object.values(Gender).map((gender) => (
                                    <option key={gender} value={gender}>
                                        {gender === Gender.PreferNotToSay ? "Prefer not to say" : gender}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="gradyear">Graduation Year</Label>
                            <Input
                                id="gradyear"
                                name="gradyear"
                                type="number"
                                value={formData.gradyear}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="rollno">Roll Number</Label>
                            <Input id="rollno" name="rollno" value={formData.rollno} onChange={handleChange} />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="phonenumber">Phone Number</Label>
                            <Input
                                id="phonenumber"
                                name="phonenumber"
                                type="tel"
                                value={formData.phonenumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Updating..." : "Update Profile"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileForm;