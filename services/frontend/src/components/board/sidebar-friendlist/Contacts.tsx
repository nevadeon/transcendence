// import PhoneSource from "../../../assets/icons/phone.svg";
import "../../../styles/board/sidebar-friendlist/Contacts.css";
import type { UsersProps } from "./FriendList";
import crossSrc from "../../../assets/icons/cross.svg"
import { useAuth } from "../../../contexts/auth/useAuth";

export default function Contacts(props: UsersProps) {
	const { id, name, avatar, status } = props;
	const { token } = useAuth();

	async function deleteFriend() {
		try {
			const res = await fetch(`http://localhost:3001/users/friends/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res) {
				console.error("Friend Account Deletion failed");
			}
		} catch (err) {
			console.error("Delete btn : ", err);
		}
		console.log("Deletion succeed !");
	}

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
			<button onClick={deleteFriend} className="delete-friend-btn">
				<img src={crossSrc} alt="Cross image"></img>
			</button>
		</div>
	);
}