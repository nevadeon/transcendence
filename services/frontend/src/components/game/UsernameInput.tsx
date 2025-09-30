import { useState, useEffect, type ChangeEvent } from "react";
import type { FormEvent } from "react";
import type { UsernameInputProps } from "../../interfaces/UsernameInput";
import "../../styles/tournament/UsernameInput.css";

export default function UsernameInput(props: UsernameInputProps) {
	const { mode, numUser, onSubmit, words } = props;
	const [ usernames, setUsernames ] = useState<string[]>(Array(numUser).fill(''));
	let currLabels: string[] | undefined;
	// UserContext();

	useEffect(() => {
        setUsernames(Array(numUser).fill(''));
    }, [numUser]);

	function handleInputChange(e: ChangeEvent<HTMLInputElement>, index: number): void {
		const { value } = e.target;
		setUsernames(prevNames => {
			const newNames = [... prevNames];
			newNames[index] = value;
			return newNames;
		});
		console.log(usernames);
	}

	function handleSubmit(e: FormEvent): void {
        e.preventDefault();
        const trimmedUsernames = usernames.map((name) => name.trim());
		const allFieldsValid = trimmedUsernames.every((name) => name.length > 0);
		if (allFieldsValid)
			onSubmit(trimmedUsernames);
		else
			console.error("Veuillez remplir tous les champs utilisateur.");
    }

	const inputLabels = {
        '1vs1': [words.messages["portal-gun"].opponent],
        '2vs2': [
            words.messages["portal-gun"].ally,
            words.messages["portal-gun"].opponent + " 1",
            words.messages["portal-gun"].opponent + " 2",
        ],
		'tournament': [
            words.messages["portal-gun"].opponent + " 1",
            words.messages["portal-gun"].opponent + " 2",
            words.messages["portal-gun"].opponent + " 3",
        ],
    };

	if (mode && inputLabels.hasOwnProperty(mode)) {
		currLabels = inputLabels[mode as keyof typeof inputLabels];
	} else {
		currLabels = undefined;
	}

	return (
		<form className="portal-gun-input" onSubmit={handleSubmit}>
			{usernames.map((name, index) => (
				<div key={index}>
					<div className="labels">
						<label htmlFor={`name-${index}`}>{words.messages["portal-gun"].username}</label>
						<label htmlFor={`name-${index}`}>{currLabels?.[index]}</label>
					</div>
					<input
						type="text"
						id={`name-${index}`}
						name={`name-${index}`}
						onChange={(e) => handleInputChange(e, index)}
						value={name}
						required
						autoComplete='off'
						pattern="^[a-zA-Z0-9]{3,24}$"
						title="Username must be 3-24 characters long and contain only letters and numbers."
					/>
				</div>
			))}
			<button type="submit" style={{display: 'none'}}></button>
		</form>
	);
}