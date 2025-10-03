import type { ReactNode } from "react";
import type { UserDataProps } from "./UserData";

export interface AuthContextType {
    token: string | null;
    user: UserDataProps;
    updateUser: (updatedFields: Partial<UserDataProps>) => void;
    login: (newToken: string, userData: UserDataProps) => void;
    logout: () => void;
    isAuth: boolean;
    isLoading: boolean;
}

export interface AuthProviderProps {
	children: ReactNode
}
