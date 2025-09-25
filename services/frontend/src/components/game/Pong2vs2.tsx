import Avatar1Src from "../../assets/avatars/rick.png";
import Avatar2Src from "../../assets/avatars/poopy.png";
import Avatar3Src from "../../assets/avatars/morty.png";
import Avatar4Src from "../../assets/avatars/squanchy.png";
import DuoArenaSource from "../../assets/game/2vs2-terrain.svg";
import ThinPadSource from "../../assets/game/thin-pad.svg";
import BallSrc from "../../assets/game/balls/morty's_head_ball.png";
import ArrowUpSrc from "../../assets/game/keybinds/arrow-up.svg";
import ArrowDownSrc from "../../assets/game/keybinds/arrow-down.svg";
import usePadsMove from "../../hooks/usePadsMove";

// /game/2vs2
export default function Pong2vs2() {
	const ctrl1 = { upKey: 'q', downKey: 'a' };
	const ctrl2 = { upKey: 'f', downKey: 'v' };
	const ctrl3 = { upKey: 'k', downKey: 'm' };
	const ctrl4 = { upKey: '\'', downKey: ']' };
	const { pad1Pos, pad2Pos } = usePadsMove(ctrl1, ctrl2, ctrl3, ctrl4);

	return (
		<div className="pong-1vs1">
			<div className="pong-1vs1-scores">
				<div className="profile-card pong-1vs1-card">
					<img src={Avatar1Src} alt="Player Icon" />
					<div className="player-data">
						<span>ttaquet</span>
						<span>N.313</span>
					</div>
				</div>
				<div className="pong-1vs1-shortcuts">
					<div className="pong-1vs1-shortcuts-key">
						<span>A</span>
						<span>UP</span>
					</div>
					<div className="pong-1vs1-shortcuts-key">
						<span>Q</span>
						<span>DOWN</span>
					</div>
				</div>
				<span className="pong-result vs2">06</span>
				<div className="pong-1vs1-shortcuts">
					<div className="pong-1vs1-shortcuts-key">
						<span>A</span>
						<span>UP</span>
					</div>
					<div className="pong-1vs1-shortcuts-key">
						<span>Q</span>
						<span>DOWN</span>
					</div>
				</div>
				<div className="profile-card pong-1vs1-card bot">
					<img src={Avatar2Src} alt="Player Icon" />
					<div className="player-data">
						<span>ttaquet</span>
						<span>N.313</span>
					</div>
				</div>
			</div>
			<div className="pong-1vs1-arena">
				<img src={DuoArenaSource} alt="Arena Image" className="pong-1vs1-arena-zone" />
				<div className="pong-1vs1-arena-playzone double">
					<div className="duo">
						<img src={ThinPadSource} alt="Pad Image" className="pad left" style={{transform: `translateY(${pad1Pos - 50}%)`}} />
						<img src={ThinPadSource} alt="Pad Image" className="pad left" style={{transform: `translateY(${pad1Pos - 50}%)`}} />
					</div>
					<img src={BallSrc} alt="Morty Ball" className="ball" />
					<div className="duo">
						<img src={ThinPadSource} alt="Pad Image" className="pad" style={{transform: `translateY(${pad2Pos - 50}%)`}} />
						<img src={ThinPadSource} alt="Pad Image" className="pad" style={{transform: `translateY(${pad2Pos - 50}%)`}} />
					</div>
				</div>
			</div>
			<div className="pong-1vs1-scores">
				<div className="profile-card pong-1vs1-card">
					<img src={Avatar3Src} alt="Player Icon" />
					<div className="player-data">
						<span>ndavenne</span>
						<span>N.666</span>
					</div>
				</div>
				<div className="pong-1vs1-shortcuts">
					<div className="pong-1vs1-shortcuts-key">
						<span>
							<img src={ArrowUpSrc} alt="Arrow Up Icon" />
							</span>
						<span>UP</span>
					</div>
					<div className="pong-1vs1-shortcuts-key">
						<span>
							<img src={ArrowDownSrc} alt="Arrow Down Icon" />
						</span>
						<span>DOWN</span>
					</div>
				</div>
				<span className="pong-result vs2">04</span>
				<div className="pong-1vs1-shortcuts">
					<div className="pong-1vs1-shortcuts-key">
						<span>
							<img src={ArrowUpSrc} alt="Arrow Up Icon" />
							</span>
						<span>UP</span>
					</div>
					<div className="pong-1vs1-shortcuts-key">
						<span>
							<img src={ArrowDownSrc} alt="Arrow Down Icon" />
						</span>
						<span>DOWN</span>
					</div>
				</div>
				<div className="profile-card pong-1vs1-card bot">
					<img src={Avatar4Src} alt="Player Icon" />
					<div className="player-data">
						<span>ndavenne</span>
						<span>N.666</span>
					</div>
				</div>
			</div>
		</div>
	);
}
