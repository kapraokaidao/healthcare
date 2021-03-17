import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TitleContext } from '../../App';
import { Hospital, Role, UserCreate } from '../../types';

const CreateAccount = () => {
	const { setTitle } = useContext(TitleContext);
	useEffect(() => {
		setTitle('Create Account');
	}, [setTitle]);
	const history = useHistory();
	const [role, setRole] = useState<Role>('NHSO');
	const [account, setAccount] = useState<UserCreate>({
		role: 'NHSO',
		firstname: '',
		lastname: '',
		address: '',
		phone: '',
		username: '',
		password: '',
	});

	const createAccount = async () => {
		const sendAccount = account;
		if (role == 'Hospital' && selectedHospital !== null) {
			sendAccount.hospital = {
				code9: selectedHospital.code9,
			};
		}
		await axios.post('/user', sendAccount);
		history.push('/account');
	};
	const handleRoleChange = (event: { target: { value: string } }) => {
		const newRole = event.target.value as Role;
		setRole(newRole);
		setAccount({ ...account, ['role']: newRole });
	};
	const handleInputChange = (props: any) => (event: { target: { value: any } }) => {
		setAccount({ ...account, [props]: event.target.value });
	};

	const [hospitals, setHospitals] = useState<Hospital[]>([]);
	const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
	const fetchHospital = useCallback(
		debounce(async (name: string) => {
			const { data } = await axios.post('/hospital/search', {
				page: 1,
				pageSize: 100,
				hospital: {
					fullname: name,
				},
			});
			setHospitals(data.data);
		}, 1000),
		[]
	);
	useEffect(() => {
		fetchHospital('');
	}, []);
	useEffect(() => {
		if (selectedHospital) {
			const tmp = account;
			tmp.username = selectedHospital.code9;
			setAccount(tmp);
		}
	}, [selectedHospital]);

	return (
		<>
			<div className="sitehome">
				<div className="mt-15">
					<h1>Create Account</h1>
				</div>
				<div className="mt-15">
					<Grid container spacing={2}>
						<Grid item xs={4} container alignItems="flex-end">
							Role
						</Grid>
						<Grid item xs={8}>
							<NativeSelect
								value={account.role}
								onChange={handleRoleChange}
								variant="outlined"
								inputProps={{
									name: 'type',
									id: 'role-native-helper',
								}}
							>
								<option value={'NHSO'}>NHSO</option>
								<option value={'Hospital'}>Hospital</option>
							</NativeSelect>
						</Grid>
						{role === 'Hospital' && (
							<>
								<Grid item xs={4} container alignItems="flex-end">
									Hospital
								</Grid>
								<Grid item xs={8}>
									<Autocomplete
										value={selectedHospital}
										onChange={(_, newValue) => {
											setSelectedHospital(newValue);
										}}
										onInputChange={(_, newInputValue) => {
											fetchHospital(newInputValue);
										}}
										options={hospitals}
										getOptionLabel={(option) => option.fullname || ''}
										style={{ width: 300 }}
										renderInput={(params) => <TextField {...params} variant="outlined" />}
									/>
								</Grid>
							</>
						)}

						<Grid item xs={4} container alignItems="flex-end">
							Firstname
						</Grid>
						<Grid item xs={8}>
							<TextField
								id="outlined-firstname-input"
								label="Firstname"
								variant="outlined"
								value={account.firstname}
								onChange={handleInputChange('firstname')}
								fullWidth
							/>
						</Grid>
						<Grid item xs={4} container alignItems="flex-end">
							Lastname
						</Grid>
						<Grid item xs={8}>
							<TextField
								id="outlined-lastname-input"
								label="Last Name"
								variant="outlined"
								value={account.lastname}
								onChange={handleInputChange('lastname')}
								fullWidth
							/>
						</Grid>
						<Grid item xs={4} container alignItems="flex-end">
							Address
						</Grid>
						<Grid item xs={8}>
							<TextField
								id="outlined-address-input"
								label="Address"
								variant="outlined"
								value={account.address}
								onChange={handleInputChange('address')}
								fullWidth
							/>
						</Grid>
						<Grid item xs={4} container alignItems="flex-end">
							Phone
						</Grid>
						<Grid item xs={8}>
							<TextField
								id="outlined-phone-input"
								label="Phone"
								variant="outlined"
								value={account.phone}
								onChange={handleInputChange('phone')}
								fullWidth
							/>
						</Grid>
						<Grid item xs={4} container alignItems="flex-end">
							Username
						</Grid>
						<Grid item xs={8}>
							<TextField
								id="outlined-username-input"
								label="Username"
								variant="outlined"
								value={account.username}
								onChange={handleInputChange('username')}
								fullWidth
							/>
						</Grid>
						<Grid item xs={4} container alignItems="flex-end">
							Password
						</Grid>
						<Grid item xs={8}>
							<TextField
								id="outlined-password-input"
								label="Password"
								type="password"
								variant="outlined"
								value={account.password}
								onChange={handleInputChange('password')}
								fullWidth
							/>
						</Grid>
					</Grid>
				</div>
				<div className="mt-15 align-right">
					<Button
						color="primary"
						size="large"
						onClick={() => {
							history.push('/account');
						}}
					>
						Cancel
					</Button>
					<Button onClick={createAccount} variant="contained" color="primary" size="large">
						Create
					</Button>
				</div>
			</div>
		</>
	);
};
export default CreateAccount;
