import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/auth/useAuth";
import useLanguage from "../contexts/language/useLanguage";
import CustomGoogleButton from "./CustomGoogleOAuth";
import type { FormData } from "../interfaces/Form";
import videoSource from "../assets/scanline.mp4";
import audioSource from "../assets/audios/start_hologram.mp3";
import audioSource2 from "../assets/audios/[Rick Sanchez]MORTY......T !!!.mp3";

export default function Form({ register }: {register: boolean}) {
	const [userData, setUserData] = useState<FormData>({ name: '', email: '', password: '' });
	const naviguate = useNavigate();
	const { login } = useAuth();
	const { messages } = useLanguage();

	async function handleAudio() {
		try {
			const audioHolo = new Audio(audioSource);
			const audioRick = new Audio(audioSource2);
			audioHolo.volume = .32;
			audioRick.volume = .72;
			await audioHolo.play();
			//timestamp()
			await audioRick.play();
		} catch (err) {
			console.log(err);
		}
	}

	function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		setUserData(( prev: FormData ) => ( { ...prev, [name]: value } ));
	}

	// async function handleOAuthSuccess(credentialResponse: any) {
	// 	console.log("Token reçu :", credentialResponse.credential);
	// 	try {
	// 		const res = await fetch('http://localhost:3001/api/auth/google', { //endpoint in back
	// 			method: 'POST',
	// 			headers: {
	// 			'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify({
	// 				token: credentialResponse.credential,
	// 			}),
	// 		});
	// 		const data = await res.json();
	// 		if (!res.ok) {
	// 			throw new Error(data.message || "La connexion a échoué.");
	// 		}
	// 		const user = data.user;
	// 		const token = data.token;
	// 		localStorage.setItem('user', JSON.stringify(user));
	// 		localStorage.setItem('token', token);
	// 		naviguate('/board');
	// 	} catch (err: any) {
	// 		console.error("Erreur lors de la connexion avec le backend :", err);
	// 	}
	// }

	async function handleSubmit(e: any) {
		e.preventDefault();
		if (register) {
			try {
				const res = await fetch("http://localhost:3001/users", {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify( userData )
				});
				const data = await res.json();
				if (res.ok && data.token) {
					console.log('Registration successful', data);
					login(data.token);
					naviguate('/board');
				} else {
					console.error('Registration failed');
				}
			} catch(err) {
				console.error('Registration error: ', err)
			}
		} else {
			try {
				const res = await fetch("http://localhost:3001/login", {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify( userData )
				});
				const data = await res.json();
				if (res.ok && data.token) {
					console.log('Login successful');
					login(data.token);
					naviguate('/board');
				} else {
					console.error('Login failed');
				}
			} catch(err) {
				console.error('Login error: ', err)
			}
		}
	}

	return (
		<>
			<video className="video-background" autoPlay loop muted>
				<source src={videoSource} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<form onSubmit={handleSubmit}>
				<CustomGoogleButton />
				{/* <GoogleLogin
					onSuccess={handleOAuthSuccess}
					onError={() => {
						console.log('Login Failed');
					}}
					theme="outline" // Peut être 'outline' (bordure) ou 'filled_blue' (couleur par défaut)
					size="large"    // Peut être 'large', 'medium' ou 'small'
					text="signup_with" // Peut être 'signin_with', 'signup_with', 'continue_with'
					shape="pill"    // Peut être 'circle', 'rectangle', 'pill'
					logo_alignment="left" // Peut être 'left' ou 'center'
					width="300"
				/> */}
				<div className='usrname-input'>
					<label htmlFor="name">
						{messages.register.name}
					</label>
					<input
						type="text"
						id="name"
						name="name"
						onChange={handleInputChange}
						value={userData.name}
						required
						autoComplete='off'
						pattern="^[a-zA-Z0-9]{3,24}$"
            			title="Username must be 3-24 characters long and contain only letters and numbers."
					/>
				</div>
				{
					register &&
					<div className='email-input'>
						<label htmlFor='email'>
							{messages.register.email}
						</label>
						<input
							type='email'
							id='email'
							name='email'
							onChange={handleInputChange}
							value={userData.email}
							required
							autoComplete='off'
						/>
					</div>
				}
				<div className='pwd-input'>
					<label htmlFor="password">
						{messages.register.pwd}
					</label>
					<input
						type="password"
						id="password"
						name="password"
						onChange={handleInputChange}
						value={userData.password}
						required
						autoComplete='off'
						minLength={8}
            			pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    					title="Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long."
					/>
				</div>
				<button type='submit' id='submit' className='submit' onClick={handleAudio}>
					{register ? messages.register.cta : messages.login.cta}
				</button>
			</form>
			<span>
				{register ?
					<>
						{messages.register.extra}
						<Link to='/login' id='link' className='link'> {messages.register.link}</Link>
					</> :
					<>
						{messages.login.extra}
						<Link to="/register" id='link' className='link'> {messages.login.link}</Link>
					</>
				}
			</span>
		</>
	)
}
