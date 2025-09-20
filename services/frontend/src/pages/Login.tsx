import Form from '../components/Form';
import Settings from '../components/Settings';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CustomGoogleButton from '../components/CustomGoogleOAuth';

// clientID within .env as a varname !!!
export default function Login() {
	return (
		<div className='auth-page'>
			<div className='auth-form'>
				<Settings />
				<Form register={false} />
				<GoogleOAuthProvider clientId='243143343142-2d5inhhfr4coorov0ttctsp05ata8sa1.apps.googleusercontent.com'>
					<CustomGoogleButton />
				</GoogleOAuthProvider>
			</div>
			<div className='auth-screenbar'></div>
		</div>
	)
}
