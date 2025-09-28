import "../../styles/tournament/UsernameInput.css";

export default function UsernameInput(props: any) {
	const { data, onChange } = props;

	return (
		<div className="portal-gun-input">
			<div className="labels">
				<label htmlFor="name">USERNAME</label>
				<label htmlFor="name">PARTICIPANTS</label>
			</div>
			<input
				type="text"
				id="name"
				name="name"
				onChange={onChange}
				value={data.name}
				required
				autoComplete='off'
				pattern="^[a-zA-Z0-9]{3,24}$"
				title="Username must be 3-24 characters long and contain only letters and numbers."
			/>
		</div>
	);
}