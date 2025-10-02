import SidebarUser from "../components/board/sidebar-user/SidebarUser";
import BodyGames from "../components/board/body-games/BodyGames";
import SidebarFriendList from "../components/board/sidebar-friendlist/SidebarFriendList";
import useLanguage from "../hooks/useLanguage";
import "../styles/board/BoardPage.css";
import { useAuth } from "../contexts/auth/useAuth";

export default function Board() {
	const { user } = useAuth();
	const words = useLanguage();

	console.log(user);
	return (
		<div className="board-page">
			<SidebarUser words={words} />
			<BodyGames words={words} />
			<SidebarFriendList words={words} />
		</div>
	)
}
