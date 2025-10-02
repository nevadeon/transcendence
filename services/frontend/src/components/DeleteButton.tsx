// import { useNavigate } from "react-router";

export default function DeleteButton(props: any) {
	// const navigate = useNavigate();
	// const { id } = useUser();
	const { inProfile } = props;
	const styles = "auth-languages delete-btn sidebar left-side";

	async function handleClick() {
		// try {
		// 	const res = await fetch(`http://localhost:3001/users/${id}`, {
		// 		method: "DELETE",
		// 		headers: { 'Content-Type': 'application/json' },
		// 	});
		// 	if (res.ok) {
		// 		navigate('/register');
		// 	} else {
		// 		console.error("User's Account Deletion failed");
		// 	}
		// } catch (err) {
		// 	console.error("Delete btn : ", err);
		// }
		console.log("Deletion successful !");
	}

	return (
		<button
			onClick={handleClick}
			className={inProfile ? styles + " in-profile" : styles}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
					<rect width="256" height="256" fill="none"/>
					<line x1="216" y1="60" x2="40" y2="60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
					<line x1="104" y1="104" x2="104" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
					<line x1="152" y1="104" x2="152" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
					<path d="M200,60V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
					<path d="M168,60V36a16,16,0,0,0-16-16H104A16,16,0,0,0,88,36V60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
				</svg>
		</button>
	);
}