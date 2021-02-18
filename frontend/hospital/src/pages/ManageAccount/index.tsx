import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TitleContext } from '../../App';
import { Gender, Role, User } from '../../types';
import './style.scss';

type CustomRole = Role | 'None';

type FilterUser = {
	firstname?: string;
	lastname?: string;
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

const ManageAccount = () => {
	const { setTitle } = useContext(TitleContext);
	useEffect(() => {
		setTitle('Manage Account');
	}, [setTitle]);
	const [pageCount, setPageCount] = useState(1);
	const [page, setPage] = useState(1);
	const [users, setUsers] = useState<User[]>([]);
	const [filterUser, setFilterUser] = useState<FilterUser>({});
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [history] = useState(useHistory());
	const [open, setOpen] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [fetchData, setFetchData] = useState(false);
	useEffect(() => {
		axios
			.post('/hospital/hospital-account/search', {
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
			await axios.delete(`/hospital/hospital-account/${selectedUser.id}`);
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
					<h1>Manage Account</h1>
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
				<Grid item xs={11}>
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
								<td>Last Name</td>
								<td>
									<Input
										placeholder="optional"
										onChange={(e) => {
											const user = filterUser;
											user.lastname = e.target.value;
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
							<TableCell>Last Name</TableCell>
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
									<TableCell>{user.lastname}</TableCell>
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
								<td>Firstname</td>
								<td>{selectedUser?.firstname}</td>
							</tr>
							<tr>
								<td>Last Name</td>
								<td>{selectedUser?.lastname}</td>
							</tr>
							<tr>
								<td>Address</td>
								<td>{selectedUser?.address}</td>
							</tr>
							<tr>
								<td>Phone</td>
								<td>{selectedUser?.phone}</td>
							</tr>
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

export default ManageAccount;
