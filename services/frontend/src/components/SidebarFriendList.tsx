import FriendList from "./FriendList.tsx";
import "../styles/SidebarFriendList.css";

export default function SidebarFriendList() {
	return (
		<div className="sidebar-user">
			<div className="sidebar-user-friendlist">
				<FriendList />
			</div>
			{/* <Something /> */}
		</div>
	);
}