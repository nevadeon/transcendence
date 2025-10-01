import { useState, useEffect, useRef } from "react";
import { PAD_SPEED, type PadControls, type PadPositions } from "../interfaces/Pads";

const ARENA_WIDTH_CENTER = 600;
const ARENA_HEIGHT_CENTER = 375;

export default function usePadsMove(
	ctrlPlayer1: PadControls,
	ctrlPlayer2: PadControls | undefined,
	ctrlPlayer3: PadControls | undefined,
	ctrlPlayer4: PadControls | undefined,
): PadPositions {
	const [ pad1Pos, setPad1Pos ] = useState<number>(50);
	const [ pad2Pos, setPad2Pos ] = useState<number>(50);
	const [ pad3Pos, setPad3Pos ] = useState<number>(50);
	const [ pad4Pos, setPad4Pos ] = useState<number>(50);
	const [ ballPos, setBallPos ] = useState<any>({
		x: ARENA_WIDTH_CENTER,
		y: ARENA_HEIGHT_CENTER
	});
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

	// still need setBallPos()?
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
			setPad3Pos(prevPos => {
				let newPos = prevPos;
				if (ctrlPlayer3) {
					if (keysPressed.current[ctrlPlayer3.upKey.toLowerCase()])
						newPos += PAD_SPEED;
					if (keysPressed.current[ctrlPlayer3.downKey.toLowerCase()])
						newPos -= PAD_SPEED;
				}
				return Math.max(0, Math.min(100, newPos));
			});
			setPad4Pos(prevPos => {
				let newPos = prevPos;
				if (ctrlPlayer4) {
					if (keysPressed.current[ctrlPlayer4.upKey.toLowerCase()])
						newPos -= PAD_SPEED;
					if (keysPressed.current[ctrlPlayer4.downKey.toLowerCase()])
						newPos += PAD_SPEED;
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

	return { pad1Pos, pad2Pos, pad3Pos, pad4Pos, ballPos };
}