import Form from '../components/Form';
import Settings from '../components/Settings';

export default function Login() {
	return (
		<div className='auth-form'>
			<Settings />
			<Form register={false} />
		</div>
	)
}
