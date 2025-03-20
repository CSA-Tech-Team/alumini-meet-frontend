import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { UseQueryResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GetAllEventsResponse, GetUserActivitiesResponse } from "@/apis/apis.interface";
import { useNavigate } from "react-router-dom";

// Fetch the user's participated events
const useUserActivities = () => {
    return useApi<GetUserActivitiesResponse[]>(
        HttpMethod.GET,
        true, // Requires authentication
        "getUserActivities",
        { url: ApiEndpoints.GET_USER_ACTIVITIES }
    );
};

const Dashboard = () => {
    // Fetching all events
    const query = useApi<GetAllEventsResponse>(
        HttpMethod.GET,
        true, // Requires authentication
        "getAllEvents",
        { url: ApiEndpoints.GET_ALL_EVENTS }
    ) as UseQueryResult<GetAllEventsResponse, Error>;

    // Fetching the list of events the user is already registered for
    const userActivitiesQuery = useUserActivities() as UseQueryResult<GetUserActivitiesResponse[], Error>;

    // Using react-router to navigate to event details
    const navigate = useNavigate();

    // Handle loading state for events and user activities
    if (query.isLoading || userActivitiesQuery.isLoading) {
        return <p className="text-center text-gray-500">Loading events...</p>;
    }

    // Handle error state for events and user activities
    if (query.isError || userActivitiesQuery.isError) {
        toast.error("Failed to load events or activities.");
        return <p className="text-center text-red-500">Error fetching data.</p>;
    }

    // Navigate to the event details page
    const handleSeeMore = (eventId: string) => {
        navigate(`/events/${eventId}`);
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-center mb-6">Upcoming Events</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {query.data?.map((event) => (
                    <Card 
                        key={event.id} 
                        className="w-full h-auto shadow-lg transition-all transform hover:scale-105 hover:shadow-xl hover:h-[calc(100%+20px)] overflow-hidden">
                        <CardContent className="p-4 flex flex-col h-full">
                            <CardTitle>{event.eventName}</CardTitle>
                            <CardDescription className="text-sm text-gray-600 flex-grow">{event.about}</CardDescription>
                            <Button 
                                className="mt-4 w-full"
                                onClick={() => handleSeeMore(event.id)} // Navigate to event details page
                            >
                                See More
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <h2 className="text-xl font-bold text-center mt-12 mb-6">Your Participated Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userActivitiesQuery.data?.map((activity) => (
                    <Card key={activity.id} className="w-full h-auto shadow-lg">
                        <CardContent className="p-4 flex flex-col h-full">
                            <CardTitle>{activity.event.eventName}</CardTitle>
                            <CardDescription className="text-sm text-gray-600 flex-grow">{activity.event.about}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
