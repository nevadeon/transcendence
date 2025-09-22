import ProfileCard from "./ProfileCard";
import StatsGraph from "./StatsGraph";
import StatsButton from "./StatsButton";
import LogoutButton from "./LogoutButton";
import "../styles/SidebarUser.css";

export default function SidebarUser() {
	return (
		<div className="sidebar-user">
			<div className="sidebar-user-data">
				<ProfileCard />
				<StatsGraph />
				<StatsButton />
			</div>
			<LogoutButton />
		</div>
	);
}