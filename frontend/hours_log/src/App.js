import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/Landing_Page";
import Dashboard from "./components/Dashboard";
import SignUp from "./components/Sign_Up";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
