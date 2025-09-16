import { useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import useLanguage from "../contexts/language/useLanguage";
import type { FormData } from "../interfaces/Form";

export default function Form({ register }: {register: boolean}) {
	const [data, setData] = useState<FormData>({
		username: '',
		email: '',
		password: ''
	});
	const { messages } = useLanguage();

	function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		setData((prev: FormData) => ({ ...prev, [name]: value}));
	}

	async function handleAudio() {
		try {
			const audio = new Audio('/assets/start.mp3');
			await audio.play();
		} catch (err) {
			console.log(err);
		}
	}

	// function handleSubmit(e: FormEvent<HTMLFormElement>): void {
	// 	e.preventDefault()
	// 	// Handle form submission logic here
	// 	console.log('Form submitted:', data)
	// }

	return (
		<form className='auth-form'>
			<div className='usrname-input'>
				<label htmlFor="username">
					{messages.register.usrname}
				</label>
				<input
					type="text"
					id="username"
					name="username"
					onChange={handleInputChange}
					value={data.username}
					required
					autoComplete='off'
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
						value={data.email}
						required
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
					value={data.password}
					required
				/>
			</div>
			<button type='submit' id='submit' className='submit' onClick={handleAudio}>
				{register ? messages.register.cta : messages.login.cta}
			</button>
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
		</form>
	)
}
