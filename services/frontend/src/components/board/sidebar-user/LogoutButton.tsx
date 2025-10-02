import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/auth/useAuth";
import type { LogoutButtonProps } from "../../../interfaces/LogoutButton";
import "../../../styles/board/sidebar-user/LogoutButton.css";

export default function LogoutButton(props: LogoutButtonProps) {
	const { words } = props;
	const { logout } = useAuth();
	const navigate = useNavigate();

	function handleLogout() {
		logout();
		navigate('/login');
	}

	return (
		<button className="logout-btn" onClick={handleLogout}>
			{words.messages.board.logout}
		</button>
	);
}