import { Outlet, Navigate } from "react-router";

export default function PrivateRoute() {
  const isAuthenticated = false; // fake check

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
