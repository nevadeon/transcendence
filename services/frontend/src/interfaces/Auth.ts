import type { ReactNode } from "react";

export interface AuthContextType {
    token: string | null;
    login: (newToken: string) => void;
    logout: () => void;
    isAuth: boolean;
}

export interface AuthProviderProps {
	children: ReactNode
}
