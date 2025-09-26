import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/auth/useAuth";
import useLanguage from "../../contexts/language/useLanguage";
import type { FormProps, FormData } from "../../interfaces/Form";
import audioSource from "../../assets/audios/start_hologram.mp3";
import audioSource2 from "../../assets/audios/keyboard.mp3";
import audioSource3 from "../../assets/audios/Voicy_Rick Sanchez Seriously_.mp3";
import audioSource4 from "../../assets/audios/[Rick Sanchez]MORTY......T !!!.mp3";
import QRCodeSrc from "../../assets/icons/qrcode.svg";
import ModifSrc from "../../assets/icons/modif.svg";
// opti calls, filename chars lengths

export default function Form(props: FormProps) {
	const [userData, setUserData] = useState<FormData>({ name: '', email: '', password: '' });
	const naviguate = useNavigate();
	const { login } = useAuth();
	const { messages } = useLanguage();
	const { register, profile } = props;

	async function handleAudio() {
		try {
			//opti in audios array?
			const hologram = new Audio(audioSource);
			const keyboard = new Audio(audioSource2);
			const rickSeriously = new Audio(audioSource3);
			const rickTalk = new Audio(audioSource4);
			hologram.volume = .32;
			keyboard.volume = 1;
			rickSeriously.volume = .32;
			rickTalk.volume = .72;
			hologram.play();
			setTimeout(() => {
				rickSeriously.play();
			}, 1200);
			setTimeout(() => {
				keyboard.play();
				rickTalk.play();
			}, 3200);
		} catch (err) {
			console.log(err);
		}
	}

	function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		setUserData(( prev: FormData ) => ( { ...prev, [name]: value } ));
	}

	async function handleSubmit(e: any) {
		e.preventDefault();
		if (register) {
			try {
				const res = await fetch("http://localhost:3001/register", {
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
			<form onSubmit={handleSubmit}>
				<div className='usrname-input'>
					<label
						htmlFor="name"
						className={profile ? "profile-label" : ""}
					>
						{messages.register.name}
					</label>
					<div className="in-line">
						<input
							type="text"
							id="name"
							name="name"
							className={profile ? "profile-input" : ""}
							onChange={handleInputChange}
							value={userData.name}
							required
							autoComplete='off'
							pattern="^[a-zA-Z0-9]{3,24}$"
							title="Username must be 3-24 characters long and contain only letters and numbers."
						/>
						{
							profile &&
							<button className="profile-btn">
								<img src={ModifSrc} alt="Modif Icon" />
							</button>
						}
					</div>
				</div>
				{
					register &&
					<div className='email-input'>
						<label
							htmlFor='email'
							className={profile ? "profile-label" : ""}
						>
							{messages.register.email}
						</label>
						<div className="in-line">
							<input
								type='email'
								id='email'
								name='email'
								className={profile ? "profile-input" : ""}
								onChange={handleInputChange}
								value={userData.email}
								required
								autoComplete='off'
							/>
							{
								profile &&
								<button className="profile-btn">
									<img src={ModifSrc} alt="Modif Icon" />
								</button>
							}
						</div>
					</div>
				}
				<div className='pwd-input'>
					<label
						htmlFor="password"
						className={profile ? "profile-label" : ""}	
					>
						{messages.register.pwd}
					</label>
					<div className="in-line">
						<input
							type="password"
							id="password"
							name="password"
							className={profile ? "profile-input" : ""}
							onChange={handleInputChange}
							value={userData.password}
							required
							autoComplete='off'
							minLength={8}
							// pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
							// title="Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long."
						/>
						{
							profile &&
							<button className="profile-btn">
								<img src={ModifSrc} alt="Modif Icon" />
							</button>
						}
					</div>
				</div>
				{
					profile &&
					<div className='otp-input'>
						<label
							htmlFor='otp-code'
							className={profile ? "profile-label" : ""}
						>
							2FA AUTH
						</label>
						<div className="in-line">
							<input
								type='text'
								id="otp-code"
								name="otp-code"
								className={profile ? "profile-input last" : ""}
								// inputmode="numeric"
								pattern="[0-9]{6}"
								// autocomplete="one-time-code"
							/>
							<button className="profile-btn">
								<img src={QRCodeSrc} alt="QRCode Icon" />
							</button>
						</div>
					</div>
				}
				{
					!profile &&
					<button type='submit' id='submit' className='submit' onClick={handleAudio}>
						{register ? messages.register.cta : messages.login.cta}
					</button>
				}
			</form>
			{
				!profile &&
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
			}
		</>
	)
}
