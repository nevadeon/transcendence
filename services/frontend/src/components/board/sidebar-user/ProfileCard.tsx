import useBoard from "../../../hooks/useBoard";
import SpeciesSource from "../../../assets/icons/species.svg";
import PlanetSource from "../../../assets/icons/planet.svg";
import DimensionSource from "../../../assets/icons/dimension.svg";
import type { ProfileCardProps } from "../../../interfaces/ProfileCard";
import '../../../styles/board/sidebar-user/ProfileCard.css';

export default function ProfileCard( props: ProfileCardProps ) {
	const { avatar, username , species, planet, dimension, ingame, isElim, words } = props;
	const { toggleElement } = useBoard();

	return (
		<div className={ingame ? "profile-card-ingame" : "profile-card"} onClick={() => toggleElement('profile')}>
			{ingame && username === undefined && <div className="Hide"></div>}
			{username !== undefined && isElim && <div className="eliminated">{words.messages.tournament.eliminated}</div>}
				<img src={avatar ? avatar : "avatars/defaults/rick.png"} alt="Profile Avatar" className={ingame ? "profile-card-avatar-ingame" : "profile-card-avatar"} />
				<div className="profile-card-data">
					<div className={ingame ? "profile-card-data-ingame" : "profile-card-data-header"}>
						<span>{username}</span>
						<span>{dimension}</span>
					</div>
					{
						!ingame &&
						<div className="profile-card-data-extra">
							<div>
								<img src={SpeciesSource} alt="Species Icon" />
								<span>{species}</span>
							</div>
							<div>
								<img src={PlanetSource} alt="Planet Icon" />
								<span>{planet}</span>
							</div>
							<div>
								<img src={DimensionSource} alt="Dimension Icon" />
								<span>{dimension}</span>
							</div>
						</div>
					}
				</div>
		</div>
	);
}
