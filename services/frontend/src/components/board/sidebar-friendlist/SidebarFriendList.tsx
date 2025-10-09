import FriendList from "./FriendList.tsx";
import type { SidebarFriendListProps } from "../../../interfaces/SidebarFriendList.ts";
import "../../../styles/board/sidebar-friendlist/SidebarFriendList.css";

export default function SidebarFriendList(props: SidebarFriendListProps) {
	const { words } = props;

	return (
		<aside className="sidebar-friendlist">
			<FriendList words={words} />
		</aside>
	);
}