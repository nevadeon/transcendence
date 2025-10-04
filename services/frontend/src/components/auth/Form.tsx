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
import WarningSrc from "../../assets/icons/warning.svg";
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
const userDataInit = { name: "", email: "", password: "", auth2: "" };
export interface ValidationMsgProps {
	field: string,
	msg: string
};

export default function Form(props: FormProps) {
	const [ userData, setUserData ] = useState<FormData>(userDataInit);
	const [ validationMsg, setValidationMsg ] = useState<ValidationMsgProps | null>(null);
	const { user, updateUser, login } = useAuth();
	const { messages } = useLanguage();
	const navigate = useNavigate();
	const { register, profile } = props;


	async function handleClick(fieldName: string) {
		const value = userData[fieldName as keyof FormData];
		if (!value || value.length === 0) {
			setValidationMsg({
				field: fieldName,
				msg: "INVALID EMPTY FIELD"
			});
			return;
		}
		try {
			const res = await fetch(`http://localhost:3001/users/${user.id}/${fieldName}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ [fieldName]: value })
			});
			const data = await res.json();
			console.log(res, data);
			if (res.ok) {
				setValidationMsg(null);
				if (fieldName !== "password")
					updateUser({ [fieldName]: data[fieldName] });
				console.log('Update succeed');
			} else {
				setValidationMsg({
					field: fieldName,
					msg: data.error
				});
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
				const data = await res.json();
				if (res.ok && data.token && data.user) {
					setValidationMsg(null);
					login(data.token, data.user);
					navigate('/board');
					console.log('Registration succeed');
				} else {
					setValidationMsg({
						field: data.field,
						msg: data.error
					});
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
					</div>
					{
						validationMsg && validationMsg.field === "name" &&
						<div className="field">
							<img className="field-icon" src={WarningSrc} alt="Warning Icon" />
							<span className="field-msg">{validationMsg.msg}</span>
						</div>
					}
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
						</div>
						{
							validationMsg && validationMsg.field === "email" &&
							<div className="field">
								<img className="field-icon" src={WarningSrc} alt="Warning Icon" />
								<span className="field-msg">{validationMsg.msg}</span>
							</div>
						}
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
					</div>
					{
						validationMsg && validationMsg.field === "password" &&
						<div className="field">
							<img className="field-icon" src={WarningSrc} alt="Warning Icon" />
							<span className="field-msg">{validationMsg.msg}</span>
						</div>
					}
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
							<div className="toggle-switch">
								<label htmlFor="2fa-switch"></label>
								<input type="checkbox" id="2fa-switch" name="2fa-switch" />
								{/* + checked={is2FaEnabled} onChange={handleToggle} /> */}
							</div>
							<button type="button" className="profile-btn" onClick={() => handleClick('auth2')}>
								<img src={QRCodeSrc} alt="QRCode Icon" />
							</button>
						</div>
						{
							validationMsg && validationMsg.field === "auth2" &&
							<div className="field">
								<img className="field-icon" src={WarningSrc} alt="Warning Icon" />
								<span className="field-msg">{validationMsg.msg}</span>
							</div>
						}
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
