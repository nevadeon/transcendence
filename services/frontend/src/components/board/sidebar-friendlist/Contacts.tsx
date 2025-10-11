// import PhoneSource from "../../../assets/icons/phone.svg";
import "../../../styles/board/sidebar-friendlist/Contacts.css";
import type { UsersProps } from "./FriendList";

export default function Contacts(props: UsersProps) {
	const { name, avatar, status } = props;

	return (
		<div className="contacts">
			<img src={`/avatars/${avatar}`} alt="Avatar Icon" />
			<div className="contacts-data">
				<div className="contacts-data-inner">
					<div className="contacts-data-header">
						<span>{name}</span>
						<span className={status ? "online" : "offline"}></span>
					</div>
					<div className="contacts-data-extra">
						{/* <img src="Inner/Outer Call" alt="Call Icon" /> */}
					</div>
				</div>
			</div>
		</div>
	);
}