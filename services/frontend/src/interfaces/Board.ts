import type { ReactNode } from "react";

export type OpenableElement = 'profile' | 'stats' | 'username' | null;

export interface BoardContextType {
    openElement: OpenableElement;
    toggleElement: (element: OpenableElement) => void; 
}

export interface BoardProviderProps {
	children: ReactNode
}