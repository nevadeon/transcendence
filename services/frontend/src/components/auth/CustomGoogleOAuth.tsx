import { useNavigate } from 'react-router';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/auth/useAuth';
import googleIcon from "../../assets/oauth/google.svg";
import { createStatsRow } from './Form';

export default function CustomGoogleButton() {
	const naviguate = useNavigate();
	const { login } = useAuth();

	async function handleOAuthSuccess(credentialResponse: any) {
		try {
			const res = await fetch('http://localhost:3001/register/google/verify', {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					accessToken: credentialResponse.access_token,
				})
			});
			const data = await res.json();
			if (res.ok && data.token && data.user) {
				createStatsRow(data.user.id);
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
