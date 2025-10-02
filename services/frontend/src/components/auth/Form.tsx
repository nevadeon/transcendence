import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import useLanguage from "../../contexts/language/useLanguage";
import type { FormProps, FormData } from "../../interfaces/Form";
import { useAuth } from "../../contexts/auth/useAuth";
// import audioSource from "../../assets/audios/start_hologram.mp3";
// import audioSource2 from "../../assets/audios/keyboard.mp3";
// import audioSource3 from "../../assets/audios/Voicy_Rick Sanchez Seriously_.mp3";
// import audioSource4 from "../../assets/audios/[Rick Sanchez]MORTY......T !!!.mp3";
import QRCodeSrc from "../../assets/icons/qrcode.svg";
import ModifSrc from "../../assets/icons/modif.svg";
// opti calls, filename chars lengths

// async function handleAudio() {
// 	try {
// 		//opti in audios array?
// 		const hologram = new Audio(audioSource);
// 		const keyboard = new Audio(audioSource2);
// 		const rickSeriously = new Audio(audioSource3);
// 		const rickTalk = new Audio(audioSource4);
// 		hologram.volume = .32;
// 		keyboard.volume = 1;
// 		rickSeriously.volume = .32;
// 		rickTalk.volume = .72;
// 		hologram.play();
// 		setTimeout(() => {
// 			rickSeriously.play();
// 		}, 1200);
// 		setTimeout(() => {
// 			keyboard.play();
// 			rickTalk.play();
// 		}, 3200);
// 	} catch (err) {
// 		console.log(err);
// 	}
// }
export default function Form(props: FormProps) {
	const { user, updateUser, login } = useAuth();
	const [userData, setUserData] = useState<FormData>({ name: "", email: "", password: "", auth2: "" });
	const [validationMsg, setValidationMsg] = useState({
		field: "",
		msg: ""
	});
	const navigate = useNavigate();
	const { messages } = useLanguage();
	const { register, profile } = props;


	async function handleClick(fieldName: string) {
		const value = userData[fieldName as keyof FormData];
		if (!value || value.length === 0) {
			setValidationMsg({
				field: fieldName,
				msg: "Invalid empty fields"
			});
			return;
		}
		try {
			const res = await fetch(`http://localhost:3001/users/${user.id}/${fieldName}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ [fieldName]: value })
			});
			
			if (res.ok) {
				const data = await res.json();
				if (fieldName !== "password")
					updateUser({ [fieldName]: data[fieldName] });
				console.log('Update successful');
			} else {
				// setValidationMsg({
				// 	field: fieldName,
				// 	msg: res.error
				// });
				console.error('Update failed');
			}
		} catch(err) {
			console.error('Update error:', err);
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
				const { token, user } = await res.json();
				if (res.ok && token && user) {
					login(token, user);
					navigate('/board');
				} else {
					if (res.status === 409)
						console.log("User already exist");
					console.error('Registration failed');
				}
			} catch(err) {
				console.error(err);
			}
		} else {
			try {
				const res = await fetch("http://localhost:3001/login", {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify( userData )
				});
				const { token, user } = await res.json();
				if (res.ok && token && user) {
					console.log('Login successful');
					login(token, user);
					navigate('/board');
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
			<form onSubmit={handleSubmit} className={profile ? "form-profile" : ""}>
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
							placeholder="..."
							required
							autoComplete='off'
							pattern="^[a-zA-Z0-9]{3,24}$"
							title="Username must be 3-24 characters long and contain only letters and numbers."
						/>
						{
							profile &&
							<button type="button" className="profile-btn" onClick={() => handleClick('name')}>
								<img src={ModifSrc} alt="Modif Icon" />
							</button>
						}
						{
							validationMsg && validationMsg.field === "name" &&
							<div className="field">
								<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="#87fefe" viewBox="0 0 256 256"><path d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z"></path></svg>
								{}
							</div>
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
								placeholder="..."
								required
								autoComplete='off'
							/>
							{
								profile &&
								<button type="button" className="profile-btn" onClick={() => handleClick('email')}>
									<img src={ModifSrc} alt="Modif Icon" />
								</button>
							}
							{
								validationMsg && validationMsg.field === "email" &&
								<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="#87fefe" viewBox="0 0 256 256"><path d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z"></path></svg>
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
							placeholder="..."
							required
							autoComplete='off'
							minLength={8}
							// pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
							// title="Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long."
						/>
						{
							profile &&
							<button type="button" className="profile-btn" onClick={() => handleClick('password')} >
								<img src={ModifSrc} alt="Modif Icon" />
							</button>
						}
						{
							validationMsg && validationMsg.field === "password" &&
							<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="#87fefe" viewBox="0 0 256 256"><path d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z"></path></svg>
						}
					</div>
				</div>
				{
					profile &&
					<div className='otp-input'>
						<label
							htmlFor='auth2'
							className={profile ? "profile-label" : ""}
						>
							2FA AUTH
						</label>
						<div className="in-line">
							<input
								type='text'
								id="auth2"
								name="auth2"
								className={profile ? "profile-input last" : ""}
								onChange={handleInputChange}
								value={userData.auth2}
								placeholder="..."
								// inputmode="numeric"
								autoComplete='off'
								pattern="[0-9]{6}"
								// autocomplete="one-time-code"
							/>
							<button type="button" className="profile-btn" onClick={() => handleClick('auth2')}>
								<img src={QRCodeSrc} alt="QRCode Icon" />
							</button>
							{
								validationMsg && validationMsg.field === "auth2" &&
								<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="#87fefe" viewBox="0 0 256 256"><path d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z"></path></svg>
							}
						</div>
					</div>
				}
				{
					!profile &&
					// onClick={handleAudio}
					<button type='submit' id='submit' className='submit'>
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
