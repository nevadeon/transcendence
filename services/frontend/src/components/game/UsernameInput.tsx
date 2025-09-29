import type { UsernameInputProps } from "../../interfaces/UsernameInput";
import "../../styles/tournament/UsernameInput.css";

export default function UsernameInput(props: UsernameInputProps) {
	const { data, onChange, words } = props;

	return (
		<div className="portal-gun-input">
			<div className="labels">
				<label htmlFor="name">{words.messages["portal-gun"].username}</label>
				<label htmlFor="name">{words.messages["portal-gun"].challengers}</label>
			</div>
			<input
				type="text"
				id="name"
				name="name"
				onChange={onChange}
				value={data.name}
				required
				autoComplete='off'
				pattern="^[a-zA-Z0-9]{3,24}$"
				title="Username must be 3-24 characters long and contain only letters and numbers."
			/>
		</div>
	);
}