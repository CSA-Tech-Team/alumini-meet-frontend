import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFoodPreferenceCount, useGenderCount, useGradYearCount, useAllUsers } from "@/hooks/adminDashboard";
import DonutChart from "@/components/charts/DonutChart";
import GenericTable from "@/components/shared/GenericTable";
import { useQuery } from "@tanstack/react-query"; // Assuming react-query is used
import axios from "axios"; // Assuming axios for API calls
import { BACKEND_URL } from "@/constants/styles";

// Define interfaces for the new API responses
interface CourseCount {
  course: string;
  count: number;
}

interface UserProfile {
  name: string;
  phoneNumber: string;
  rollNumber: string;
  email: string;
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

// Fetch course count data
const fetchCourseCount = async (): Promise<CourseCount[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  const response = await axios.get(`${BACKEND_URL}/events/user/course`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch events data
const fetchEvents = async (): Promise<Event[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  const response = await axios.get(`${BACKEND_URL}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Existing queries
  const foodPreferenceQuery = useFoodPreferenceCount();
  const genderQuery = useGenderCount();
  const gradYearQuery = useGradYearCount();
  const allUsersQuery = useAllUsers();

  // New queries for course count and events
  const courseCountQuery = useQuery({
    queryKey: ["courseCount"],
    queryFn: fetchCourseCount,
  });

  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  // Consolidated loading and error states
  const isLoading =
    foodPreferenceQuery.isLoading ||
    genderQuery.isLoading ||
    gradYearQuery.isLoading ||
    allUsersQuery.isLoading ||
    courseCountQuery.isLoading ||
    eventsQuery.isLoading;

  const isError =
    foodPreferenceQuery.isError ||
    genderQuery.isError ||
    gradYearQuery.isError ||
    allUsersQuery.isError ||
    courseCountQuery.isError ||
    eventsQuery.isError;

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading admin data...</p>;
  }

  if (isError) {
    toast.error("Unauthorized or failed to load data. Please sign in again.");
    navigate("/signin");
    return null;
  }

  // Prepare Data for Tables and Charts
  const foodData = [
    { category: "Vegetarian", count: foodPreferenceQuery.data?.vegFoodCount ?? 0, fill: "var(--color-chrome)" },
    { category: "Non-Vegetarian", count: foodPreferenceQuery.data?.nonvegFoodCount ?? 0, fill: "var(--color-safari)" },
  ];

  const genderData = [
    { category: "Male", count: genderQuery.data?.maleCount ?? 0, fill: "var(--color-chrome)" },
    { category: "Female", count: genderQuery.data?.femaleCount ?? 0, fill: "var(--color-safari)" },
    { category: "Prefer Not to Say", count: genderQuery.data?.prefNotCount ?? 0, fill: "var(--color-firefox)" },
  ];

  const gradYearData = gradYearQuery.data?.gradYearCount.map(item => ({
    category: String(item.graduationYear ?? "Not Specified"),
    count: item._count.graduationYear,
    fill: "var(--color-edge)",
  })) ?? [];

  const courseData = courseCountQuery.data?.map(item => ({
    category: item.course,
    count: item.count,
    fill: "var(--color-opera)", // New color for course chart
  })) ?? [];

  const allUsersData = allUsersQuery.data?.map(user => ({
    name: user.profile.name,
    email: user.email,
    role: user.role,
    graduationYear: user.profile.graduationYear,
    gender: user.profile.gender,
    rollNumber: user.profile.rollNumber,
    phoneNumber: user.profile.phoneNumber,
    designation: user.profile.designation,
    address: user.profile.address,
    course: user.profile.course,
    foodPreference: user.foodPreference,
  })) ?? [];

  const eventsData = eventsQuery.data?.map(event => ({
    eventName: event.eventName,
    about: event.about,
    createdAt: new Date(event.createdAt).toLocaleDateString(),
    participants: event.userActivities.map(activity => activity.user.profile.name).join(", ") || "None",
  })) ?? [];

  const chartConfig = {
    label: { label: "Count" },
    chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
    safari: { label: "Safari", color: "hsl(var(--chart-2))" },
    firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
    edge: { label: "Edge", color: "hsl(var(--chart-4))" },
    opera: { label: "Opera", color: "hsl(var(--chart-5))" }, // Added for course chart
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Admin Dashboard</h1>

      {/* All Alumni Table */}
      <Card className="mb-8 shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">All Alumni</CardTitle>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={allUsersData}
            columns={[
              { field: "name", headerName: "Name" },
              { field: "email", headerName: "Email" },
              { field: "role", headerName: "Role" },
              { field: "graduationYear", headerName: "Graduation Year" },
              { field: "gender", headerName: "Gender" },
              { field: "rollNumber", headerName: "Roll Number" },
              { field: "phoneNumber", headerName: "Phone Number" },
              { field: "designation", headerName: "Designation" },
              { field: "address", headerName: "Address" },
              { field: "course", headerName: "Course" },
              { field: "foodPreference", headerName: "Food Preference" },
            ]}
            caption="List of all alumni."
          />
        </CardContent>
      </Card>

      {/* Course Distribution Section */}
      <Card className="mb-8 shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Course Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-8">
          <GenericTable
            data={courseData}
            columns={[{ field: "category", headerName: "Course" }, { field: "count", headerName: "Count" }]}
            caption="Distribution of courses among users."
          />
          <DonutChart
            title="Course Distribution"
            description="Course distribution among alumni"
            chartData={courseData}
            chartConfig={chartConfig}
          />
        </CardContent>
      </Card>

      {/* Events Section */}
      <Card className="mb-8 shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Events</CardTitle>
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

      {/* Food Preference Section */}
      <Card className="mb-8 shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Food Preference Count</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-8">
          <GenericTable
            data={foodData}
            columns={[{ field: "category", headerName: "Food" }, { field: "count", headerName: "Count" }]}
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
      <Card className="mb-8 shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Gender Count</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-8">
          <GenericTable
            data={genderData}
            columns={[{ field: "category", headerName: "Gender" }, { field: "count", headerName: "Count" }]}
          />
          <DonutChart
            title="Gender Distribution"
            description="Gender distribution among alumni"
            chartData={genderData}
            chartConfig={chartConfig}
          />
        </CardContent>
      </Card>

      {/* Graduation Year Section */}
      <Card className="mb-8 shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Graduation Year Count</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-8">
          <GenericTable
            data={gradYearData}
            columns={[{ field: "category", headerName: "Graduation Year" }, { field: "count", headerName: "Count" }]}
          />
          <DonutChart
            title="Graduation Year Distribution"
            description="Graduation year distribution among alumni"
            chartData={gradYearData}
            chartConfig={chartConfig}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;