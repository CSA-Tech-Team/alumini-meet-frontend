import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFoodPreferenceCount, useGenderCount, useGradYearCount, useAllUsers } from "@/hooks/adminDashboard";
import DonutChart from "@/components/charts/DonutChart";
import GenericTable from "@/components/shared/GenericTable";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch data
  const foodPreferenceQuery = useFoodPreferenceCount();
  const genderQuery = useGenderCount();
  const gradYearQuery = useGradYearCount();
  const allUsersQuery = useAllUsers();

  const isLoading =
    foodPreferenceQuery.isLoading ||
    genderQuery.isLoading ||
    gradYearQuery.isLoading ||
    allUsersQuery.isLoading;

  const isError =
    foodPreferenceQuery.isError ||
    genderQuery.isError ||
    gradYearQuery.isError ||
    allUsersQuery.isError;

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

  const chartConfig = {
    label: { label: "Count" },
    chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
    safari: { label: "Safari", color: "hsl(var(--chart-2))" },
    firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
    edge: { label: "Edge", color: "hsl(var(--chart-4))" },
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
          <GenericTable data={allUsersData} columns={[
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
          ]} caption="List of all alumni." />
        </CardContent>
      </Card>

      {/* Food Preference Section */}
      <Card className="mb-8 shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Food Preference Count</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-8">
          <GenericTable data={foodData} columns={[{ field: "category", headerName: "Food" }, { field: "count", headerName: "Count" }]} />
          <DonutChart title="Food Preferences" description="Food preference distribution" chartData={foodData} chartConfig={chartConfig} />
        </CardContent>
      </Card>

      {/* Gender Distribution Section */}
      <Card className="mb-8 shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Gender Count</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-8">
          <GenericTable data={genderData} columns={[{ field: "category", headerName: "Gender" }, { field: "count", headerName: "Count" }]} />
          <DonutChart title="Gender Distribution" description="Gender distribution among alumni" chartData={genderData} chartConfig={chartConfig} />
        </CardContent>
      </Card>

      {/* Graduation Year Section */}
      <Card className="mb-8 shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Graduation Year Count</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-8">
          <GenericTable data={gradYearData} columns={[{ field: "category", headerName: "Graduation Year" }, { field: "count", headerName: "Count" }]} />
          <DonutChart title="Graduation Year Distribution" description="Graduation year distribution among alumni" chartData={gradYearData} chartConfig={chartConfig} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
