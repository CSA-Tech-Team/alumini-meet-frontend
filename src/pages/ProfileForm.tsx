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
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
        <div className="min-h-screen flex items-center justify-center bg-[#f9f5ef] px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center font-cormorant uppercase text-[#c19a5b] mb-8">
                    Update Profile 👤
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="addr" className="block text-sm font-medium text-[#1f1f1f]">
                            Address
                        </label>
                        <input
                            id="addr"
                            name="addr"
                            value={formData.addr}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] placeholder-gray-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="course" className="block text-sm font-medium text-[#1f1f1f]">
                            Course
                        </label>
                        <select
                            id="course"
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] bg-white"
                        >
                            <option value="" disabled>Select your course</option>
                            {courseOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="foodPreference" className="block text-sm font-medium text-[#1f1f1f]">
                            Food Preference
                        </label>
                        <select
                            id="foodPreference"
                            name="foodPreference"
                            value={formData.foodPreference}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] bg-white"
                        >
                            <option value="" disabled>Select your preference</option>
                            {foodPreferenceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="designation" className="block text-sm font-medium text-[#1f1f1f]">
                            Designation
                        </label>
                        <input
                            id="designation"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] placeholder-gray-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="gender" className="block text-sm font-medium text-[#1f1f1f]">
                            Gender
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] bg-white"
                        >
                            <option value="" disabled>Select your gender</option>
                            {Object.values(Gender).map((gender) => (
                                <option key={gender} value={gender}>
                                    {gender === Gender.PreferNotToSay ? "Prefer not to say" : gender}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="gradyear" className="block text-sm font-medium text-[#1f1f1f]">
                            Graduation Year
                        </label>
                        <input
                            id="gradyear"
                            name="gradyear"
                            type="number"
                            value={formData.gradyear}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] placeholder-gray-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="rollno" className="block text-sm font-medium text-[#1f1f1f]">
                            Roll Number
                        </label>
                        <input
                            id="rollno"
                            name="rollno"
                            value={formData.rollno}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] placeholder-gray-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="phonenumber" className="block text-sm font-medium text-[#1f1f1f]">
                            Phone Number
                        </label>
                        <input
                            id="phonenumber"
                            name="phonenumber"
                            type="tel"
                            value={formData.phonenumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c19a5b] text-[#1f1f1f] placeholder-gray-400"
                        />
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            className="w-full bg-[#c19a5b] text-white font-semibold py-2 rounded-lg hover:bg-[#a6844a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;