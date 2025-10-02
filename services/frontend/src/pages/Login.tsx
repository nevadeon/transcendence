import Form from '../components/auth/Form';
import Settings from '../components/Settings';
import videoSource from "../assets/scanline.mp4";
import { GoogleOAuthProvider } from '@react-oauth/google';
import CustomGoogleButton from '../components/auth/CustomGoogleOAuth';
import '../styles/auth/Auth.css'

// clientID within .env as a varname !!!
export default function Login() {
	return (
		<div className='auth-page'>
			<div className='auth-form'>
				<Settings inProfile={false} />
				<video className="video-background" autoPlay loop muted>
					<source src={videoSource} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
				<Form register={false} profile={false} />
				<GoogleOAuthProvider clientId='243143343142-2d5inhhfr4coorov0ttctsp05ata8sa1.apps.googleusercontent.com'>
					<CustomGoogleButton />
				</GoogleOAuthProvider>
			</div>
			<div className='auth-screenbar'></div>
		</div>
	)
}
