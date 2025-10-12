import Contacts from "./Contacts.tsx";
import AddContact from "./AddContact.tsx";
import type { FriendListProps } from "../../../interfaces/FriendList.ts";
import "../../../styles/board/sidebar-friendlist/FriendList.css";
import { useEffect, useState } from 'react';
import { useAuth } from "../../../contexts/auth/useAuth.tsx";
import "../../../styles/board/sidebar-friendlist/FriendListMessage.css"
export interface UsersProps {
	id: number,
	name: string,
	avatar: string,
	status: number,
	species: string,
	planet: string,
	dimension: string,
}

export default function FriendList(props: FriendListProps) {
	const { words } = props;
	const [ UserFriends, setUserFriend ] = useState<UsersProps[]>([]);
	const { user, token } = useAuth();
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	useEffect(() => {
		if (!token)
			return ;
		async function UserFriends() {
			setIsLoading(true);
			try {
				const res = await fetch(`http://localhost:3001/users/friends/:${user.id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				});
				const data = await res.json();
				if (res.ok) {
					setUserFriend(data as UsersProps[]);
				} else {
					console.error('Failed to retreive all users: ', data.message);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}

		}
		UserFriends();
	}, [token]);

	return (
		<div className="friendlist">
			<div className="friendlist-header">
				{words.messages.board["friend-list"].title}
			</div>
				<div>{ isLoading ? (
						<p className="friend-list-message" >{words.messages.board["friend-list"].searchingForFriends}</p>
					) : (
						UserFriends.length === 0 ? (
						<p className="friend-list-message">{words.messages.board["friend-list"].withoutFriendMessage}</p> )
						: (
							UserFriends.map((user) =>  (
								<Contacts 
									id={user.id} 
									name={user.name} 
									species={user.species} 
									planet={user.planet} 
									dimension={user.dimension} 
									avatar={user.avatar} 
									status={user.status}
								/>
							 )))
						)
					}
				</div>
			<AddContact />
		</div>
	);
}