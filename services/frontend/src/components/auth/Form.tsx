import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import useLanguage from "../../contexts/language/useLanguage";
import type { FormProps, FormData } from "../../interfaces/Form";
import { useAuth } from "../../contexts/auth/useAuth";
import ModifSrc from "../../assets/icons/modif.svg";
import WarningSrc from "../../assets/icons/warning.svg";
import TwoFactorSetup from "./TwoFactor";
import  "../../styles/auth/Auth.css"
// import audioSource from "../../assets/audios/start_hologram.mp3";
// import audioSource2 from "../../assets/audios/keyboard.mp3";
// import audioSource3 from "../../assets/audios/Voicy_Rick Sanchez Seriously_.mp3";
// import audioSource4 from "../../assets/audios/[Rick Sanchez]MORTY......T !!!.mp3";
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
const userDataInit = { name: "", email: "", password: "" };

export interface ValidationMsgProps {
	field: string,
	msg: string
};

interface ValidationMsg2FAProps {
    type: 'success' | 'error' | 'info';
    message: string;
}

export async function createStatsRow(id: number) {
		try {
			const res = await fetch(`http://localhost:3002/users_stats/init/${id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: id })
			});
			await res.json();
			if (res.ok) {
				return ;
			}
		} catch (err) {
			console.error('Update error:', err);
		}
	}

export default function Form(props: FormProps) {
	const [ userData, setUserData ] = useState<FormData>(userDataInit);
	const [ validationMsg, setValidationMsg ] = useState<ValidationMsgProps | null>(null);
	const [ validationMsg2FA, setValidationMsg2FA ] = useState<ValidationMsg2FAProps | null>(null);
	const [ is2FARequired, setIs2FARequired ] = useState(false);
	const [ is2FACodeGen, setIs2FACodeGen ] = useState(false);
	const [ twoFactorCode, setTwoFactorCode ] = useState('');
	const { user, token, updateUser, login } = useAuth();
	const { messages } = useLanguage();
	const navigate = useNavigate();
	const { register, profile } = props;

	function handleClick2FAOpen() {
		setIs2FACodeGen(true);
		console.log(is2FACodeGen);
	}

	function handleClick2FACancel() {
		setIs2FACodeGen(false);
		console.log(is2FACodeGen);
	}

	async function createStatsRow(id: number) {
		try {
			const res = await fetch(`http://localhost:3002/users_stats/init/${id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: id })
			});
			await res.json();
			if (res.ok) {
				return ;
			}
		} catch (err) {
			console.error('Update error:', err);
		}
	}

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
					createStatsRow(data.user.id);
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
				const headers: Record<string, string> = { 'Content-Type': 'application/json' };
				// 2nd login with 2FA
				if (is2FARequired && twoFactorCode) {
					headers['x-two-factor-code'] = twoFactorCode;
				}
				const res = await fetch("http://localhost:3001/login", {
					method: 'POST',
					headers: headers,
					body: JSON.stringify( userData )
				});
				const data = await res.json();
				const { token, user } = data;
				if (res.ok && token && user) {
					setValidationMsg(null);
					setIs2FARequired(false);
					setTwoFactorCode('');
					login(token, user);
					navigate('/board');
					console.log('Login successful');
				} else if (res.status === 403 && data.needs_2fa) {
					setIs2FARequired(true);
					setValidationMsg2FA({ type: 'info', message: "Veuillez entrer votre code d'authentification à deux facteurs." });
				} else {
					setValidationMsg({
						field: data.field,
						msg: data.error
					});
					setIs2FARequired(false);
					setTwoFactorCode('');
					console.error('Login failed');
				}
			} catch(err) {
				console.error('Login error: ', err)
			}
		}
	}

	const getMessageStyle = (type: ValidationMsg2FAProps['type']) => {
        switch (type) {
            case 'success': return 'bg-green-100 border-green-400 text-green-700';
            case 'error': return 'bg-red-100 border-red-400 text-red-700';
            case 'info': return 'bg-blue-100 border-blue-400 text-blue-700';
            default: return '';
        }
    };

	return (
		<>
			<form onSubmit={handleSubmit} className={profile ? "form-profile" : "form"}>
				{
					is2FARequired && (
					<div className="twofa-input">
						{
							validationMsg2FA &&
							<div className={`${getMessageStyle(validationMsg2FA.type)}`}>
								<img className="field-icon" src={WarningSrc} alt="Warning Icon" />
								<span className="field-msg">{validationMsg2FA.message}</span>
							</div>
						}
						<label htmlFor="2fa-code">CODE 2FA (TOTP)</label>
						<input
							id="2fa-code"
							name="2fa-code"
							type="text"
							placeholder="123456"
							value={twoFactorCode}
							onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
							required
						/>
						<span>Ré-appuyez sur Connexion après avoir entré le code.</span>
					</div>
				)}
				{
					!is2FARequired && (
						<div>
							{
								!is2FACodeGen && (
									<div>
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
									</div>
								)
							}
							{
								profile &&
								<TwoFactorSetup token={token} profile={profile} onClickOpen={handleClick2FAOpen} onClickCancel={handleClick2FACancel} />
							}
						</div>
					)
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
