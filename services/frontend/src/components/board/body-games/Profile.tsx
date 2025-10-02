import Form from "../../auth/Form";
import Settings from "../../Settings.tsx";
import useBoard from "../../../hooks/useBoard";
import { useAuth } from "../../../contexts/auth/useAuth";
import type { ProfileProps } from "../../../interfaces/Profile";
import CrossSrc from "../../../assets/icons/cross.svg";
import "../../../styles/board/body-games/Profile.css";

export default function Profile(props: ProfileProps) {
	const { words } = props;
	const { openElement, toggleElement } = useBoard();
	const isOpen = openElement === 'profile';
	const { user } = useAuth();

	function handleClose() {
		toggleElement(null);
	}

	if (!isOpen)
		return null;

	return (
		<div className="profile">
			<div className="profile-header">
				<h2>{words.messages.profile.title}</h2>
				<button className="modal-close-button" onClick={handleClose}>
					<img src={CrossSrc} alt="Close Icon" />
				</button>
			</div>
			<div className="profile-data">
				<div className="profile-data-account">
					<img src={user.avatar} alt="Avatar Profile" className="profile-data-portrait" />
					<Form register={true} profile={true} />
				</div>
				<Settings inProfile={true} />
			</div>
		</div>
	);
}