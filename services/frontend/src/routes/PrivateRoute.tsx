import { Outlet, Navigate } from "react-router";
import { useAuth } from "../contexts/auth/useAuth";

export default function PrivateRoute() {
  // const { isAuth } = useAuth();
  const isAuth = true;
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
