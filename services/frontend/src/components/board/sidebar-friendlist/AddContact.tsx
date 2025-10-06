import useBoard from "../../../hooks/useBoard";
import PlusSource from "../../../assets/icons/plus.svg";
import "../../../styles/board/sidebar-friendlist/AddContact.css";

export default function AddContact() {
	const { toggleElement } = useBoard();

	return (
		<div className="add-contact" onClick={() => toggleElement('addfriend')}>
			<img src={PlusSource} alt="Add Icon" />
		</div>
	);
}