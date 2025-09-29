import type ModalProps from "../../../interfaces/Modal";
import "../../../styles/board/body-games/Modal.css";

export default function Modal({ children }: ModalProps) {
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				{children}
			</div>
		</div>
	);
}