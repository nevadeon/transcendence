import { useNavigate } from 'react-router';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../contexts/auth/useAuth';
import googleIcon from "../../assets/oauth/google.svg";

export default function CustomGoogleButton() {
	const naviguate = useNavigate();
	const { login } = useAuth();

	async function handleOAuthSuccess(credentialResponse: any) {
		console.log(credentialResponse.credential);
		console.log(jwtDecode(credentialResponse.credential));
		try {
			const res = await fetch('http://localhost:3001/register/google/verify', {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					idToken: credentialResponse.credential,
				}),
			});
			const data = await res.json();
			if (res.ok && data.token && data.user) {
				login(data.token, data.user);
				naviguate('/board');
				console.log('OAuth 2.0 succeed');
			}
		} catch (err: any) {
			console.error("OAuth 2.0 failed :", err);
		}
	}

	const googleLogin = useGoogleLogin({
		onSuccess: handleOAuthSuccess,
		onError: () => {
			console.log('OAuth Login from Google SDK failed');
		},
	});

	return (
		<button 
			onClick={() => googleLogin()}
			className="o-auth-google">
			<img src={ googleIcon } alt="Google Icon" />
		</button>
	);
}
