import { useState, useEffect, useRef } from "react";
import { PAD_SPEED, type PadControls, type PadPositions } from "../interfaces/Pads";

export default function usePadsMove(
	ctrlPlayer1: PadControls,
	ctrlPlayer2: PadControls | undefined,
	ctrlPlayer3: PadControls | undefined,
	ctrlPlayer4: PadControls | undefined,
): PadPositions {
	const [ pad1Pos, setPad1Pos ] = useState<number>(50);
	const [ pad2Pos, setPad2Pos ] = useState<number>(50);
	const keysPressed = useRef<{ [key: string]: boolean }>({});
	const animRef = useRef<number>(0);

	useEffect(() => {
		const handleKeyUp = (e: KeyboardEvent) => {
			keysPressed.current[e.key.toLowerCase()] = true;
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			keysPressed.current[e.key.toLowerCase()] = false;
		};
		window.addEventListener('keyup', handleKeyUp);
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('keydown', handleKeyDown);
		}
	}, []);

	useEffect(() => {
		const gameLoop = () => {
			setPad1Pos(prevPos => {
				let newPos = prevPos;
				if (keysPressed.current[ctrlPlayer1.upKey.toLowerCase()])
					newPos -= PAD_SPEED;
				if (keysPressed.current[ctrlPlayer1.downKey.toLowerCase()])
					newPos += PAD_SPEED;
				return Math.max(-150, Math.min(250, newPos));
			});
			setPad2Pos(prevPos => {
				let newPos = prevPos;
				if (ctrlPlayer2) {
					if (keysPressed.current[ctrlPlayer2.upKey.toLowerCase()])
						newPos += PAD_SPEED;
					if (keysPressed.current[ctrlPlayer2.downKey.toLowerCase()])
						newPos -= PAD_SPEED;
				}
				return Math.max(0, Math.min(100, newPos));
			});
			animRef.current = requestAnimationFrame(gameLoop);
		};
		animRef.current = requestAnimationFrame(gameLoop);
		return () => {
			cancelAnimationFrame(animRef.current!);
		};
	}, [ctrlPlayer1, ctrlPlayer2, ctrlPlayer3, ctrlPlayer4]);

	return { pad1Pos, pad2Pos };
}