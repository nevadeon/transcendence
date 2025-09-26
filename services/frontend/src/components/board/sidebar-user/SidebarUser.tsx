import ProfileCard from "./ProfileCard";
import StatsGraph from "./StatsGraph";
import StatsButton from "./StatsButton";
import LogoutButton from "./LogoutButton";
import AvatarSrc from "../../../assets/avatars/big-rick.png";
import "../../../styles/board/sidebar-user/SidebarUser.css";

export default function SidebarUser() {
	return (
		<aside className="sidebar-user">
			<div className="sidebar-user-data">
				<ProfileCard id={1} avatar={AvatarSrc} username="pamallet" ingame={false} isElim={false} />
				<StatsGraph />
				<StatsButton />
			</div>
			<LogoutButton />
		</aside>
	);
}