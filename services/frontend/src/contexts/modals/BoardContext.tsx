import { createContext, useState } from "react";
import type { OpenableElement, BoardContextType, BoardProviderProps } from "../../interfaces/Board";

export const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: BoardProviderProps) {
	const [openElement, setOpenElement] = useState<OpenableElement>(null);

    const toggleElement = (element: OpenableElement) => {
        setOpenElement(prev => {
            if (prev === element)
                return null;
            return element;
        });
    };

	return (
		<BoardContext.Provider value={{ openElement, toggleElement }}>
			{children}
		</BoardContext.Provider>
  );
}
