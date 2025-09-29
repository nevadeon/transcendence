import { useState, type ChangeEvent } from "react";
import type { FormEvent } from "react";
import type { UsernameInputProps } from "../../interfaces/UsernameInput";
import "../../styles/tournament/UsernameInput.css";

export default function UsernameInput(props: UsernameInputProps) {
	const [username, setUsername] = useState<string>("");
	const { mode, onSubmit } = props;
	const { words } = props;
	// UserContext();

	function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
		const { value } = e.target;
		setUsername(value);
	}

	function handleSubmit(e: FormEvent): void {
        e.preventDefault();
        if (username.trim()) {
            onSubmit([username]); 
        } else {
            console.error("Username is required.");
        }
    }

	return (
		<form className="portal-gun-input" onSubmit={handleSubmit}>
			<div className="labels">
				<label htmlFor="name">{words.messages["portal-gun"].username}</label>
				<label htmlFor="name">{words.messages["portal-gun"].challengers}</label>
			</div>
			<input
				type="text"
				id="name"
				name="name"
				onChange={handleInputChange}
				value={username}
				required
				autoComplete='off'
				pattern="^[a-zA-Z0-9]{3,24}$"
				title="Username must be 3-24 characters long and contain only letters and numbers."
			/>
		</form>
	);
}