import SidebarUser from "../components/board/sidebar-user/SidebarUser";
import BodyGames from "../components/board/body-games/BodyGames";
import SidebarFriendList from "../components/board/sidebar-friendlist/SidebarFriendList";
import "../styles/board/BoardPage.css";

export default function Board() {
	return (
		<div className="board-page">
			<SidebarUser />
			<BodyGames />
			<SidebarFriendList />
		</div>
	)
}
