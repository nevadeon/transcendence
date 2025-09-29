import useBoard from "../../../hooks/useBoard";
import SpeciesSource from "../../../assets/icons/species.svg";
import PlanetSource from "../../../assets/icons/planet.svg";
import DimensionSource from "../../../assets/icons/dimension.svg";
import type { ProfileCardProps } from "../../../interfaces/ProfileCard";
import '../../../styles/board/sidebar-user/ProfileCard.css';
// import useProfile from "../../../hooks/useBoard";
// import AvatarSource from "../../../assets/avatars/rick.png";

export default function ProfileCard( props: ProfileCardProps ) {
	const { avatar, username, ingame, isElim, words } = props;
	const { toggleElement } = useBoard();

	function randomID(max: number) {
		return Math.floor(Math.random() * max);
	}

	return (
		<div className={ingame ? "profile-card-ingame" : "profile-card"} onClick={() => toggleElement('profile')}>
			{
				isElim && <div className="eliminated">{words.messages.tournament.eliminated}</div>
			}
			<img src={avatar} alt="Profile Avatar" className={ingame ? "profile-card-avatar-ingame" : "profile-card-avatar"} />
			<div className="profile-card-data">
				<div className={ingame ? "profile-card-data-ingame" : "profile-card-data-header"}>
					<span>{username}</span>
					<span>N. {randomID(999)}</span>
				</div>
				{
					!ingame &&
					<div className="profile-card-data-extra">
						<div>
							<img src={SpeciesSource} alt="Species Icon" />
							<span>{words.messages.board["profile-card"].species}</span>
						</div>
						<div>
							<img src={PlanetSource} alt="Planet Icon" />
							<span>{words.messages.board["profile-card"].planet}</span>
						</div>
						<div>
							<img src={DimensionSource} alt="Dimension Icon" />
							<span>C-137</span>
						</div>
					</div>
				}
			</div>
		</div>
	);
}