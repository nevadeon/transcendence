import Form from "../../auth/Form";
import type { ProfileProps } from "../../../interfaces/Profile";
import "../../../styles/board/body-games/Profile.css";

export default function Profile(props: ProfileProps) {
	const { portraitSrc } = props;

	return (
		<div className="profile">
			<h2>PROFILE</h2>
			<div className="profile-data">
				{/* shadow effect to rm on img */}
				<img src={portraitSrc} alt="Profile Portrait" />
				<Form register profile />
			</div>
		</div>
	);
}