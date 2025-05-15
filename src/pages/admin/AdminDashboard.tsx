import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFoodPreferenceCount, useGenderCount, useGradYearCount, useAllUsers } from "@/hooks/adminDashboard";
import DonutChart from "@/components/charts/DonutChart";
import GenericTable from "@/components/shared/GenericTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/constants/styles"; // Updated import path
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useEffect } from "react";

// Define interfaces for API responses
interface CourseCount {
  course: string;
  count: number;
}

interface UserProfile {
  name: string;
  phoneNumber: string;
  rollNumber: string;
  email: string;
  graduationYear: number | null;
  gender: string | null;
  designation: string | null;
  address: string | null;
  course: string | null;
}

interface UserActivity {
  id: string;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  userId: string;
  user: {
    email: string;
    profile: UserProfile;
  };
}

interface Event {
  id: string;
  createdAt: string;
  updatedAt: string;
  eventName: string;
  about: string;
  userActivities: UserActivity[];
}

interface Song {
  id: string;
  createdAt: string;
  updatedAt: string;
  event: string;
  songDetails: string;
  topic: string | null;
  needKaraoke: boolean; // Corrected typo
  userId: string;
  user: {
    email: string;
    profile: UserProfile;
  };
}

interface SongTableData {
  songDetails: string;
  singer: string;
  email: string;
  rollNumber: string;
  phoneNumber: string;
  topic: string;
  needsKaraoke: string;
  addedOn: string;
}

// Fetch course count data
const fetchCourseCount = async (): Promise<CourseCount[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  try {
    const response = await axios.get(`${BACKEND_URL}/events/user/course`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch course count");
    }
    throw error;
  }
};

