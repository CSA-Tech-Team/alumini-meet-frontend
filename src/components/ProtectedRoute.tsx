import { Navigate, Outlet } from "react-router-dom";
import { localStorageService } from "@/services/localStorage.service";

const ProtectedRoute = () => {
  const accessToken = localStorageService.getItem<string>("access_token");
  return accessToken ? <Outlet /> : <Navigate to="/home" replace />;
};

export default ProtectedRoute;