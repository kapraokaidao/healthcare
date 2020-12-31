import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TitleContext } from '../../App';
import { AuthStoreContext } from '../../stores';
import './style.scss';

const Pin = observer(() => {
	const { setTitle } = useContext(TitleContext);
	const authStore = useContext(AuthStoreContext);
	useEffect(() => {
		setTitle('Choose Your Pin');
	}, [setTitle]);

	const [history] = useState(useHistory());
	const [pin, setPin] = useState('');
	const setPinCallback = useCallback(async () => {
		await axios.post('/keypair', { pin });
		history.push('/');
	}, [pin]);

	return (
		<>
			<h1>Choose Your Pin</h1>
			<div>
				<table className="table-pin">
					<tr>
						<td>Hospital Name</td>
						<td>{authStore.user?.hospital?.fullname}</td>
					</tr>
					<tr>
						<td>Unit</td>
						<td>{authStore.user?.hospital?.unit}</td>
					</tr>
					<tr>
						<td>Type</td>
						<td>{authStore.user?.hospital?.type}</td>
					</tr>
					<tr>
						<td>Address</td>
						<td>
							{authStore.user?.hospital?.address} {authStore.user?.hospital?.moo}{' '}
							{authStore.user?.hospital?.tambon} {authStore.user?.hospital?.amphur}{' '}
							{authStore.user?.hospital?.province} {authStore.user?.hospital?.zipcode}
						</td>
					</tr>
					<tr>
						<td>Telephone</td>
						<td>{authStore.user?.hospital?.telephone}</td>
					</tr>
					<tr>
						<td>Choose Your Pin</td>
						<td>
							<TextField
								label="Pin"
								variant="outlined"
								value={pin}
								onChange={(e) => {
									const regex = /^([0-9]){0,6}$/i;
									if (regex.test(e.target.value)) {
										setPin(e.target.value);
									}
								}}
								fullWidth
							/>
						</td>
					</tr>
				</table>
				<div className="mt-15 align-right">
					<Button onClick={setPinCallback} variant="contained" color="primary" size="large">
						Set Pin
					</Button>
				</div>
			</div>
		</>
	);
});

export default Pin;
