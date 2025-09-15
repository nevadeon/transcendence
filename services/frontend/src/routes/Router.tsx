import { createBrowserRouter } from "react-router"
import Register from "../pages/Register";
import Login from "../pages/Login";
import App from "../components/App";

const router = createBrowserRouter([
	{ path: "/", element: <App /> },
	{ path: "/register", element: <Register /> },
	{ path: "/login", element: <Login /> },
])

export default router;
