import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { localStorageService } from "@/services/localStorage.service";

const RootRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorageService.getItem<string>("access_token");
    if (accessToken) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  return null;
};

export default RootRedirect;