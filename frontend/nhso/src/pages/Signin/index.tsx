import React, { useContext, useState } from 'react';
import { AuthStoreContext } from '../../stores';
import { observer } from 'mobx-react-lite';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { SigninType } from '../../stores/AuthStore';
import { Link, useHistory } from 'react-router-dom';
import nhso from '../../images/nhso.png';
import Button from '@material-ui/core/Button';
import './style.scss';

const initialValue: SigninType = {
	username: '',
	password: '',
};

const Signin = observer(() => {
	const authStore = useContext(AuthStoreContext);
	const [history] = useState(useHistory());
	const [errors, setErrors] = useState('');

	return (
		<>
			<img src={nhso} className="signin-image" />
			<Formik
				initialValues={initialValue}
				validationSchema={Yup.object({
					username: Yup.string().required('Required'),
					password: Yup.string().min(8, 'Must be more than 8 characters').required('Required'),
				})}
				onSubmit={async (values, { setSubmitting }) => {
					const response = await authStore.signin(values);
					setErrors(response);
					setSubmitting(false);
					if (response === true) history.push('/');
				}}
			>
				<Form className="signin-form">
					<Field name="username" type="text" placeholder="Username" className="mt-10" />
					<ErrorMessage name="username" />

					<Field name="password" type="password" placeholder="Password" className="mt-4" />
					<ErrorMessage name="password" />

					<Button variant="contained" color="primary">
						Login
					</Button>
				</Form>
			</Formik>
		</>
	);
});

export default Signin;
