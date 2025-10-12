import ProfileCard from "./ProfileCard";
import StatsGraph from "./StatsGraph";
// import StatsButton from "./StatsButton";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../../../contexts/auth/useAuth";
import type { SidebarUserProps } from "../../../interfaces/SidebarUser";
import "../../../styles/board/sidebar-user/SidebarUser.css";

export default function SidebarUser(props: SidebarUserProps) {
	const { words } = props;
	const { user } = useAuth();
	return (
		<aside className="sidebar-user">
			<div className="sidebar-user-data">
				<ProfileCard id={user.id} avatar={user.avatar} username={user.name} species={user.species} planet={user.planet} dimension={user.dimension} ingame={false} isElim={false} words={words} />
				<StatsGraph />
				{/* <StatsButton words={words} /> */}
			</div>
			<LogoutButton words={words} />
		</aside>
	);
}