// Fetch events data
const fetchEvents = async (): Promise<Event[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  try {
    const response = await axios.get(`${BACKEND_URL}/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch events");
    }
    throw error;
  }
};

// Fetch songs data
const fetchSongs = async (): Promise<Song[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  try {
    const response = await axios.get(`${BACKEND_URL}/events/songs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch songs");
    }
    throw error;
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  // Check for token and redirect if missing
  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to access the dashboard.");
      navigate("/signin");
    }
  }, [navigate, token]);

  if (!token) return null;

  // Queries
  const foodPreferenceQuery = useFoodPreferenceCount();
  const genderQuery = useGenderCount();
  const gradYearQuery = useGradYearCount();
  const allUsersQuery = useAllUsers();

  const courseCountQuery = useQuery({
    queryKey: ["courseCount"],
    queryFn: fetchCourseCount,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
  });

  const songsQuery = useQuery({
    queryKey: ["songs"],
    queryFn: fetchSongs,
    staleTime: 5 * 60 * 1000,
  });

  // Consolidated loading and error states
  const isLoading =
    foodPreferenceQuery.isLoading ||
    genderQuery.isLoading ||
    gradYearQuery.isLoading ||
    allUsersQuery.isLoading ||
    courseCountQuery.isLoading ||
    eventsQuery.isLoading ||
    songsQuery.isLoading;

  const isError =
    foodPreferenceQuery.isError ||
    genderQuery.isError ||
    gradYearQuery.isError ||
    allUsersQuery.isError ||
    courseCountQuery.isError ||
    eventsQuery.isError ||
    songsQuery.isError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    toast.error("Unauthorized or failed to load data. Please sign in again.");
    navigate("/signin");
    return null;
  }

  // Prepare Data for Tables and Charts
  const foodData = [
    { category: "Vegetarian", count: foodPreferenceQuery.data?.vegFoodCount ?? 0, fill: "#4a90e2" },
    { category: "Non-Vegetarian", count: foodPreferenceQuery.data?.nonvegFoodCount ?? 0, fill: "#50c878" },
  ];

  const genderData = [
    { category: "Male", count: genderQuery.data?.maleCount ?? 0, fill: "#4a90e2" },
    { category: "Female", count: genderQuery.data?.femaleCount ?? 0, fill: "#50c878" },
    { category: "Prefer Not to Say", count: genderQuery.data?.prefNotCount ?? 0, fill: "#ff6b6b" },
  ];

  const gradYearData =
    gradYearQuery.data?.gradYearCount.map((item) => ({
      category: String(item.graduationYear ?? "Not Specified"),
      count: item._count.graduationYear,
      fill: "#9b59b6",
    })) ?? [];

  const courseData =
    courseCountQuery.data?.map((item) => ({
      category: item.course,
      count: item.count,
      fill: "#e74c3c",
    })) ?? [];

  const allUsersData =
    allUsersQuery.data?.map((user) => ({
      id: user.email, // Assuming email is unique; replace with userId if available
      name: user.profile.name ?? "N/A",
      email: user.email ?? "N/A",
      role: user.role ?? "N/A",
      graduationYear: user.profile.graduationYear ?? "N/A",
      gender: user.profile.gender ?? "N/A",
      rollNumber: user.profile.rollNumber ?? "N/A",
      phoneNumber: user.profile.phoneNumber ?? "N/A",
      designation: user.profile.designation ?? "N/A",
      address: user.profile.address ?? "N/A",
      course: user.profile.course ?? "N/A",
      foodPreference: user.foodPreference ?? "N/A",
    })) ?? [];

  const eventsData =
    eventsQuery.data?.map((event) => ({
      id: event.id,
      eventName: event.eventName ?? "N/A",
      about: event.about ?? "N/A",
      createdAt: event.createdAt ? new Date(event.createdAt).toLocaleDateString() : "N/A",
      participants: event.userActivities?.map((activity) => activity.user.profile.name ?? "Unknown").join(", ") || "None",
    })) ?? [];

  const songsData: SongTableData[] =
    songsQuery.data?.map((song) => ({
      id: song.id,
      songDetails: song.songDetails ?? "N/A",
      singer: song.user?.profile?.name ?? "Unknown",
      email: song.user?.email ?? "N/A",
      rollNumber: song.user?.profile?.rollNumber ?? "N/A",
      phoneNumber: song.user?.profile?.phoneNumber ?? "N/A",
      topic: song.topic ?? "No topic",
      needsKaraoke: song.needKaraoke ? "Yes" : "No",
      addedOn: song.createdAt ? format(new Date(song.createdAt), "PPP") : "N/A",
    })) ?? [];

  // Calculate karaoke statistics for chart
  const karaokeCount = songsQuery.data?.filter((song) => song.needKaraoke).length ?? 0;
  const nonKaraokeCount = (songsQuery.data?.length ?? 0) - karaokeCount;

  const karaokeData = [
    { category: "Needs Karaoke", count: karaokeCount, fill: "#4a90e2" },
    { category: "No Karaoke", count: nonKaraokeCount, fill: "#50c878" },
  ];

  const chartConfig = {
    label: { label: "Count" },
    chrome: { label: "Chrome", color: "#4a90e2" },
    safari: { label: "Safari", color: "#50c878" },
    firefox: { label: "Firefox", color: "#ff6b6b" },
    edge: { label: "Edge", color: "#9b59b6" },
    opera: { label: "Opera", color: "#e74c3c" },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Admin Dashboard</h1>
      <div className="max-w-7xl mx-auto">
        {/* Alumni Registrations */}
        <div className="mt-6">
          <div className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-t-md">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/012/574/694/small/people-linear-icon-squad-illustration-team-pictogram-group-logo-icon-illustration-vector.jpg"
              alt="Alumni Icon"
              className="w-6 h-6 mr-2"
            />
            <h2 className="text-lg font-semibold">Alumni Registrations</h2>
          </div>
          <div
            className={`w-full rounded-lg border border-gray-200 shadow-sm ${
              allUsersData.length > 25 ? "max-h-[500px] overflow-y-auto" : ""
            }`}
          >
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left">Name</th>
                  <th scope="col" className="px-4 py-2 text-left">Email</th>
                  <th scope="col" className="px-4 py-2 text-left">Course</th>
                  <th scope="col" className="px-4 py-2 text-left">Phone</th>
                  <th scope="col" className="px-4 py-2 text-left">Graduation Year</th>
                  <th scope="col" className="px-4 py-2 text-left">Roll No</th>
                  <th scope="col" className="px-4 py-2 text-left">Gender</th>
                  <th scope="col" className="px-4 py-2 text-left">Address</th>
                  <th scope="col" className="px-4 py-2 text-left">Designation</th>
                  <th scope="col" className="px-4 py-2 text-left">Food Preference</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {allUsersData.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.course}</td>
                    <td className="px-4 py-2">{user.phoneNumber}</td>
                    <td className="px-4 py-2">{user.graduationYear}</td>
                    <td className="px-4 py-2">{user.rollNumber}</td>
                    <td className="px-4 py-2">{user.gender}</td>
                    <td className="px-4 py-2">{user.address}</td>
                    <td className="px-4 py-2">{user.designation}</td>
                    <td className="px-4 py-2">{user.foodPreference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Songs Section */}
        <Card className="mb-8 shadow-lg border-gray-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700">
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 omena10l12-3"
                />
              </svg>
              Songs Registry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">All Registered Songs</h3>
                  <div className="overflow-x-auto">
                    <GenericTable
                      data={songsData}
                      columns={[
                        { field: "songDetails", headerName: "Song" },
                        { field: "singer", headerName: "Singer" },
                        { field: "rollNumber", headerName: "Roll Number" },
                        { field: "topic", headerName: "Topic" },
                        {
                          field: "needsKaraoke",
                          headerName: "Karaoke",
                          cellRenderer: (value: string) => (
                            <Badge
                              className={value === "Yes" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {value}
                            </Badge>
                          ),
                        },
                        { field: "addedOn", headerName: "Added On" },
                      ]}
                      caption="List of all songs registered for the event."
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-full">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Karaoke Requirements</h3>
                  <DonutChart
                    title="Karaoke Needs"
                    description="Distribution of karaoke requirements"
                    chartData={karaokeData}
                    chartConfig={chartConfig}
                  />
                  <div className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Total Songs</p>
                        <p className="text-2xl font-bold text-blue-700">{songsQuery.data?.length || 0}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Need Karaoke</p>
                        <p className="text-2xl font-bold text-green-700">{karaokeCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4portion4 mb-4">Detailed Song Information</h3>
              <div className="overflow-x-auto">
                <GenericTable
                  data={songsData}
                  columns={[
                    { field: "songDetails", headerName: "Song Details" },
                    { field: "singer", headerName: "Singer Name" },
                    { field: "email", headerName: "Email" },
                    { field: "phoneNumber", headerName: "Phone Number" },
                    { field: "rollNumber", headerName: "Roll Number" },
                    { field: "topic", headerName: "Topic" },
                    { field: "needsKaraoke", headerName: "Needs Karaoke" },
                    { field: "addedOn", headerName: "Added On" },
                  ]}
                  caption="Detailed information about all songs and singers."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Distribution Section */}
        <Card className="mb-8 shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-800">
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
              Course Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
            <div className="lg:w-1/2">
              <GenericTable
                data={courseData}
                columns={[
                  { field: "category", headerName: "Course" },
                  { field: "count", headerName: "Count" },
                ]}
                caption="Distribution of courses among users."
              />
            </div>
            <div className="lg:w-1/2">
              <DonutChart
                title="Course Distribution"
                description="Course distribution among alumni"
                chartData={courseData}
                chartConfig={chartConfig}
              />
            </div>
          </CardContent>
        </Card>

        {/* Events Section */}
        <Card className="mb-8 shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-700">
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GenericTable
              data={eventsData}
              columns={[
                { field: "eventName", headerName: "Event Name" },
                { field: "about", headerName: "Description" },
                { field: "createdAt", headerName: "Created At" },
                { field: "participants", headerName: "Participants" },
              ]}
              caption="List of all events and their participants."
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Food Preference Section */}
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="bg-gradient-to-r from-red-500 to-red-700">
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Food Preference
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <GenericTable
                data={foodData}
                columns={[
                  { field: "category", headerName: "Food" },
                  { field: "count", headerName: "Count" },
                ]}
              />
              <DonutChart
                title="Food Preferences"
                description="Food preference distribution"
                chartData={foodData}
                chartConfig={chartConfig}
              />
            </CardContent>
          </Card>

          {/* Gender Distribution Section */}
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-700">
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <GenericTable
                data={genderData}
                columns={[
                  { field: "category", headerName: "Gender" },
                  { field: "count", headerName: "Count" },
                ]}
              />
              <DonutChart
                title="Gender Distribution"
                description="Gender distribution among alumni"
                chartData={genderData}
                chartConfig={chartConfig}
              />
            </CardContent>
          </Card>
        </div>

        {/* Graduation Year Section */}
        <Card className="mt-8 shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-700">
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
              Graduation Year
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
            <div className="lg:w-1/2">
              <GenericTable
                data={gradYearData}
                columns={[
                  { field: "category", headerName: "Graduation Year" },
                  { field: "count", headerName: "Count" },
                ]}
              />
            </div>
            <div className="lg:w-1/2">
              <DonutChart
                title="Graduation Year Distribution"
                description="Graduation year distribution among alumni"
                chartData={gradYearData}
                chartConfig={chartConfig}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;