import type { ScoresProps } from "../../interfaces/Scores";
import { useAuth } from "../../contexts/auth/useAuth";
// const BASE_IMG_URL = import.meta.env.BASE_IMG_URL;

export default function Scores(props: ScoresProps) {
	const { user } = useAuth();
	const { avatar, name, result, ctrl, isAI, words } = props;

    let username = (name && !isAI) ? name : user.name;
    let tavatar = (name && !isAI) ? avatar : user.avatar;
	return (
		<div className="pong-1vs1-scores">
			<span className={"pong-result"}>
				{result < 10 ? "0" + result : result}
			</span>
			<div className={"profile-card pong-1vs1-card"}>
				<img src={`${tavatar && !isAI ? tavatar : avatar}`} alt="Player Icon" />
				<div className="player-data">
					<span>{username && !isAI ? username : name}</span>
					<span>{user.dimension && !isAI ? user.dimension : "Z-999"}</span>
				</div>
			</div>
			{
				!isAI &&
				<div className="pong-1vs1-shortcuts">
					<div className="pong-1vs1-shortcuts-key">
						<span>{ctrl.upKey.toUpperCase()}</span>
						<span>{words.messages.games.keys.up}</span>
					</div>
					<div className="pong-1vs1-shortcuts-key">
						<span>{ctrl.downKey.toUpperCase()}</span>
						<span>{words.messages.games.keys.down}</span>
					</div>
				</div>
			}{
                isAI &&
                <div className="pong-1vsAI-shortcut">
                   <div className="pong-1vsAI-shortcuts-key">
						<span>{ctrl.upKey.toUpperCase()}</span>
						<span>{words.messages.games.keys.up}</span>
					</div>
					<div className="pong-1vsAI-shortcuts-key">
						<span>{ctrl.downKey.toUpperCase()}</span>
						<span>{words.messages.games.keys.down}</span>
					</div>
                </div>
            }
		</div>
	);
}
