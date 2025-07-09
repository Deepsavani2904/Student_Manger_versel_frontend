import React from "react";
import { Navigate, Outlet } from "react-router";
import Cookies from "js-cookie";

const PublicRoute = () => {
  const token = Cookies.get("accessToken");
  let role = Cookies.get("userRole");

  const defaultRoutes = {
    Admin: "/dashboard",
    Student: "/studentDashboard",
  };

  return token ? <Navigate to={defaultRoutes[role]} /> : <Outlet />;
};

export default PublicRoute;
