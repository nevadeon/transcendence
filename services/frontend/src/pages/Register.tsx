import Form from '../components/Form'
import Settings from '../components/Settings'

export default function Register() {
	return (
		<div className='auth-form'>
			<Settings />
			<Form register={true} />
		</div>
	)
}
