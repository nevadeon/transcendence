import HomeSrc from "../../assets/icons/cross.svg";
import "../../styles/common/HomeButton.css";
import { useNavigate } from "react-router";


export default function HomeButton() {
	const navigate = useNavigate();

	return (
		<button className="home-btn" onClick={() => navigate('/board')}>
			<img src={HomeSrc}/>
		</button>
	);
}