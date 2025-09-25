import Avatar1Source from "../../assets/avatars/rick.png";
import Avatar2Source from "../../assets/avatars/meeseeks.png";
import ArenaSource from "../../assets/game/arena.svg";
import PadSource from "../../assets/game/pad.svg";
import BallSrc from "../../assets/game/balls/morty's_head_ball.png";
import ArrowUpSrc from "../../assets/game/keybinds/arrow-up.svg";
import ArrowDownSrc from "../../assets/game/keybinds/arrow-down.svg";
import usePadsMove from "../../hooks/usePadsMove";

// /game/1vsia
export default function Pong1vsIA() {
	const ctrl1 = { upKey: 'q', downKey: 'a' };
	const { pad1Pos, pad2Pos } = usePadsMove(ctrl1, undefined, undefined, undefined);

	return (
		<div className="pong">
			<div className="pong-1vs1-scores">
				<span className="pong-result">06</span>
				<div className="profile-card pong-1vs1-card">
					<img src={Avatar1Source} alt="Player Icon" />
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
			</div>
			<div className="pong-1vs1-arena">
				<img src={ArenaSource} alt="Arena Image" className="pong-1vs1-arena-zone" />
				<div className="pong-1vs1-arena-playzone">
					<img src={PadSource} alt="Pad Image" className="pad left" style={{transform: `translateY(${pad1Pos - 50}%)`}} />
					<img src={BallSrc} alt="Morty Ball" className="ball" />
					<img src={PadSource} alt="Pad Image" className="pad" style={{transform: `translateY(${pad2Pos - 50}%)`}} />
				</div>
			</div>
			<div className="pong-1vs1-scores">
				<span className="pong-result">04</span>
				<div className="profile-card pong-1vs1-card">
					<img src={Avatar2Source} alt="Player Icon" />
					<div className="player-data">
						<span>Mr.Meeseeks</span>
						<span>N.999</span>
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
			</div>
		</div>
	);
}
