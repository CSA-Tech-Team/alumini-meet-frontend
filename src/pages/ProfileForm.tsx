import { useState } from "react";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { ProfileUpdateRequest, ProfileUpdateResponse, Course, FoodPreference } from "@/apis/apis.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const courseOptions: { label: string; value: Course }[] = [
    { label: "Software Systems", value: Course.SOFTWARE_SYSTEMS },
    { label: "Cyber Security", value: Course.CYBER_SECURITY },
    { label: "Data Science", value: Course.DATA_SCIENCE },
    { label: "Theoretical Computer Science", value: Course.THEORETICAL_COMPUTER_SCIENCE },
    { label: "Applied Mathematics", value: Course.APPLIED_MATHEMATICS },
];

const foodPreferenceOptions: { label: string; value: FoodPreference }[] = [
    { label: "Veg", value: FoodPreference.VEG },
    { label: "Non-Veg", value: FoodPreference.NON_VEG },
];

const ProfileForm = () => {
    const [formData, setFormData] = useState<ProfileUpdateRequest>({
        addr: "",
        course: "" as Course,
        foodPreference: "" as FoodPreference,
        designation: "",
        gender: "",
        gradyear: 2027,
        rollno: "",
        phonenumber: "",
    });

    const navigate = useNavigate();

    const mutation = useApi<ProfileUpdateResponse, ProfileUpdateRequest>(
        HttpMethod.PUT,
        true, // Requires authentication
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

    const validateForm = () => {
        // Validate the course and foodPreference fields
        if (!formData.course || !Object.values(Course).includes(formData.course)) {
            toast.error("Please select a valid course.");
            return false;
        }

        if (!formData.foodPreference || !Object.values(FoodPreference).includes(formData.foodPreference)) {
            toast.error("Please select a valid food preference.");
            return false;
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data before submitting
        if (!validateForm()) return;

        mutation.mutate(formData, {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
                navigate("/dashboard"); // Navigate to /dashboard after successful profile update
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
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <Input placeholder="Address" name="addr" value={formData.addr} onChange={handleChange} />

                <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md text-gray-500"
                >
                    <option value="" disabled>Select your course</option>
                    {courseOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <select
                    name="foodPreference"
                    value={formData.foodPreference}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md text-gray-500"
                >
                    <option value="" disabled>Select your food preference</option>
                    {foodPreferenceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <Input placeholder="Designation" name="designation" value={formData.designation} onChange={handleChange} />
                <Input placeholder="Gender" name="gender" value={formData.gender} onChange={handleChange} />
                <Input placeholder="Graduation Year" name="gradyear" type="number" value={formData.gradyear} onChange={handleChange} />
                <Input placeholder="Roll Number" name="rollno" value={formData.rollno} onChange={handleChange} />
                <Input placeholder="Phone Number" name="phonenumber" type="tel" value={formData.phonenumber} onChange={handleChange} />

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
            </form>
        </div>
    );
};

export default ProfileForm;
