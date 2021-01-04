import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TitleContext } from '../../App';
import { AuthStoreContext } from '../../stores';
import './style.scss';

const ChangePin = observer(() => {
	const { setTitle } = useContext(TitleContext);
	const authStore = useContext(AuthStoreContext);
	useEffect(() => {
		setTitle('Change Pin');
	}, [setTitle]);

	const [history] = useState(useHistory());
	const [currentPin, setCurrentPin] = useState('');
	const [newPin, setNewPin] = useState('');

	const setPinCallback = useCallback(async () => {
		await axios.put('/keypair/change', { currentPin, newPin });
		history.push('/');
	}, [currentPin, newPin]);

	return (
		<>
			<h1>Change Pin</h1>
			<div>
				<table className="table-pin">
					<tr>
						<td>Current Pin</td>
						<td>
							<TextField
								label="6 Digit PINs"
								variant="outlined"
								value={currentPin}
								onChange={(e) => {
									const regex = /^([0-9]){0,6}$/i;
									if (regex.test(e.target.value)) {
										setCurrentPin(e.target.value);
									}
								}}
								fullWidth
							/>
						</td>
					</tr>
					<tr>
						<td>Choose New Pin</td>
						<td>
							<TextField
								label="6 Digit PINs"
								variant="outlined"
								value={newPin}
								onChange={(e) => {
									const regex = /^([0-9]){0,6}$/i;
									if (regex.test(e.target.value)) {
										setNewPin(e.target.value);
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

export default ChangePin;
