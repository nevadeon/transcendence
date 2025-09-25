export default function Scores(props: any) {
	const { avatar, avatar2, name, name2, result, ctrl, ctrl2, is2vs2 } = props;

	return (
		<div className="pong-1vs1-scores">
			{is2vs2 &&
			<>
				<div className="profile-card pong-1vs1-card">
					<img src={avatar} alt="Player Icon" />
					<div className="player-data">
						<span>{name}</span>
						<span>N.313</span>
					</div>
				</div>
				<div className="pong-1vs1-shortcuts">
					<div className="pong-1vs1-shortcuts-key">
						<span>{ctrl.upKey.toUpperCase()}</span>
						<span>UP</span>
					</div>
					<div className="pong-1vs1-shortcuts-key">
						<span>{ctrl.downKey.toUpperCase()}</span>
						<span>DOWN</span>
					</div>
				</div>
			</>
			}
			<span className={is2vs2 ? "pong-result vs2" : "pong-result"}>
				{result < 10 ? "0" + result : result}
			</span>
			{
				is2vs2 &&
				<div className="pong-1vs1-shortcuts">
					<div className="pong-1vs1-shortcuts-key">
						<span>{ctrl2.upKey.toUpperCase()}</span>
						<span>UP</span>
					</div>
					<div className="pong-1vs1-shortcuts-key">
						<span>{ctrl2.downKey.toUpperCase()}</span>
						<span>DOWN</span>
					</div>
				</div>
			}
			<div className={is2vs2 ? "profile-card pong-1vs1-card bot" : "profile-card pong-1vs1-card"}>
				<img src={is2vs2 ? avatar2 : avatar} alt="Player Icon" />
				<div className="player-data">
					<span>{is2vs2 ? name2 : name}</span>
					<span>N.313</span>
				</div>
			</div>
			{
				!is2vs2 &&
				<div className="pong-1vs1-shortcuts">
					<div className="pong-1vs1-shortcuts-key">
						<span>{ctrl.upKey.toUpperCase()}</span>
						<span>UP</span>
					</div>
					<div className="pong-1vs1-shortcuts-key">
						<span>{ctrl.downKey.toUpperCase()}</span>
						<span>DOWN</span>
					</div>
				</div>
			}
		</div>
	);
}