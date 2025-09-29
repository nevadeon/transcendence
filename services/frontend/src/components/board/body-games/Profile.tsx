import Form from "../../auth/Form";
import type { ProfileProps } from "../../../interfaces/Profile";
import CrossSrc from "../../../assets/icons/cross.svg";
import useBoard from "../../../hooks/useBoard";
import "../../../styles/board/body-games/Profile.css";

export default function Profile(props: ProfileProps) {
	const { avatar, words } = props;
	const { openElement, toggleElement } = useBoard();
	const isOpen = openElement === 'profile';

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
				<img src={avatar} alt="Profile Portrait" className="profile-data-portrait" />
				<Form register={true} profile={true} />
			</div>
		</div>
	);
}