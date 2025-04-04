import { useNavigate } from "react-router-dom";
import { useApi } from "@/apis/useApi";
import { ApiEndpoints, HttpMethod } from "@/apis/apis.enum";
import { UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfileResponse } from "@/apis/apis.interface";
import Navbar from "@/components/shared/Navbar";
import { BadgeCheck, XCircle } from "lucide-react";

const useUserProfile = () => {
    return useApi<UserProfileResponse>(
        HttpMethod.GET,
        true,
        "userProfile",
        { url: ApiEndpoints.ME }
    ) as UseQueryResult<UserProfileResponse, Error>;
};

const Profile = () => {
    const navigate = useNavigate();
    const userProfileQuery = useUserProfile();

    if (userProfileQuery.isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <p className="text-lg text-gray-500 animate-pulse">Loading profile...</p>
            </div>
        );
    }

    if (userProfileQuery.isError) {
        toast.error("You've been signed out. Please sign in again.");
        navigate("/signin");
        return null;
    }

    const user = userProfileQuery.data?.user;

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <p className="text-lg text-red-500 font-medium">Failed to load user data.</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-white to-sky-50 py-10 px-4 flex justify-center">
                <Card className="w-full max-w-2xl shadow-xl border border-slate-200 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-center text-3xl font-bold text-indigo-700">
                            👤 Your Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 px-6 pb-6">
                        <ProfileField label="Name" value={user.name} />
                        <ProfileField label="Email" value={user.email} />
                        <ProfileField label="Roll Number" value={user.rollno} />
                        <ProfileField label="Role" value={user.role} />
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600 font-medium">Profile Completed</p>
                            {user.isProfileCompleted ? (
                                <span className="flex items-center gap-1 text-green-600 font-semibold">
                                    <BadgeCheck className="w-5 h-5" /> Yes
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-red-500 font-semibold">
                                    <XCircle className="w-5 h-5" /> No
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

// Helper component for clean field display
const ProfileField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between">
        <p className="text-gray-600 font-medium">{label}</p>
        <p className="text-slate-800 font-semibold">{value}</p>
    </div>
);

export default Profile;
