import React, { useCallback, useContext, useState } from 'react';
import { AuthStoreContext } from '../../stores';
import { observer } from 'mobx-react-lite';
import { SigninType } from '../../stores/AuthStore';
import { Link, useHistory } from 'react-router-dom';
import nhso from '../../images/nhso.png';
import Button from '@material-ui/core/Button';
import './style.scss';
import TextField from '@material-ui/core/TextField';

const initialValue: SigninType = {
	username: '',
	password: '',
};

const Signin = observer(() => {
	const authStore = useContext(AuthStoreContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [history] = useState(useHistory());

	const signin = useCallback(async () => {
		const res = await authStore.signin({ username, password });
		if (res) history.push('/');
	}, [history, username, password]);

	return (
		<>
			<div className="signin">
				<div>
					<div className="center">
						<img src={nhso} />
					</div>
					<div className="mt-15">
						<TextField
							id="outlined-username-input"
							label="Username"
							variant="outlined"
							onChange={(e) => setUsername(e.target.value)}
							fullWidth
						/>
					</div>
					<div className="mt-15">
						<TextField
							id="outlined-password-input"
							label="Password"
							type="password"
							variant="outlined"
							onChange={(e) => setPassword(e.target.value)}
							fullWidth
						/>
					</div>
					<div className="center mt-15">
						<Button variant="contained" onClick={signin} color="primary" size="large">
							Login
						</Button>
					</div>
				</div>
			</div>
		</>
	);
});

export default Signin;
