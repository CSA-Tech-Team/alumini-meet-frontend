import { Routes, Route } from "react-router-dom";
import Health from "@/pages/Health";
import Signup from "./pages/Signup";
import { Toaster } from "sonner";
import VerifyOtp from "./pages/VerifyOtp";
import SignIn from "./pages/Signin";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/health" element={<Health />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="signin" element={<SignIn />} />
      </Routes>
    </>
  );
}

export default App;
