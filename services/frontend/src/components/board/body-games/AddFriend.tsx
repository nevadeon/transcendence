import { useState, useEffect } from "react";
import useBoard from "../../../hooks/useBoard";
import { useAuth } from "../../../contexts/auth/useAuth";
import CrossSrc from "../../../assets/icons/cross.svg";
import AddSrc from "../../../assets/icons/plus.svg";
import ValidSrc from "../../../assets/icons/valid.svg";
import SpeciesSrc from "../../../assets/icons/species.svg";
import PlanetSrc from "../../../assets/icons/planet.svg";
import DimensionSrc from "../../../assets/icons/dimension.svg";
import "../../../styles/board/sidebar-friendlist/AddFriend.css";
import "../../../styles/board/body-games/Profile.css";

export interface UsersProps {
	id: number,
	name: string,
	avatar: string,
	status: number,
	species: string,
	planet: string,
	dimension: string,
}

export default function AddFriend(props: any) {
	const [ allUsers, setAllUsers ] = useState<UsersProps[]>([]);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const { openElement, toggleElement } = useBoard();
	const [ isInviteSent, setIsInviteSend ] = useState<boolean>(false);
	const { token } = useAuth();
	const isOpen = openElement === 'addfriend';
	const { words } = props;

	useEffect(() => {
		if (!isOpen || !token)
			return ;
		async function allUsers() {
			setIsLoading(true);
			try {
				const res = await fetch(`http://localhost:3001/users`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				});
				const data = await res.json();
				console.log("data: ", data);
				if (res.ok) {
					setAllUsers(data);
				} else {
					console.error('Failed to retreive all users: ', data.message);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}
		if (isOpen)
			allUsers();
	}, [isOpen, token]);

	async function handleAddFriend(targetUserId: number) {
		if (!token)
			return ;
		setIsLoading(true);
		try {
			const res = await fetch('http://localhost:3001/friends/request', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ 
					targetUserId: targetUserId 
				})
			});
			if (res.ok) {
				setIsInviteSend(true);
				alert("Demande envoyée !");
			} else {
				const errorData = await res.json();
				alert(`Erreur: ${errorData.message}`);
			}
		} catch (err) {
			console.error("Erreur réseau:", err);
			alert("Impossible de contacter le serveur.");
		}
		finally {
			setIsLoading(false)
		}
	}

	function handleClose() {
		toggleElement(null);
	}

	if (!isOpen)
		return null;

	return (
		<div className="profile">
			<div className="profile-header">
				<h2>{words.messages.statistics.title}</h2>
				<button className="modal-close-button" onClick={handleClose}>
					<img src={CrossSrc} alt="Close Icon" />
				</button>
			</div>
			<div className="profile-addfriend">
				{ isLoading ? (
					<p>Searching for users...</p>
				) : (
					allUsers.length === 0
					? ( <p>No users found</p> )
					: (
						allUsers.map((user) => (
							<div key={user.name} className="contact-card">
								<div style={{ display: 'flex', width: '100%' }}>
									<img src={`/avatars/${user.avatar}`} alt="Avatar Icon" className="profile-card-avatar" />
									<div className="profile-card-data">
										<div className="profile-card-data-header">
											<span>{user.name}</span>
											<span className={(user.status === 1) ? "online" : "offline"}></span>
										</div>
										<div className="profile-card-data-extra">
											<div>
												<img src={SpeciesSrc} alt="Species Icon" />
												<span>{user.species}</span>
											</div>
											<div>
												<img src={PlanetSrc} alt="Planet Icon" />
												<span>{user.planet}</span>
											</div>
											<div>
												<img src={DimensionSrc} alt="Dimension Icon" />
												<span>{user.dimension}</span>
											</div>
										</div>
									</div>
								</div>
								{
									!isInviteSent ? (
										<img src={AddSrc} alt="Add Icon"
											style={{ width: "48px", height: "48px", marginLeft: '12px' }}
											onClick={() => handleAddFriend(user.id)}
										/>
									) : (
										<img src={ValidSrc} alt="Valid Icon"
											style={{ width: "48px", height: "48px", marginLeft: '12px', opacity: .75 }}
										/>
									)
								}
							</div>
						)) )
					)
				}
			</div>
		</div>
	);
}