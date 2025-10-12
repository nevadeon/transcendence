import type { FormEvent } from "react";
import { useAuth } from "../../contexts/auth/useAuth";
import { handleRandomAvatars } from "../../utils/handleRandAvatars";
import type { UsernameInputProps } from "../../interfaces/UsernameInput";
import "../../styles/tournament/UsernameInput.css";
import useTournament from "../../contexts/tournament/useTournament";

export default function UsernameInput(props: UsernameInputProps) {
	const { mode, users, onChange, onSubmit, words } = props;
	const { user } = useAuth();
	const { tournament } = useTournament();

    const numberOfPlayers = users.length;
	const userAvatar = user?.avatar;
    const avatars = handleRandomAvatars(userAvatar, numberOfPlayers, user);
	let currLabels: string[] | undefined;

	function handleSubmit(e: FormEvent): void {
        e.preventDefault();
        const trimmedUsernames = users.map((name) => name.trim());
		const allFieldsValid = trimmedUsernames.every((name) => name.length > 0);

		let challengers;
		if (tournament?.isTournament) {
			challengers = trimmedUsernames.map((name, index) => ({
				name: name,
				avatar: tournament.results?.challengers?.[index].avatar,
			}));
		} else {
			challengers = trimmedUsernames.map((name, index) => ({
				name: name,
				avatar: avatars[index],
			}));
		}

		if (allFieldsValid)
			onSubmit(challengers);
		else
			console.error("Veuillez remplir tous les champs utilisateur.");
    }

	const inputLabels = {
        '1vs1': [
			words.messages["portal-gun"].opponent
		],
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
		// if () tournament-local: [x4]
    };

	if (mode && inputLabels.hasOwnProperty(mode)) {
		currLabels = inputLabels[mode as keyof typeof inputLabels];
	} else {
		currLabels = undefined;
	}

	return (
		<form className="portal-gun-input" onSubmit={handleSubmit}>
			{users.map((name, index) => (
				<div key={index} className="container">
					<div className="labels">
						<label htmlFor={`name-${index}`}>{words.messages["portal-gun"].username}</label>
						<label htmlFor={`name-${index}`}>{currLabels?.[index]}</label>
					</div>
					<input
						type="text"
						id={`name-${index}`}
						name={`name-${index}`}
						onChange={(e) => onChange(e, index)}
						value={name}
						maxLength={12}
						required
						autoComplete='off'
						pattern="^[a-zA-Z0-9]{3,12}$"
						title="Username must be 3-24 characters long and contain only letters and numbers."
					/>
				</div>
			))}
			<button type="submit" style={{display: 'none'}}></button>
		</form>
	);
}
