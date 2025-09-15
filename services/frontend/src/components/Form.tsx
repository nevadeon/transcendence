import { useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import type { FormData } from "../interfaces/Form";

export default function Form({ register }: {register: boolean}) {
	const [data, setData] = useState<FormData>({
		username: '',
		email: '',
		password: ''
	});

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
					NOM UTILISATEUR
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
						ADRESSE MAIL
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
					MOT DE PASSE
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
				{register ? "S'INSCRIRE" : "SE CONNECTER"}
			</button>
			<span>
				{register ?
					<>
						Déjà un compte? 
						<Link to='/login' id='link' className='link'>Connectez-vous</Link>
					</> :
					<>
						Pas encore de compte? 
						<Link to="/register" id='link' className='link'>Enregistrez-vous</Link>
					</>
				}
			</span>
		</form>
	)
}
