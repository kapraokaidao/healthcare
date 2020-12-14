import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { DataGrid, ColDef, ValueFormatterParams } from '@material-ui/data-grid';
import { FilterUser, Role, Gender, User } from '../../types';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './style.scss';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import { useHistory } from 'react-router-dom';

const AccountList = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	useEffect(() => {
		axios
			.post('/user/search', {
				page: 0,
				pageSize: 0,
				user: {},
			})
			.then(({ data: { data } }) => {
				setUsers(data);
			});
	}, []);
	const [open, setOpen] = useState(false);
	const [confirm, setConfirm] = useState(false);

	const deleteUser = useCallback(async () => {
		if (selectedUser) {
			await axios.delete(`/user/${selectedUser.id}`);
			const {
				data: { data },
			} = await axios.post('/user/search', {
				page: 0,
				pageSize: 0,
				user: {},
			});
			setUsers(data);
			setConfirm(false);
		}
	}, []);
	const [history] = useState(useHistory());
	const createAccount = () => {
		history.push('/create-account');
	}

	const columns: ColDef[] = useMemo(() => {
		return [
			{ field: 'id', hide: true },
			{ field: 'firstname', headerName: 'First name', flex: 0.1 },
			{ field: 'surname', headerName: 'Surname', flex: 0.1 },
			{ field: 'role', headerName: 'Role', flex: 0.1 },
			{ field: 'phone', headerName: 'Phone', flex: 0.1 },
			{ field: 'address', headerName: 'Address', width: 150 },
			{
				field: '',
				headerName: '',
				width: 100,
				disableClickEventBubbling: true,
				renderCell: (params: ValueFormatterParams) => {
					const onClick = () => {
						setSelectedUser(params.row as User);
						setOpen(true);
					};
					return (
						<strong>
							<Button onClick={onClick} variant="contained" color="primary" size="small">
								Detail
							</Button>
						</strong>
					);
				},
			},
		];
	}, []);

	const [filterRole, setFilterRole] = useState<Role>('Patient');
	const [filterUser, setFilterUser] = useState<FilterUser>({ role: 'Patient' });

	const handleFilterUesrs = useCallback(async () => {
		const {
			data: { data },
		} = await axios.post('/user/search', {
			page: 0,
			pageSize: 0,
			user: filterUser,
		});
		setUsers(data);
	}, [filterUser]);

	return (
		<>
			<Grid container spacing={3}>
				<Grid item xs>
					<h1>Account List</h1>
				</Grid>
				<Grid>
					<div className="height-full center">
						<IconButton onClick={createAccount} color="primary">
							<AddIcon fontSize="large" />
						</IconButton>
					</div>
				</Grid>
			</Grid>

			<Grid container spacing={1}>
				<Grid item xs={2}>
					<Select
						native
						onChange={(e) => {
							const role = e.target.value as Role;
							setFilterRole(role);
							setFilterUser({ role });
							(document.getElementById('base-filter') as HTMLFormElement).reset();
						}}
					>
						<option value={'Patient'}>Patient</option>
						<option value={'NHSO'}>NHSO</option>
						<option value={'Hospital'}>Hospital</option>
					</Select>
				</Grid>
				<Grid item xs={4}>
					<form id="base-filter">
						<table>
							<tr>
								<td>First name</td>
								<td>
									<Input
										placeholder="optional"
										onChange={(e) => {
											const user = filterUser;
											user.firstname = e.target.value;
											setFilterUser(user);
										}}
									/>
								</td>
							</tr>
							<tr>
								<td>Surname</td>
								<td>
									<Input
										placeholder="optional"
										onChange={(e) => {
											const user = filterUser;
											user.surname = e.target.value;
											setFilterUser(user);
										}}
									/>
								</td>
							</tr>
							<tr>
								<td>Phone</td>
								<td>
									<Input
										placeholder="optional"
										onChange={(e) => {
											const user = filterUser;
											user.phone = e.target.value;
											setFilterUser(user);
										}}
									/>
								</td>
							</tr>
							<tr>
								<td>Address</td>
								<td>
									<Input
										placeholder="optional"
										onChange={(e) => {
											const user = filterUser;
											user.address = e.target.value;
											setFilterUser(user);
										}}
									/>
								</td>
							</tr>
						</table>
					</form>
				</Grid>
				<Grid item xs={5}>
					{filterRole === 'Patient' && (
						<table>
							<tr>
								<td>National Id</td>
								<td>
									<Input
										placeholder="optional"
										onChange={(e) => {
											const user = filterUser;
											if (!user.patient) user.patient = {};
											user.patient.nationalId = e.target.value;
											setFilterUser(user);
										}}
									/>
								</td>
							</tr>
							<tr>
								<td>Gender</td>
								<td>
									<Select
										native
										onChange={(e) => {
											const user = filterUser;
											if (!user.patient) user.patient = {};
											if (e.target.value !== '') {
												user.patient.gender = e.target.value as Gender;
											} else {
												delete user.patient.gender;
											}
											setFilterUser(user);
										}}
									>
										<option value={''}>-</option>
										<option value={'Male'}>Male</option>
										<option value={'Female'}>Female</option>
									</Select>
								</td>
							</tr>
							<tr>
								<td>Birth date</td>
								<td>
									<Input
										type="date"
										onChange={(e) => {
											const user = filterUser;
											if (!user.patient) user.patient = {};
											user.patient.birthDate = (e.target.value as unknown) as Date;
											setFilterUser(user);
										}}
									/>
								</td>
							</tr>
						</table>
					)}

					{filterRole === 'Hospital' && (
						<table>
							<tr>
								<td>Hospital Id</td>
								<td>
									<Input
										placeholder="optional"
										onChange={(e) => {
											const user = filterUser;
											if (!user.hospital) user.hospital = {};
											user.hospital.hid = Number(e.target.value);
											setFilterUser(user);
										}}
									/>
								</td>
							</tr>
							<tr>
								<td>Name</td>
								<td>
									<Input
										placeholder="optional"
										onChange={(e) => {
											const user = filterUser;
											if (!user.hospital) user.hospital = {};
											user.hospital.name = e.target.value;
											setFilterUser(user);
										}}
									/>
								</td>
							</tr>
						</table>
					)}

					{filterRole === 'NHSO' && (
						<table>
							<tr>
								<td>Id</td>
								<td>
									<Input
										placeholder="optional"
										onChange={(e) => {
											const user = filterUser;
											if (!user.nhso) user.nhso = {};
											user.nhso.id = Number(e.target.value);
											setFilterUser(user);
										}}
									/>
								</td>
							</tr>
						</table>
					)}
				</Grid>
				<Grid item xs={1}>
					<Button onClick={handleFilterUesrs} variant="contained" color="primary" size="small">
						Filter
					</Button>
				</Grid>
			</Grid>

			<div style={{ height: 700, width: '100%' }}>
				<DataGrid rows={users} columns={columns} pageSize={20} rowsPerPageOptions={[5, 10, 20]} pagination />
			</div>

			<Dialog
				open={open}
				keepMounted
				onClose={() => {
					setOpen(false);
				}}
			>
				<DialogTitle>{selectedUser?.firstname}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<table className="table-detail">
							<tr>
								<td>Role</td>
								<td>{selectedUser?.role}</td>
							</tr>
							<tr>
								<td>Firstname</td>
								<td>{selectedUser?.firstname}</td>
							</tr>
							<tr>
								<td>Surname</td>
								<td>{selectedUser?.surname}</td>
							</tr>
							<tr>
								<td>Gender</td>
								<td>{selectedUser?.patient?.gender || '-'}</td>
							</tr>
							<tr>
								<td>Address</td>
								<td>xx</td>
							</tr>
							<tr>
								<td>Phone</td>
								<td>{selectedUser?.phone}</td>
							</tr>
							<tr>
								<td>Created date</td>
								<td>{selectedUser?.createdDate}</td>
							</tr>
						</table>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setConfirm(true);
							setOpen(false);
						}}
						variant="contained"
						color="secondary"
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={confirm}
				keepMounted
				onClose={() => {
					setConfirm(false);
				}}
			>
				<DialogContent>
					<DialogContentText>
						<h1>Confirm to delete user ?</h1>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setConfirm(false);
						}}
						variant="contained"
						color="primary"
					>
						NO
					</Button>
					<Button onClick={deleteUser} variant="contained" color="secondary">
						YES
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AccountList;
