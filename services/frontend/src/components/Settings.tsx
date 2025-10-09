import LanguageSwitcher from "./LanguageSwitcher";
import DeleteButton from "./DeleteButton";
import type { SettingsProps } from "../interfaces/Settings";

export default function Settings(props: SettingsProps) {
	const { inProfile } = props;

	return (
		<div className={!inProfile ? "auth-btn-format" : ""}>
			<LanguageSwitcher />
			{
				inProfile &&
				<DeleteButton inProfile={inProfile} />
			}
		</div>
	);
}