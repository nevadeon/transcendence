import type ContactsProps from "../../../interfaces/Contacts";
import PhoneSource from "../../../assets/icons/phone.svg";
import "../../../styles/Contacts.css";

export default function Contacts(props: ContactsProps) {
	const { iconUrl, name, isOnline } = props;

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
						<span>Mobile . Sun 01:17</span>
					</div>
				</div>
				<img src={PhoneSource} alt="Phone Icon" />
			</div>
		</div>
	);
}