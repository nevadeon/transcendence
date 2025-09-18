import Form from '../components/Form';
import Settings from '../components/Settings';
import { GoogleOAuthProvider } from '@react-oauth/google';


// clientID within .env as a varname !!!
export default function Login() {
	return (
		<div className='auth-form'>
			<Settings />
			<GoogleOAuthProvider clientId='243143343142-2d5inhhfr4coorov0ttctsp05ata8sa1.apps.googleusercontent.com'>
				<Form register={false} />
			</GoogleOAuthProvider>
		</div>
	)
}
