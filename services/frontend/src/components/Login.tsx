import { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router'
import type { RegisterData } from '../interfaces/Register';

export default function Login() {
	const [data, setData] = useState<RegisterData>({
		username: '',
		email: '',
		password: ''
	});

	function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		setData(prev => ({ ...prev, [name]: value}));
	}

	// function handleSubmit(e: FormEvent<HTMLFormElement>): void {
	// 	e.preventDefault()
	// 	// Handle form submission logic here
	// 	console.log('Form submitted:', data)
	// }

	return (
		<form className='form'>
			<label htmlFor="username">
				NOM UTILISATEUR
				<input
					type="text"
					id="username"
					name="username"
					onChange={handleInputChange}
					value={data.username}
					required
				/>
			</label>
			<label htmlFor="password">
				MOT DE PASSE
				<input
				type="password"
				id="password"
				name="password"
				onChange={handleInputChange}
				value={data.password}
				required
				/>
			</label>
			<button type='submit'>S'INSCRIRE</button>
			<p>Pas encore de compte? <Link to="/register">Enregistrez-vous</Link></p>
		</form>
	)
}
