import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Rooms from "./pages/Rooms.jsx";
import Beds from "./pages/Beds.jsx";
import Attendance from "./pages/Attendance.jsx";
import Payments from "./pages/Payments.jsx";
import Vacancy from "./pages/Vacancy.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/beds" element={<Beds />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/vacancy" element={<Vacancy />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}
