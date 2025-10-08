// import { useState, useEffect, type ChangeEvent } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../contexts/auth/useAuth";
import type { UsernameInputProps } from "../../interfaces/UsernameInput";
import "../../styles/tournament/UsernameInput.css";

const avatarPaths = [
	'defaults/rick.png',
	'defaults/morty.png',
	'defaults/rockRick.png',
	'defaults/spaceBess.png',
	'defaults/spaceMorty.png',
	'defaults/summer.png',
]

export default function UsernameInput(props: UsernameInputProps) {
	const { mode, users, onChange, onSubmit, words } = props;
	const { user } = useAuth();
	let currLabels: string[] | undefined;

	function shuffleArray<T>(array: T[]): T[] {
		const newArray = [...array];
		for (let i = newArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
		}
		return newArray;
	}

	function handleRandomAvatars( userAvatarPath: string | undefined, numberOfPlayers: number ): string[] {
		let finalAvatars: string[] = [];

		const playerOneAvatar = userAvatarPath ? userAvatarPath
			: avatarPaths[Math.floor(Math.random() * avatarPaths.length)];

		if (!user)
			finalAvatars.push(playerOneAvatar);

		let availableDefaults = avatarPaths.filter( (path) => path !== playerOneAvatar );
		const shuffledAvatars = shuffleArray(availableDefaults);
		let remainingSlots;
		if (!user)
			remainingSlots = numberOfPlayers - 1;
		else
			remainingSlots = numberOfPlayers;
		for (let i = 0; i < remainingSlots; i++) {
			// Utilise l'opérateur modulo pour boucler si nécessaire (ex: tournoi à 4 joueurs
			// alors qu'il ne reste que 3 avatars par défaut disponibles)
			const avatarPath = shuffledAvatars[i % shuffledAvatars.length];
			finalAvatars.push(avatarPath);
		}
		return finalAvatars;
	}

	const userAvatar = user?.avatar.slice(9);
    const numberOfPlayers = users.length;
    const avatars = handleRandomAvatars(userAvatar, numberOfPlayers);

	function handleSubmit(e: FormEvent): void {
        e.preventDefault();
        const trimmedUsernames = users.map((name) => name.trim());
		const allFieldsValid = trimmedUsernames.every((name) => name.length > 0);

		if (allFieldsValid)
			onSubmit(trimmedUsernames, avatars);
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
		//tournament-local: [x4]
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