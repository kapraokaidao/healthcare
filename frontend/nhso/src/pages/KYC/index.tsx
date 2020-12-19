import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { DataGrid, ColDef, ValueFormatterParams } from '@material-ui/data-grid';
import { Role, Gender, User } from '../../types';
import axios from 'axios';
import './style.scss';
import { useHistory } from 'react-router-dom';

type Row = {
	id: number;
	nationalId: string;
	firstname: string;
	surname: string;
	gender: Gender;
};

const KYC = () => {
	const [history] = useState(useHistory());
	const [users, setUsers] = useState<User[]>([]);
	useEffect(() => {
		axios
			.get('/user/kyc', {
				params: {
					page: 0,
					pageSize: 0,
					approved: false,
					ready: true,
				},
			})
			.then(({ data: { data } }) => {
				setUsers(data);
			});
	}, []);

	const rows = useMemo(() => {
		const data: Row[] = [];
		for (const user of users) {
			if (user.patient) {
				data.push({
					id: user.id,
					nationalId: user.patient.nationalId,
					firstname: user.firstname,
					surname: user.surname,
					gender: user.patient.gender,
				});
			}
		}
		return data;
	}, [users]);

	const columns: ColDef[] = useMemo(() => {
		return [
			{ field: 'id', hide: true },
			{ field: 'nationalId', headerName: 'National ID', width: 150 },
			{ field: 'firstname', headerName: 'First Name', width: 120 },
			{ field: 'surname', headerName: 'Surname', width: 120 },
			{ field: 'gender', headerName: 'Gender', flex: 0.2 },
			{
				field: '',
				headerName: '',
				width: 100,
				disableClickEventBubbling: true,
				renderCell: (params: ValueFormatterParams) => {
					const onClick = () => {
						const row = params.row as Row;
						history.push(`/kyc/${row.id}`);
					};
					return (
						<strong>
							<Button onClick={onClick} variant="contained" color="primary" size="small">
								View
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
				<h1>KYC Pending List</h1>
			</Grid>

			<div style={{ height: 700, width: '100%' }}>
				<DataGrid rows={rows} columns={columns} pageSize={20} rowsPerPageOptions={[5, 10, 20]} pagination />
			</div>
		</>
	);
};

export default KYC;
