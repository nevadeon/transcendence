import { createContext, useState, useEffect } from "react";
import type { AuthContextType, AuthProviderProps } from "../../interfaces/Auth";
import type { UserDataProps } from "../../interfaces/UserData";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<UserDataProps>({
		avatar: "",
		dimension: "",
		email: "",
		id: 0,
		name: "",
		planet: "",
		species: "",
	});

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');
		if (storedToken)
			setToken(storedToken);
		if (storedUser)
			setUser(JSON.parse(storedUser));
	}, []);

	function updateUser(updatedFields: Partial<UserDataProps>) {
		const newUser = { ...user, ...updatedFields };
		localStorage.setItem('user', JSON.stringify(newUser));
		setUser(newUser);
	}

	function login(newToken: string, userData: UserDataProps) {
		localStorage.setItem('token', newToken);
		localStorage.setItem('user', JSON.stringify(userData));
		setToken(newToken);
		setUser(userData);
	}

	function logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setToken(null);
		setUser({
			avatar: "",
			dimension: "",
			email: "",
			id: 0,
			name: "",
			planet: "",
			species: "",
		});
	}

	const isAuth = !!token;

	return (
		<AuthContext.Provider value={{ token, user, updateUser, login, logout, isAuth }}>
			{children}
		</AuthContext.Provider>
	);
}
