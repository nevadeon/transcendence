import usePadsMove from "../../hooks/usePadsMove";
import type { Pong1vsIAProps } from "../../interfaces/Pong1vsIA";
import Avatar1Source from "../../../public/avatars/defaults/rick.png";
import Avatar2Source from "../../../public/avatars/defaults/meeseeks.png";
import ArenaSource from "../../assets/game/arena.svg";
// import PadLeftSource from "../../assets/game/padleft.svg";
import PadSource from "../../assets/game/padright.svg";
import BallSrc from "../../assets/game/balls/morty's_head_ball.png";
import ArrowUpSrc from "../../assets/game/keybinds/arrow-up.svg";
import ArrowDownSrc from "../../assets/game/keybinds/arrow-down.svg";

// /game/1vsia
// TODO: import Arena and Scores Component + canvas setup
export default function Pong1vsIA(props: Pong1vsIAProps) {
	const ctrl1 = { upKey: 'q', downKey: 'a' };
	const { pad1Pos, pad2Pos } = usePadsMove(ctrl1, undefined, undefined, undefined);
	const { words } = props;

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
						<span>{words.messages.games.keys.up}</span>
					</div>
					<div className="pong-1vs1-shortcuts-key">
						<span>Q</span>
						<span>{words.messages.games.keys.down}</span>
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
						<span>{words.messages.games.keys.up}</span>
					</div>
					<div className="pong-1vs1-shortcuts-key">
						<span>
							<img src={ArrowDownSrc} alt="Arrow Down Icon" />
						</span>
						<span>{words.messages.games.keys.down}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
