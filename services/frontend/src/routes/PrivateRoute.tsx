import { Outlet, Navigate } from "react-router";
import { useAuth } from "../contexts/auth/useAuth";

export default function PrivateRoute() {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
