import { Routes, Route } from "react-router-dom";
import Health from "@/pages/Health";
import Signup from "./pages/Signup";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/health" element={<Health />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
