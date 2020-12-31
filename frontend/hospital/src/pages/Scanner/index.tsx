import Button from '@material-ui/core/Button';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TitleContext } from '../../App';
import { User } from '../../types';
import './style.scss';

const Scanner = () => {
	const { setTitle } = useContext(TitleContext);
	useEffect(() => {
		setTitle('Scanner');
	}, [setTitle]);

	const [user, setUser] = useState<User | null>(null);
	const scanPatient = useCallback(async () => {
		const { data } = await axios.get<User>(`/user/60000`);
		setUser(data);
	}, []);

	return (
		<>
			<h1>Scan Patient Info</h1>
			<div>
				<div className="center">
					<Button onClick={scanPatient} variant="contained" color="primary" size="large">
						Scan
					</Button>
				</div>
				<div className="patient-info mt-15">
					<div>
						<h2>Info</h2>
						<table>
							<tr>
								<td>National Id</td>
								<td>{user?.patient?.nationalId}</td>
							</tr>
							<tr>
								<td>Firstname</td>
								<td></td>
							</tr>
							<tr>
								<td>Lastname</td>
								<td></td>
							</tr>
							<tr>
								<td>Gender</td>
								<td></td>
							</tr>
							<tr>
								<td>Birth Date</td>
								<td></td>
							</tr>
							<tr>
								<td colSpan={2}>Selfie Image</td>
							</tr>
						</table>
					</div>
					<div>123</div>
				</div>
			</div>
		</>
	);
};

export default Scanner;
