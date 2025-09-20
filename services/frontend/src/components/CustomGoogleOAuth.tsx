import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import googleIcon from "../assets/google.svg";

export default function CustomGoogleButton() {
	const naviguate = useNavigate();

	async function handleOAuthSuccess(credentialResponse: any) {
		console.log("Token reçu :", credentialResponse.credential);
		try {
			const res = await fetch('http://localhost:3001/api/auth/google', { //endpoint in back
				method: 'POST',
				headers: {
				'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token: credentialResponse.credential,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message || "La connexion a échoué.");
			}
			const user = data.user;
			const token = data.token;
			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('token', token);
			naviguate('/board');
		} catch (err: any) {
			console.error("Erreur lors de la connexion avec le backend :", err);
		}
	}

	const login = useGoogleLogin({
		onSuccess: handleOAuthSuccess,
		onError: () => {
			console.log('Login Failed');
		},
	});

	return (
		<button 
			onClick={() => login()} 
			className="o-auth-google">
			<img src={ googleIcon } alt="Google logo" />
		</button>
	);
}
