import { useNavigate } from "react-router-dom";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { User } from "lucide-react"; // Assuming you're using lucide-react for icons
import { UserProfileResponse } from "@/apis/apis.interface";



// Hook to fetch user profile
const useUserProfile = () => {
    return useApi<UserProfileResponse>(
        HttpMethod.GET,
        true, // Requires authentication
        "userProfile",
        { url: ApiEndpoints.ME } 
    ) as UseQueryResult<UserProfileResponse, Error>;
};

const Navbar = () => {
    const navigate = useNavigate();
    const userProfileQuery = useUserProfile();

    // Handle loading state
    if (userProfileQuery.isLoading) {
        return <div className="w-full h-16 bg-gray-100 animate-pulse" />; // Placeholder while loading
    }

    // Handle error state (e.g., 401 Unauthorized)
    if (userProfileQuery.isError) {
        toast.error("You've been signed out. Please sign in again.");
        navigate("/signin");
        return null; // Return null since we're redirecting
    }

    // Navigate to profile page
    const handleProfileClick = () => {
        navigate("/profile");
    };

    return (
        <div className="w-full h-16 bg-white shadow-md flex items-center justify-between px-4">
            {/* Left-side Navigation Menu */}
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            onClick={() => navigate("/")}
                        >
                            Home
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            onClick={() => navigate("/dashboard")}
                        >
                            Dashboard
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {/* Add more links as needed */}
                </NavigationMenuList>
            </NavigationMenu>

            {/* Right-side User Icon */}
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
                <User className="h-6 w-6 text-gray-700" />
            </Button>
        </div>
    );
};

export default Navbar;
