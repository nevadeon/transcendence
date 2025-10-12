// import { useState, useEffect, useRef } from "react";
// import ArenaSrc from "../../assets/game/arena.svg";
// import PadLeftSrc from "../../assets/game/padleft.svg";
// import PadRightSrc from "../../assets/game/padright.svg";
// import BallSrc from "../../assets/game/balls/morty's_head_ball.png";

import BabylonArena3D from "./Babylon3D.tsx";

const ARENA_WIDTH = 1200;
const ARENA_HEIGHT = 751;
// const PAD_WIDTH = 37;
// const PAD_HEIGHT = 120;

export default function Arena(props: any) {
	// const canvasRef = useRef<HTMLCanvasElement>(null);
	// const [arenaImage, setArenaImage] = useState<HTMLImageElement | null>(null);
	// const [ballImage, setBallImage] = useState<HTMLImageElement | null>(null);
	// const [padLeftImage, setLeftPadImage] = useState<HTMLImageElement | null>(null);
	// const [padRightImage, setPadRightImage] = useState<HTMLImageElement | null>(null);
	const { pad1Pos, pad2Pos, ballPos } = props;

    // useEffect(() => {
    //     const imgA = new Image();
    //     imgA.src = ArenaSrc;
    //     imgA.onload = () => {
    //         setArenaImage(imgA);
    //     };

	// 	const imgB = new Image();
	// 	imgB.src = BallSrc;
	// 	imgB.onload = () => {
	// 		setBallImage(imgB);
	// 	};

	// 	const imgC = new Image();
	// 	imgC.src = PadLeftSrc;
	// 	imgC.onload = () => {
	// 		setLeftPadImage(imgC);
	// 	};
	// 	const imgD = new Image();
	// 	imgD.src = PadRightSrc;
	// 	imgD.onload = () => {
	// 		setPadRightImage(imgD);
	// 	};

	// 	return () => {
    //         imgA.onload = null;
    //         imgB.onload = null;
    //         imgC.onload = null;
    //     };
    // }, [ArenaSrc, PadLeftSrc, PadRightSrc, BallSrc]);

	//  useEffect(() => {
    //     const canvas = canvasRef.current;
    //     if (!canvas || !arenaImage || !ballImage || !padLeftImage || !padRightImage)
	// 		return;
    //     const ctx = canvas.getContext('2d');
    //     if (!ctx)
	// 		return;
    //     canvas.width = ARENA_WIDTH;
    //     canvas.height = ARENA_HEIGHT;
    //     const renderGame = () => {
    //         ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
    //         ctx.drawImage(arenaImage, 0, 0, ARENA_WIDTH, ARENA_HEIGHT);

	// 		// Center Y
    //         const pad1Y = pad1Pos - (PAD_HEIGHT / 2);
    //         const pad2Y = pad2Pos - (PAD_HEIGHT / 2);
    //         // Dessin du Pad 1
    //         ctx.drawImage(padLeftImage, 64, pad1Y, PAD_WIDTH, PAD_HEIGHT);
    //         // Dessin du Pad 2
    //         ctx.drawImage(padRightImage, ARENA_WIDTH - 64 - PAD_WIDTH, pad2Y, PAD_WIDTH, PAD_HEIGHT);

    //         const ballSize = 48;
    //         ctx.drawImage(
    //             ballImage,
    //             ballPos.x - (ballSize / 2), // center X
    //             ballPos.y - (ballSize / 2), // center Y
    //             ballSize,
    //             ballSize
    //         );
    //     };
    //     renderGame();
    // }, [arenaImage, ballImage, padLeftImage, padRightImage, pad1Pos, pad2Pos, ballPos.x, ballPos.y]);

    return (
    <div
        className="pong-1vs1-arena"
        style={{
            position: "relative",
            width: ARENA_WIDTH,
            height: ARENA_HEIGHT,
        }}
    >
        {/* Babylon.js 3D derrière */}
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
            }}
        >
            <BabylonArena3D
                pad1Pos={pad1Pos} 
                pad2Pos={pad2Pos} 
                ballPos={ballPos} 
            />
        </div>

        {/* Canvas 2D du jeu au-dessus */}
        <canvas
            // ref={canvasRef}
            className="pong-1vs1-canvas"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                pointerEvents: "none",
            }}
        />
    </div>
);

}

// return (
// 	<div className="pong-1vs1-arena">
// 		<canvas ref={canvasRef} className="pong-1vs1-canvas" />
// 	</div>
// );

// 	return (
//     <div
//         className="pong-1vs1-arena"
//         style={{
//             position: "relative",
//             width: ARENA_WIDTH,
//             height: ARENA_HEIGHT,
//         }}
//     >
//         {/* Babylon.js 3D derrière */}
//         <div
//             style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 width: "100%",
//                 height: "100%",
//                 zIndex: 0,
//             }}
//         >
//             <BabylonArena3D />
//         </div>

//         {/* Canvas 2D du jeu au-dessus */}
//         <canvas
//             ref={canvasRef}
//             className="pong-1vs1-canvas"
//             style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 zIndex: 1,
//                 pointerEvents: "none",
//             }}
//         />
//     </div>
// );