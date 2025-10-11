import { Outlet, Navigate } from "react-router";
import { useAuth } from "../contexts/auth/useAuth";

export default function PrivateRoute() {
	const { isAuth, isLoading } = useAuth();
	// const isAuth = true;

	if (isLoading)
		return ;

	return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
