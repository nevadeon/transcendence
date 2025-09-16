import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { AuthContextType, AuthProviderProps } from "../../interfaces/Auth";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
	const [token, setToken] = useState<string | null>(null);
	// const navigate = useNavigate();

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		if (storedToken)
			setToken(storedToken);
	}, []);

	function login(newToken: string) {
		localStorage.setItem('token', newToken);
		setToken(newToken);
	}

	function logout() {
		localStorage.removeItem('token');
		setToken(null);
		// navigate('/login');
	}

	const isAuth = !!token;

	return (
		<AuthContext.Provider value={{ token, login, logout, isAuth }}>
			{children}
		</AuthContext.Provider>
	);
}
