import React, { useCallback, useContext, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { TokenDetail, Token, User } from '../../types';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './style.scss';
import Select from '@material-ui/core/Select';
import { useHistory } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import MenuItem from '@material-ui/core/MenuItem';
import { TitleContext } from '../../App';

const KYC = () => {
	const { setTitle } = useContext(TitleContext);
	useEffect(() => {
		setTitle('Manage KYC');
	}, [setTitle]);
	const [pageCount, setPageCount] = useState(1);
	const [page, setPage] = useState(1);
	const [users, setUsers] = useState<User[]>([]);
	const [history] = useState(useHistory());

	useEffect(() => {
		axios
			.get('/user/kyc', {
				params: {
					page,
					pageSize: 20,
					approved: false,
					ready: true,
				},
			})
			.then(({ data }) => {
				setUsers(data.data);
				setPage(data.page);
				setPageCount(data.pageCount);
			});
	}, [page]);

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	return (
		<>
			<Grid container spacing={3}>
				<h1>KYC Pending List</h1>
			</Grid>

			<div style={{ height: 700, width: '100%' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>National Id</TableCell>
							<TableCell>Firstname</TableCell>
							<TableCell>Last Name</TableCell>
							<TableCell>Gender</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => {
							return (
								<TableRow>
									<TableCell>{user.patient?.nationalId}</TableCell>
									<TableCell>{user.firstname}</TableCell>
									<TableCell>{user.lastname}</TableCell>
									<TableCell>{user.patient?.gender}</TableCell>
									<TableCell>
										<Button
											onClick={() => {
												history.push(`/kyc/${user.id}`);
											}}
											variant="contained"
											color="primary"
											size="small"
										>
											View
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
		</>
	);
};

export default KYC;
