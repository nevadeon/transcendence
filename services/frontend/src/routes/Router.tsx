import { createBrowserRouter } from "react-router";
import PrivateRoute from "./PrivateRoute";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Board from "../pages/Board";
import Game from "../pages/Game";
import App from "../components/App";

const router = createBrowserRouter([
	{ path: "/", element: <App /> },
	{ path: "/register", element: <Register /> },
	{ path: "/login", element: <Login /> },
	{ element: <PrivateRoute />,
		children: [
			{ path: "/board", element: <Board /> },
			{ path: "/game", element: <Game /> },
		]
	},
])

export default router;
