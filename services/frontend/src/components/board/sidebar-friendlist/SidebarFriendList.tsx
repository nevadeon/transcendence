import FriendList from "./FriendList.tsx";
import "../../../styles/board/sidebar-friendlist/SidebarFriendList.css";

export default function SidebarFriendList() {
	return (
		<aside className="sidebar-friendlist">
			<FriendList />
			{/* <Something /> */}
		</aside>
	);
}