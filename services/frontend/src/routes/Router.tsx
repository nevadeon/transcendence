import { createBrowserRouter } from "react-router";
import PrivateRoute from "../components/PrivateRoute";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import App from "../components/App";

const router = createBrowserRouter([
	{ path: "/", element: <App /> },
	{ path: "/register", element: <Register /> },
	{ path: "/login", element: <Login /> },
	{ element: <PrivateRoute />,
		children: [
			{ path: "/home", element: <Home /> },
		]
	},
])

export default router;
