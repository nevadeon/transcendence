import Player1Source from "../../assets/avatars/avatar_test.png";
import Player2Source from "../../assets/avatars/poopy.png";
import ArenaSource from "../../assets/game/arena.svg";
import PadSource from "../../assets/game/pad.svg";
import CenterSource from "../../assets/game/center_mark.svg";
import BallSrc from "../../assets/game/balls/morty's_head_ball.png";

// /game/1vs1
export default function Pong1vs1() {
	return (
		<div className="pong-1vs1">
			<div className="pong-1vs1-scores">
				<div className="profile-card">
					<img src={Player1Source} alt="Player Icon" />
					<div className="player-data">
						<span>ttaquet</span>
						<span>N.313</span>
					</div>
				</div>
				<div className="shortcuts">
					<div className="shortcuts-up">
						<span>A</span>
						<span>UP</span>
					</div>
					<div className="shortcuts-down">
						<span>Q</span>
						<span>DOWN</span>
					</div>
				</div>
			</div>
			<div className="pong-1vs1-arena">
				{/* modif arena svg */}
				<img src={ArenaSource} alt="" />
				<div className="pong-1vs1-arena-playzone">
					<img src={CenterSource} alt="" />
					<img src={PadSource} alt="" />
						<img src={BallSrc} alt="ball" className="ball" />
					<img src={PadSource} alt="" />
				</div>
			</div>
			<div className="pong-1vs1-scores">
				<div className="profile-card">
					<img src={Player2Source} alt="Player Icon" />
					<div className="player-data">
						<span>ttaquet</span>
						<span>N.313</span>
					</div>
				</div>
				<div className="shortcuts">
					<div className="shortcuts-up">
						<span>A</span>
						<span>UP</span>
					</div>
					<div className="shortcuts-down">
						<span>Q</span>
						<span>DOWN</span>
					</div>
				</div>
			</div>
		</div>
	);
}
