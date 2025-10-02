import type { ReactNode } from "react";
import type { UserDataProps } from "./UserData";

export interface AuthContextType {
    token: string | null;
    user: UserDataProps;
    login: (newToken: string, userData: UserDataProps) => void;
    logout: () => void;
    isAuth: boolean;
}

export interface AuthProviderProps {
	children: ReactNode
}
