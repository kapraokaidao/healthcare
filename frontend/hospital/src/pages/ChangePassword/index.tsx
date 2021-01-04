import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TitleContext } from '../../App';
import { AuthStoreContext } from '../../stores';
import './style.scss';

const ChangePassword = observer(() => {
	const { setTitle } = useContext(TitleContext);
	const authStore = useContext(AuthStoreContext);
	useEffect(() => {
		setTitle('Change Password');
	}, [setTitle]);

	const [history] = useState(useHistory());
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');

	const changePasswordCallback = useCallback(async () => {
		if (authStore.user && currentPassword && newPassword) {
			await axios.post('/auth/password/change', {
				username: authStore.user?.username,
				password: currentPassword,
				newPassword,
			});
			history.push('/');
		}
	}, [authStore.user, currentPassword, newPassword]);

	return (
		<>
			<h1>Change Password</h1>
			<div>
				<table className="table-pin">
					<tr>
						<td>Current Password</td>
						<td>
							<TextField
								label="Current Password"
								variant="outlined"
								type="password"
								value={currentPassword}
								onChange={(e) => {
									setCurrentPassword(e.target.value);
								}}
								fullWidth
							/>
						</td>
					</tr>
					<tr>
						<td>Choose New Password</td>
						<td>
							<TextField
								label="New Password"
								variant="outlined"
								type="password"
								value={newPassword}
								onChange={(e) => {
									setNewPassword(e.target.value);
								}}
								fullWidth
							/>
						</td>
					</tr>
				</table>
				<div className="mt-15 align-right">
					<Button onClick={changePasswordCallback} variant="contained" color="primary" size="large">
						Change Password
					</Button>
				</div>
			</div>
		</>
	);
});

export default ChangePassword;
