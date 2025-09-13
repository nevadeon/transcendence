import { createBrowserRouter } from "react-router"
import Register from "../components/Register";
import Login from "../components/Login";
import App from "../components/App";

const router = createBrowserRouter([
	{ path: "/", element: <App /> },
	{ path: "/register", element: <Register /> },
	{ path: "/login", element: <Login /> },
])

export default router;