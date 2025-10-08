import { useNavigate } from "react-router";
import FriendList from "./FriendList.tsx";
import type { SidebarFriendListProps } from "../../../interfaces/SidebarFriendList.ts";
import "../../../styles/board/sidebar-friendlist/SidebarFriendList.css";

export default function SidebarFriendList(props: SidebarFriendListProps) {
	const navigate = useNavigate();
	const { words } = props;

	return (
		<aside className="sidebar-friendlist">
			<FriendList words={words} />
			<button className="body-games-btn billiard" onClick={() => navigate('/game/billiard')}>
				Billiard Multidimensionnel
			</button>
		</aside>
	);
}