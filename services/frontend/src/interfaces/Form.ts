export interface FormProps {
	register: boolean,
	profile: boolean,
}

export interface FormData {
	name: string,
	email?: string,
	password: string,
}