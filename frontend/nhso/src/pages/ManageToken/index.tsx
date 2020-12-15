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

const ManageToken = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	useEffect(() => {
		// axios
		// 	.post('/user/search', {
		// 		page: 0,
		// 		pageSize: 0,
		// 		user: {},
		// 	})
		// 	.then(({ data: { data } }) => {
		// 		setUsers(data);
		// 	});
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

	const columns: ColDef[] = useMemo(() => {
		return [
			{ field: 'id', hide: true },
			{ field: 'name', headerName: 'name', flex: 0.1 },
			{ field: 'assetName', headerName: 'Asset Name', flex: 0.1 },
			{ field: 'isActive', headerName: 'Is Active', flex: 0.1 },
			{ field: 'quantity', headerName: 'Quantity', flex: 0.1 },
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

	return (
		<>
			<Grid container spacing={3}>
				<Grid item xs>
					<h1>Token List</h1>
				</Grid>
				<Grid>
					<div className="height-full center">
						<IconButton color="primary">
							<AddIcon fontSize="large" />
						</IconButton>
					</div>
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

export default ManageToken;
