import AvatarSource from "../../../assets/avatars/rick.png";
import SpeciesSource from "../../../assets/icons/species.svg";
import PlanetSource from "../../../assets/icons/planet.svg";
import DimensionSource from "../../../assets/icons/dimension.svg";
import '../../../styles/board/sidebar-user/ProfileCard.css';

export default function ProfileCard() {
	// const { username, avatar, species, planet, dimension } = useUserData();

	function randomID(max: number) {
		return Math.floor(Math.random() * max);
	}
	return (
		<div className="profile-card">
			<img src={AvatarSource} alt="Profile Avatar" className="profile-card-avatar" />
			<div className="profile-card-data">
				<div className="profile-card-data-header">
					<span>pamallet</span>
					<span>N. {randomID(999)}</span>
				</div>
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
			</div>
		</div>
	);
}