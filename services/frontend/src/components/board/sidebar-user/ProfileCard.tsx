// import AvatarSource from "../../../assets/avatars/rick.png";
import SpeciesSource from "../../../assets/icons/species.svg";
import PlanetSource from "../../../assets/icons/planet.svg";
import DimensionSource from "../../../assets/icons/dimension.svg";
import type { ProfileCardProps } from "../../../interfaces/ProfileCard";
import '../../../styles/board/sidebar-user/ProfileCard.css';

export default function ProfileCard( props: ProfileCardProps ) {
	const { avatar, username, ingame, isElim } = props;

	function randomID(max: number) {
		return Math.floor(Math.random() * max);
	}

	return (
		<div className={ingame ? "profile-card-ingame" : "profile-card"}>
			{
				isElim && <div className="eliminated">ELIMINATED</div>
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
							<span>Human</span>
						</div>
						<div>
							<img src={PlanetSource} alt="Planet Icon" />
							<span>Earth</span>
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