import type { LogoutButtonProps } from "../../../interfaces/LogoutButton";
import "../../../styles/board/sidebar-user/LogoutButton.css";

export default function LogoutButton(props: LogoutButtonProps) {
	const { words } = props;

	return (
		<button className="logout-btn">
			{words.messages.board.logout}
		</button>
	);
}