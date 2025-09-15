import { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router'
import type { FormData } from "../interfaces/Form"
import '../styles/index.css'

export default function Login() {
	const [data, setData] = useState<FormData>({
		username: '',
		password: ''
	});

	function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		setData((prev: FormData) => ({ ...prev, [name]: value}));
	}

	const playSound = () => {
		const audio = new Audio('../assets/start.mp3')
		audio.play()
	}

	async function handleNoises() {
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
		<>
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
			<button type='submit' id='submit' className='submit' onClick={handleNoises}>
				SE CONNECTER
			</button>
			<span>Pas encore de compte? 
				<Link to="/register" id='link' className='link'>Enregistrez-vous</Link>
			</span>
		</form>
			<button onClick={playSound}>qwerqwerqe</button>
		</>
	)
}
