import { useParams } from "react-router-dom";
import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Event } from "@/apis/apis.interface";
import { UseQueryResult, UseMutationResult } from "@tanstack/react-query";

// Hook to fetch event details
const useEventDetails = (eventId: string) => {
    return useApi<Event>(
        HttpMethod.GET,
        true, // Requires authentication
        `getEventDetails-${eventId}`,
        { url: `${ApiEndpoints.GET_EVENT_DETAILS}/${eventId}` }
    ) as UseQueryResult<Event, Error>;
};

// Hook to register for an event
const useRegisterForEvent = (eventId: string) => {
    return useApi<null>(
        HttpMethod.POST,
        true, // Requires authentication
        `registerEvent-${eventId}`,
        { url: `${ApiEndpoints.REGISTER_EVENT}/${eventId}/join` }
    ) as UseMutationResult<null, Error, void, unknown>;
};

const EventDetails = () => {
    const { eventId } = useParams<{ eventId: string }>(); // Get event ID from URL

    // Fetch event details
    const query = useEventDetails(eventId!);
    
    // Mutation for event registration
    const mutation = useRegisterForEvent(eventId!);

    // Handle event registration
    const handleRegister = () => {
        mutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("Successfully registered for the event!");
            },
            onError: (error) => {
                // Extract error message from response
                const errorMessage = (error as any)?.response?.data?.message || error.message;
                if (errorMessage === "User already joined the activity") {
                    toast.info("You are already registered for this event.");
                } else {
                    toast.error("Failed to register for the event.");
                }
            },
        });
    };

    // Handle loading state
    if (query.isLoading) {
        return <p className="text-center text-gray-500">Loading event details...</p>;
    }

    // Handle error state
    if (query.isError) {
        toast.error("Failed to load event details.");
        return <p className="text-center text-red-500">Error fetching event details.</p>;
    }

    // Event data
    const event = query.data;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
            <Card className="w-full h-auto shadow-lg transition-all transform hover:scale-105 hover:shadow-xl">
                <CardContent className="p-4 flex flex-col h-full">
                    <CardTitle>{event?.eventName}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 flex-grow">{event?.about}</CardDescription>
                    <Button
                        className="mt-4 w-full"
                        onClick={handleRegister}
                        disabled={mutation.isPending} // Disable while registering
                    >
                        {mutation.isPending ? "Registering..." : "Register"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default EventDetails;
