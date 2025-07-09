import React from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const token = Cookies.get("accessToken");

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
