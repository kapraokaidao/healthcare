import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { Role, Gender, User } from '../../types';
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
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';

type CustomRole = Role | 'None';

type FilterUser = {
	firstname?: string;
	surname?: string;
	role?: Role;
	phone?: string;
	address?: string;
	nhso?: {
		id?: number;
	};
	hospital?: {
		name?: string;
		hid?: number;
	};
	patient?: {
		nationalId?: string;
		gender?: Gender;
		birthDate?: Date;
	};
};

const AccountList = () => {
	const [pageCount, setPageCount] = useState(1);
	const [page, setPage] = useState(1);
	const [users, setUsers] = useState<User[]>([]);
	const [filterRole, setFilterRole] = useState<CustomRole>('None');
	const [filterUser, setFilterUser] = useState<FilterUser>({});
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [history] = useState(useHistory());
	const [open, setOpen] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [fetchData, setFetchData] = useState(false);
	useEffect(() => {
		console.log(filterUser);
		axios
			.post('/user/search', {
				page,
				pageSize: 20,
				user: filterUser || {},
			})
			.then(({ data }) => {
				setUsers(data.data);
				setPage(data.page);
				setPageCount(data.pageCount);
			});
	}, [page, filterUser, fetchData]);

	const viewUserDetail = useCallback((user: User) => {
		setSelectedUser(user);
		setOpen(true);
	}, []);

	const deleteUser = useCallback(async () => {
		if (selectedUser) {
			await axios.delete(`/user/${selectedUser.id}`);
			setFetchData(!fetchData);
			setConfirm(false);
		}
	}, [selectedUser, page]);

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	return (
		<>
			<Grid container spacing={3}>
				<Grid item xs>
					<h1>Account List</h1>
				</Grid>
				<Grid>
					<div className="height-full center">
						<IconButton
							color="primary"
							onClick={() => {
								history.push('/account/create');
							}}
						>
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
							const role = e.target.value as CustomRole;
							setFilterRole(role);
							if (role === 'None') {
								setFilterUser({});
							} else {
								setFilterUser({ role });
							}
							(document.getElementById('base-filter') as HTMLFormElement).reset();
						}}
					>
						<option value={'None'}>None</option>
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
								<td>Hospital ID</td>
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
				</Grid>
				<Grid item xs={1}>
					<Button
						onClick={() => {
							setFetchData(!fetchData);
						}}
						variant="contained"
						color="primary"
						size="small"
					>
						Filter
					</Button>
				</Grid>
			</Grid>

			<div style={{ height: 700, width: '100%' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>First Name</TableCell>
							<TableCell>Surname</TableCell>
							<TableCell>Role</TableCell>
							<TableCell>Phone</TableCell>
							<TableCell>Address</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => {
							return (
								<TableRow>
									<TableCell>{user.firstname}</TableCell>
									<TableCell>{user.surname}</TableCell>
									<TableCell>{user.role}</TableCell>
									<TableCell>{user.phone}</TableCell>
									<TableCell>{user.address}</TableCell>
									<TableCell>
										<Button
											onClick={() => {
												viewUserDetail(user);
											}}
											variant="contained"
											color="primary"
											size="small"
										>
											Detail
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				<div className="center mt-15">
					<Pagination
						count={pageCount}
						defaultPage={page}
						onChange={handlePageChange}
						size="large"
						showFirstButton
						showLastButton
						color="primary"
					/>
				</div>
			</div>

			<Dialog
				open={open}
				keepMounted
				onClose={() => {
					setOpen(false);
				}}
				fullWidth
				maxWidth="sm"
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
								<td>{selectedUser?.address}</td>
							</tr>
							<tr>
								<td>Phone</td>
								<td>{selectedUser?.phone}</td>
							</tr>
							{selectedUser?.patient && (
								<>
									<tr>
										<td>National Id</td>
										<td>{selectedUser.patient.nationalId}</td>
									</tr>
									<tr>
										<td>Gender</td>
										<td>{selectedUser.patient.gender}</td>
									</tr>
									<tr>
										<td>BirthDate</td>
										<td>{selectedUser.patient.birthDate}</td>
									</tr>
								</>
							)}
							{selectedUser?.hospital && (
								<>
									<tr>
										<td>Hospital Id</td>
										<td>{selectedUser.hospital.hid}</td>
									</tr>
									<tr>
										<td>Hospital Name</td>
										<td>{selectedUser.hospital.name}</td>
									</tr>
								</>
							)}
						</table>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setOpen(false);
						}}
						color="primary"
					>
						Close
					</Button>
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
