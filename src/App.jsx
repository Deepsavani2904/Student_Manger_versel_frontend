import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import Dashboard from "./dashboard/Dashboard";
import Login from "./pages/Login";
import { useEffect } from "react";
import Cookies from "js-cookie";
import StudentDashboard from "./dashboard/StudentDashboard";
import { useState } from "react";

const App = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
    setLoading(false);
  }, [role]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const adminRoutes = (
    <>
      <Route path="/dashboard" element={<Dashboard />} />
    </>
  );

  const studentRoutes = (
    <>
      <Route path="/studentDashboard" element={<StudentDashboard />} />
      <Route path="/" element={<StudentDashboard />} />
    </>
  );

  const roleBasedRoutes = {
    Admin: adminRoutes,
    Student: studentRoutes,
  };

  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setRole={setRole} />} />
          <Route path="/signup" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>{roleBasedRoutes[role]}</Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
