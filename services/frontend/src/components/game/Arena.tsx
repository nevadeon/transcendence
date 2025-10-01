import { useState, useEffect, useRef } from "react";
import ArenaSrc from "../../assets/game/arena.svg";
import PadLeftSrc from "../../assets/game/padleft.svg";
import PadRightSrc from "../../assets/game/padright.svg";
import BallSrc from "../../assets/game/balls/morty's_head_ball.png";

const ARENA_WIDTH = 1200;
const ARENA_HEIGHT = 751;
const PAD_WIDTH = 37;
const PAD_HEIGHT = 120;

export default function Arena(props: any) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [arenaImage, setArenaImage] = useState<HTMLImageElement | null>(null);
	const [ballImage, setBallImage] = useState<HTMLImageElement | null>(null);
	const [padLeftImage, setLeftPadImage] = useState<HTMLImageElement | null>(null);
	const [padRightImage, setPadRightImage] = useState<HTMLImageElement | null>(null);
	const { pad1Pos, pad2Pos, ballPos } = props;

    useEffect(() => {
        const imgA = new Image();
        imgA.src = ArenaSrc;
        imgA.onload = () => {
            setArenaImage(imgA);
        };

		const imgB = new Image();
		imgB.src = BallSrc;
		imgB.onload = () => {
			setBallImage(imgB);
		};

		const imgC = new Image();
		imgC.src = PadLeftSrc;
		imgC.onload = () => {
			setLeftPadImage(imgC);
		};
		const imgD = new Image();
		imgD.src = PadRightSrc;
		imgD.onload = () => {
			setPadRightImage(imgD);
		};

		return () => {
            imgA.onload = null;
            imgB.onload = null;
            imgC.onload = null;
        };
    }, [ArenaSrc, PadLeftSrc, PadRightSrc, BallSrc]);

	 useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !arenaImage || !ballImage || !padLeftImage || !padRightImage)
			return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
			return;
        canvas.width = ARENA_WIDTH;
        canvas.height = ARENA_HEIGHT;
        const renderGame = () => {
            ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
            ctx.drawImage(arenaImage, 0, 0, ARENA_WIDTH, ARENA_HEIGHT);

			// Center Y
            const pad1Y = (pad1Pos / 100) * ARENA_HEIGHT - (PAD_HEIGHT / 2); 
            const pad2Y = (pad2Pos / 100) * ARENA_HEIGHT - (PAD_HEIGHT / 2);
            // Dessin du Pad 1
            ctx.drawImage(padLeftImage, 64, pad1Y, PAD_WIDTH, PAD_HEIGHT);
            // Dessin du Pad 2
            ctx.drawImage(padRightImage, ARENA_WIDTH - 64 - PAD_WIDTH, pad2Y, PAD_WIDTH, PAD_HEIGHT);

            const ballSize = 48;
            ctx.drawImage(
                ballImage,
                ballPos.x - (ballSize / 2), // center X
                ballPos.y - (ballSize / 2), // center Y
                ballSize,
                ballSize
            );
        };
        // En mode jeu, vous appelleriez `renderGame` dans une loop `requestAnimationFrame`
        // only 1 render
        renderGame();
    }, [arenaImage, ballImage, padLeftImage, padRightImage, pad1Pos, pad2Pos, ballPos.x, ballPos.y]);

	return (
		<div className="pong-1vs1-arena">
			<canvas ref={canvasRef} className="pong-1vs1-canvas" />
		</div>
	);
}