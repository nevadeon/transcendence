import type { UserDataProps } from "../interfaces/UserData";

const avatarPaths = [
	'avatars/defaults/rick.png',
	'avatars/defaults/morty.png',
	'avatars/defaults/rockRick.png',
	'avatars/defaults/spaceBess.png',
	'avatars/defaults/spaceMorty.png',
	'avatars/defaults/summer.png',
];

function shuffleArray<T>(array: T[]): T[] {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
}

export function handleRandomAvatars( userAvatarPath: string | undefined, numberOfPlayers: number, user: UserDataProps | null ): string[] {
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
		const avatarPath = shuffledAvatars[i % shuffledAvatars.length];
		finalAvatars.push(avatarPath);
	}
	return finalAvatars;
}
