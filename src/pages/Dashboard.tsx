import { useApi } from "@/apis/useApi";
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GetAllEventsResponse, GetUserActivitiesResponse, SingingRequest, SingingResponse } from "@/apis/apis.interface";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Fetch the user's participated events and singing activities
const useUserActivities = () => {
    return useApi<GetUserActivitiesResponse>(
        HttpMethod.GET,
        true,
        "getUserActivities",
        { url: ApiEndpoints.GET_USER_ACTIVITIES }
    ) as UseQueryResult<GetUserActivitiesResponse, Error>;
};

// Add a new singing activity
const useAddSinging = () => {
    return useApi<SingingResponse, SingingRequest>(
        HttpMethod.POST,
        true,
        "addSinging",
        { url: ApiEndpoints.ADD_SINGING }
    ) as UseMutationResult<SingingResponse, Error, SingingRequest, unknown>;
};

const Dashboard = () => {
    const navigate = useNavigate();

    // Fetching all events
    const query = useApi<GetAllEventsResponse>(
        HttpMethod.GET,
        true,
        "getAllEvents",
        { url: ApiEndpoints.GET_ALL_EVENTS }
    ) as UseQueryResult<GetAllEventsResponse, Error>;

    // Fetching the user's activities (joined and added)
    const userActivitiesQuery = useUserActivities();

    // Hook to add a new singing activity
    const addSingingMutation = useAddSinging();

    // State for the new song form
    const [songForm, setSongForm] = useState<SingingRequest>({
        event: "Singing",
        songDetails: "",
        topic: null,
        needKaroke: false,
    });

    // Handle loading state
    if (query.isLoading || userActivitiesQuery.isLoading) {
        return <p className="text-center text-gray-500">Loading events...</p>;
    }

    // Handle error state
    if (query.isError || userActivitiesQuery.isError) {
        console.log("Query Error:", query.error);
        console.log("UserActivities Error:", userActivitiesQuery.error);
        toast.error("Failed to load events or activities.");
        return <p className="text-center text-red-500">Error fetching data.</p>;
    }

    // Navigate to the event details page
    const handleSeeMore = (eventId: string) => {
        navigate(`/events/${eventId}`);
    };

    // Handle form input changes
    const handleSongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSongForm((prev) => ({
            ...prev,
            [name]: value === "" && name === "topic" ? null : value,
        }));
    };

    // Handle checkbox change for needKaroke
    const handleKaraokeChange = (checked: boolean) => {
        setSongForm((prev) => ({
            ...prev,
            needKaroke: checked,
        }));
    };

    // Handle form submission to add a new song
    const handleAddSong = (e: React.FormEvent) => {
        e.preventDefault();
        addSingingMutation.mutate(songForm, {
            onSuccess: (data) => {
                toast.success(`Song "${data.songDetails}" added successfully!`);
                setSongForm({ event: "Singing", songDetails: "", topic: null, needKaroke: false });
                userActivitiesQuery.refetch(); // Refetch to update addedActivities
            },
            onError: (error: any) => {
                if (error.response?.status === 401) {
                    toast.error("Unauthorized. Please log in again.");
                } else {
                    toast.error(error.response?.data?.message || "Failed to add song.");
                }
            },
        });
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
            {/* Upcoming Events */}
            <h1 className="text-2xl font-bold text-center mb-6">Upcoming Events</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {query.data?.map((event) => (
                    <Card
                        key={event.id}
                        className="w-full h-auto shadow-lg transition-all transform hover:scale-105 hover:shadow-xl hover:h-[calc(100%+20px)] overflow-hidden"
                    >
                        <CardContent className="p-4 flex flex-col h-full">
                            <CardTitle>{event.eventName}</CardTitle>
                            <CardDescription className="text-sm text-gray-600 flex-grow">{event.about}</CardDescription>
                            <Button className="mt-4 w-full" onClick={() => handleSeeMore(event.id)}>
                                See More
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Your Participated Events */}
            <h2 className="text-xl font-bold text-center mt-12 mb-6">Your Participated Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.isArray(userActivitiesQuery.data?.joinedActivities) &&
                userActivitiesQuery.data.joinedActivities.length > 0 ? (
                    userActivitiesQuery.data.joinedActivities.map((activity) => (
                        <Card key={activity.id} className="w-full h-auto shadow-lg">
                            <CardContent className="p-4 flex flex-col h-full">
                                <CardTitle>{activity.event.eventName}</CardTitle>
                                <CardDescription className="text-sm text-gray-600 flex-grow">
                                    {activity.event.about}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No participated events found.</p>
                )}
            </div>

            {/* Add a New Song */}
            <h2 className="text-xl font-bold text-center mt-12 mb-6">Add a New Song</h2>
            <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
                <form onSubmit={handleAddSong} className="space-y-4">
                    <Input
                        placeholder="Song Details (e.g., Song Name)"
                        name="songDetails"
                        value={songForm.songDetails}
                        onChange={handleSongChange}
                        required
                    />
                    <Input
                        placeholder="Topic (optional)"
                        name="topic"
                        value={songForm.topic || ""}
                        onChange={handleSongChange}
                    />
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="needKaroke"
                            checked={songForm.needKaroke}
                            onCheckedChange={handleKaraokeChange}
                        />
                        <label htmlFor="needKaroke" className="text-sm text-gray-700">
                            Need Karaoke?
                        </label>
                    </div>
                    <Button type="submit" disabled={addSingingMutation.isPending}>
                        {addSingingMutation.isPending ? "Adding Song..." : "Add Song"}
                    </Button>
                </form>
            </div>

            {/* Your Songs */}
            <h2 className="text-xl font-bold text-center mt-12 mb-6">Your Songs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.isArray(userActivitiesQuery.data?.addedActivities) &&
                userActivitiesQuery.data.addedActivities.length > 0 ? (
                    userActivitiesQuery.data.addedActivities.map((song) => (
                        <Card key={song.id} className="w-full h-auto shadow-lg">
                            <CardContent className="p-4 flex flex-col h-full">
                                <CardTitle>{song.songDetails}</CardTitle>
                                <CardDescription className="text-sm text-gray-600 flex-grow">
                                    {song.topic ? `Topic: ${song.topic}` : "No topic"} <br />
                                    Karaoke: {song.needKaroke ? "Yes" : "No"}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No songs added yet.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
