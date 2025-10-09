import type ContactsProps from "../../../interfaces/Contacts";
// import PhoneSource from "../../../assets/icons/phone.svg";
import "../../../styles/board/sidebar-friendlist/Contacts.css";

export default function Contacts(props: ContactsProps) {
	const { iconUrl, name, isOnline, words } = props;

	return (
		<div className="contacts">
			<img src={iconUrl} alt="Avatar Icon" />
			<div className="contacts-data">
				<div className="contacts-data-inner">
					<div className="contacts-data-header">
						<span>{name}</span>
						<span className={isOnline ? "online" : "offline"}></span>
					</div>
					<div className="contacts-data-extra">
						{/* <img src="Inner/Outer Call" alt="Call Icon" /> */}
						<span>{words.messages.board["friend-list"].infos}</span>
					</div>
				</div>
			</div>
		</div>
	);
}