import Form from "../../auth/Form";
import type { ProfileProps } from "../../../interfaces/Profile";
import "../../../styles/board/body-games/Profile.css";

export default function Profile(props: ProfileProps) {
	const { avatar, words } = props;

	return (
		<div className="profile">
			<h2>{words.messages.profile.title}</h2>
			<div className="profile-data">
				<img src={avatar} alt="Profile Portrait" className="profile-data-portrait" />
				<Form register={true} profile={true} />
			</div>
		</div>
	);
}