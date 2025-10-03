import { createContext, useState, useEffect } from "react";
import type { AuthContextType, AuthProviderProps } from "../../interfaces/Auth";
import type { UserDataProps } from "../../interfaces/UserData";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initUser = {
	avatar: "",
	dimension: "",
	email: "",
	id: 0,
	name: "",
	planet: "",
	species: "",
};

function formatAvatarPath(avatar: string) {
	if (!avatar)
		return '/avatars/defaults/rick.png';
	return `/avatars/${avatar}`;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	const [ token, setToken ] = useState<string | null>(null);
	const [ user, setUser ] = useState<UserDataProps>(initUser);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');
		if (storedToken)
			setToken(storedToken);
		if (storedUser)
			setUser(JSON.parse(storedUser));
		setIsLoading(false);
	}, []);

	function updateUser(updatedFields: Partial<UserDataProps>) {
		if (updatedFields.avatar)
			updatedFields.avatar = formatAvatarPath(updatedFields.avatar);
		const newUser = { ...user, ...updatedFields };
		localStorage.setItem('user', JSON.stringify(newUser));
		setUser(newUser);
	}

	function login(newToken: string, userData: UserDataProps) {
		userData.avatar = formatAvatarPath(userData.avatar);
		localStorage.setItem('token', newToken);
		localStorage.setItem('user', JSON.stringify(userData));
		setToken(newToken);
		setUser(userData);
	}

	function logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setToken(null);
		setUser(initUser);
	}

	const isAuth = !!token;

	return (
		<AuthContext.Provider value={{ token, user, updateUser, login, logout, isAuth, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}
