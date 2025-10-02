import { createContext, useState, useEffect } from "react";
import type { AuthContextType, AuthProviderProps } from "../../interfaces/Auth";
import type { UserDataProps } from "../../interfaces/UserData";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<UserDataProps | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');
		if (storedToken)
			setToken(storedToken);
		if (storedUser)
			setUser(JSON.parse(storedUser));
	}, []);

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
		setUser(null);
	}

	const isAuth = !!token;

	return (
		<AuthContext.Provider value={{ token, user, login, logout, isAuth }}>
			{children}
		</AuthContext.Provider>
	);
}
