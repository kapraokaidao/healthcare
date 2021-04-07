import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TitleContext } from '../../App';
import { Bill, Hospital, Token } from '../../types';
import './style.scss';

type FilterToken = {
	isActive?: boolean;
	tokenType?: Token;
};

const BillTable = () => {
	const { setTitle } = useContext(TitleContext);
	useEffect(() => {
		setTitle('Bill Table');
	}, [setTitle]);
	const [pageCount, setPageCount] = useState(1);
	const [page, setPage] = useState(1);
	const [bills, setBill] = useState<Bill[]>([]);
	const [history] = useState(useHistory());
	const [fetchData, setFetchData] = useState(false);

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
	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};
	const [hospitals, setHospitals] = useState<Hospital[]>([]);
	const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
	const [selectedStartDate, setSelectedStartDate] = useState(new Date());
	const [selectedEndDate, setSelectedEndDate] = useState(new Date());
	const [serviceName, setServiceName] = useState('');
	const [checkHospital, setCheckHospital] = useState(false);
	const [checkServiceName, setCheckServiceName] = useState(false);
	const [checkStartDate, setCheckStartDate] = useState(false);
	const [checkEndDate, setCheckEndDate] = useState(false);
	useEffect(() => {
		const filter: any = {};
		if (checkHospital && selectedHospital) filter['hospitalCode'] = selectedHospital.code9;
		if (checkServiceName) filter['serviceName'] = serviceName;
		if (checkStartDate) filter['startDate'] = selectedStartDate.toISOString().split('T')[0];
		if (checkEndDate) filter['endDate'] = selectedEndDate.toISOString().split('T')[0];
		axios
			.post('/bill/search', {
				page,
				pageSize: 20,
				...filter,
			})
			.then(({ data }) => {
				setBill(data.data);
				setPage(data.page);
				setPageCount(data.pageCount);
			});
	}, [
		page,
		checkHospital,
		checkServiceName,
		checkStartDate,
		checkEndDate,
		fetchData,
		selectedHospital,
		serviceName,
		selectedStartDate,
		selectedEndDate,
	]);
	return (
		<>
			<h1>Bill Table</h1>

			<table>
				<tr>
					<td>
						<Checkbox
							checked={checkHospital}
							onChange={(e) => {
								setCheckHospital(e.target.checked);
							}}
							color="primary"
						/>
					</td>
					<td>Hospital</td>
					<td>
						<Autocomplete
							value={selectedHospital}
							onChange={(_, newValue) => {
								console.log(newValue);
								setSelectedHospital(newValue);
							}}
							onInputChange={(_, newInputValue) => {
								fetchHospital(newInputValue);
							}}
							options={hospitals}
							getOptionLabel={(option) => option.fullname || ''}
							style={{ width: 200 }}
							renderInput={(params) => <TextField {...params} variant="outlined" />}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<Checkbox
							checked={checkServiceName}
							onChange={(e) => {
								setCheckServiceName(e.target.checked);
							}}
							color="primary"
						/>
					</td>
					<td>Service Name</td>
					<td>
						<Input
							placeholder="optional"
							onChange={(e) => {
								setServiceName(e.target.value);
							}}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<Checkbox
							checked={checkStartDate}
							onChange={(e) => {
								setCheckStartDate(e.target.checked);
							}}
							color="primary"
						/>
					</td>
					<td>Start Date</td>
					<td>
						<TextField
							type="date"
							defaultValue={selectedStartDate.toISOString().split('T')[0]}
							onChange={(e) => {
								setSelectedStartDate(new Date(e.target.value));
							}}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<Checkbox
							checked={checkEndDate}
							onChange={(e) => {
								setCheckEndDate(e.target.checked);
							}}
							name="checkedB"
							color="primary"
						/>
					</td>
					<td>End Date</td>
					<td>
						<TextField
							type="date"
							defaultValue={selectedEndDate.toISOString().split('T')[0]}
							onChange={(e) => {
								setSelectedEndDate(new Date(e.target.value));
							}}
						/>
					</td>
				</tr>
			</table>

			<div style={{ height: 700, width: '100%' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Bill ID</TableCell>
							<TableCell>Hospital</TableCell>
							<TableCell>Created Date</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{bills.map((bill) => {
							return (
								<TableRow key={`row-${bill.id}`}>
									<TableCell>{bill.id}</TableCell>
									<TableCell>{bill.hospital?.fullname}</TableCell>
									<TableCell>{dayjs(bill.createdDate).format('DD/MM/YYYY H:mm')}</TableCell>
									<TableCell>
										<Button
											onClick={() => {
												history.push(`/bill/${bill.id}`);
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
		</>
	);
};

export default BillTable;
