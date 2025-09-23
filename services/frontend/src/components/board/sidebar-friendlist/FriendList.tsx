import Contacts from "./Contacts.tsx";
import AddContact from "./AddContact.tsx";
import MortySource from "../../../assets/avatars/morty.png";
import PoopySource from "../../../assets/avatars/poopy.png";
import "../../../styles/FriendList.css";

export default function FriendList() {
	// const { iconUrl, name, isOnline } = useFriends();
	// map N contacts

	return (
		<div className="friendlist">
			<div className="friendlist-header">
				Friend List
			</div>
			<Contacts iconUrl={MortySource} name={"Morty"} isOnline={true} />
			<Contacts iconUrl={PoopySource} name={"MrPoopy..."} isOnline={false} />
			<AddContact />
		</div>
	);
}