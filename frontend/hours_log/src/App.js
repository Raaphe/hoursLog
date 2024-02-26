import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Dashboard from "./components/dashboard/Dashboard";
import SignUp from "./components/SignUp/SignUp";
import ShiftDetails from "./components/ShiftDetails/ShiftDetails";
import EmployeeEditor from "./components/views/EmployeeInfo";
import Invoices from "./components/Invoices/Invoices";
import InvoiceDetails from "./components/Invoices/InvoiceDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shift-editor" element={<ShiftDetails />} />
        <Route path="/employee-editor" element={<EmployeeEditor />} />
        <Route path="/invoices" element={< Invoices/>} />
        <Route path="/invoice" element={< InvoiceDetails />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
