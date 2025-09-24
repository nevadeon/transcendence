// src/components/game/BackgroundLoader.tsx
import { useState, useEffect } from 'react';
import type GameBackgroundProps from '../../interfaces/GameBackground';

export default function GameBackground(props: GameBackgroundProps) {
	const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
	const { imgUrl, children } = props;

	useEffect(() => {
		if (imgUrl) {
            imgUrl()
                .then(image => setBackgroundImage(image.default))
                .catch(err => console.error("Failed to load background image:", err));
        }
	}, [imgUrl]);

	if (!backgroundImage) {
		return <div>Chargement du background...</div>;
	}

	return (
		<div className="game-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
			{children}
		</div>
	);
}
