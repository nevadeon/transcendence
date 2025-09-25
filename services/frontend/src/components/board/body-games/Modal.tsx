import type ModalProps from "../../../interfaces/Modal";
import CrossSrc from "../../../assets/icons/cross.svg";
import "../../../styles/board/body-games/Modal.css";

export default function Modal({ children, onClose }: ModalProps) {
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<button className="modal-close-button" onClick={onClose}>
					<img src={CrossSrc} alt="" />
				</button>
				{children}
			</div>
		</div>
	);
}