import { useNavigate } from "react-router-dom";
import { useApi } from "@/apis/useApi";
import { ApiEndpoints, HttpMethod } from "@/apis/apis.enum";
import { UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfileResponse } from "@/apis/apis.interface";
import Navbar from "@/components/shared/Navbar";

// Hook to fetch user profile
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

    // Handle loading state
    if (userProfileQuery.isLoading) {
        return <p className="text-center text-gray-500">Loading profile...</p>;
    }

    // Handle error state (e.g., 401 Unauthorized)
    if (userProfileQuery.isError) {
        toast.error("You've been signed out. Please sign in again.");
        navigate("/signin");
        return null;
    }

    // Safely access user data (data is guaranteed here since isError and isLoading are false)
    const user = userProfileQuery.data?.user;

    // If data is somehow still undefined (edge case), handle it gracefully
    if (!user) {
        return <p className="text-center text-red-500">Failed to load user data.</p>;
    }

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto p-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="text-lg font-semibold">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-lg font-semibold">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Roll Number</p>
                            <p className="text-lg font-semibold">{user.rollno}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Role</p>
                            <p className="text-lg font-semibold">{user.role}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Profile Completed</p>
                            <p className="text-lg font-semibold">{user.isProfileCompleted ? "Yes" : "No"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Profile;
