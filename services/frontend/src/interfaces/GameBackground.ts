import type { ReactNode } from "react";

interface ImageModule {
  default: string;
}

export default interface GameBackgroundProps {
	imgUrl: () => Promise<ImageModule>;
	children: ReactNode;
}