import Contacts from "./Contacts.tsx";
import AddContact from "./AddContact.tsx";
import type { FriendListProps } from "../../../interfaces/FriendList.ts";
import MortySource from "../../../../public/avatars/defaults/morty.png";
import PoopySource from "../../../../public/avatars/defaults/poopy.png";
import "../../../styles/board/sidebar-friendlist/FriendList.css";

export default function FriendList(props: FriendListProps) {
	const { words } = props;

	// useEffect() SELECT friendlist FROM users WHERE ID=id -> res [ {name: user.name, status: user.status}, {...} ]

	return (
		<div className="friendlist">
			<div className="friendlist-header">
				{words.messages.board["friend-list"].title}
			</div>
			<Contacts iconUrl={MortySource} name={"Morty"} isOnline={true} words={words} />
			<Contacts iconUrl={PoopySource} name={"MrPoopy..."} isOnline={false} words={words} />
			<AddContact />
		</div>
	);
}