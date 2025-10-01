export const PAD_SPEED = 5;

export interface PadControls {
	upKey: string;
	downKey: string;
}

export interface PadPositions {
	pad1Pos: number;
	pad2Pos: number;
	pad3Pos: number;
	pad4Pos: number;
	ballPos: {x: number, y: number};
}