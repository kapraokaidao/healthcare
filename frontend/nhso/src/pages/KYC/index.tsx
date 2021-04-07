import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TitleContext } from '../../App';
import { User } from '../../types';
import './style.scss';

type KYCData = {
	id: number;
	type: 'RegisterKyc' | 'ResetPasswordKyc';
	user: User;
	nationalIdImage: string;
	selfieImage: string;
};

const KYC = () => {
	const { setTitle } = useContext(TitleContext);
	useEffect(() => {
		setTitle('Manage KYC');
	}, [setTitle]);
	const [pageCount, setPageCount] = useState(1);
	const [fetchData, setFetchData] = useState(false);
	const [page, setPage] = useState(1);
	const [kycs, setKYCs] = useState<KYCData[]>([]);
	const [kycType, setKycType] = useState<string>('RegisterKyc');

	useEffect(() => {
		axios
			.get('/user/kyc', {
				params: {
					page,
					pageSize: 20,
					approved: false,
					ready: true,
					type: kycType,
				},
			})
			.then(({ data }) => {
				setKYCs(data.data);
				setPage(data.page);
				setPageCount(data.pageCount);
			});
	}, [fetchData, page, kycType]);

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const [selectedKYC, setSelectedKYC] = useState<KYCData | null>(null);
	const approve = useCallback(async () => {
		if (kycType === 'RegisterKyc') {
			await axios.post(`/user/${selectedKYC?.id}/kyc/approve`);
		} else {
			await axios.post(`/user/password/reset/${selectedKYC?.id}/approve`);
		}
		setSelectedKYC(null);
		setFetchData(!fetchData);
	}, [selectedKYC, kycType]);

	const reject = useCallback(async () => {
		if (kycType === 'RegisterKyc') {
			await axios.post(`/user/${selectedKYC?.id}/kyc/reject`);
		} else {
			await axios.post(`/user/password/reset/${selectedKYC?.id}/reject`);
		}
		setSelectedKYC(null);
		setFetchData(!fetchData);
	}, [selectedKYC, kycType]);

	const typeMessage = useCallback((kyc: KYCData | null) => {
		if (kyc) {
			if (kyc.type === 'RegisterKyc') return 'New Account';
			return 'Foget PIN';
		}
		return '';
	}, []);

	return (
		<>
			<Grid container spacing={3}>
				<h1>KYC Pending List</h1>
			</Grid>
			<h4 style={{ marginTop: 20 }}>Select Type of KYC: </h4>
			<Select native onChange={(e) => setKycType(String(e.target.value))} style={{ marginBottom: 20 }}>
				<option value={'RegisterKyc'}>RegisterKyc</option>
				<option value={'ResetPasswordKyc'}>ResetPasswordKyc</option>
			</Select>
			<div style={{ height: 700, width: '100%' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>National Id</TableCell>
							<TableCell>Firstname</TableCell>
							<TableCell>Last Name</TableCell>
							<TableCell>Gender</TableCell>
							<TableCell>Type</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{kycs.map((kyc) => {
							return (
								<TableRow>
									<TableCell>{kyc.user.patient?.nationalId}</TableCell>
									<TableCell>{kyc.user.firstname}</TableCell>
									<TableCell>{kyc.user.lastname}</TableCell>
									<TableCell>{kyc.user.patient?.gender}</TableCell>
									<TableCell>{typeMessage(kyc)}</TableCell>
									<TableCell>
										<Button
											onClick={() => {
												setSelectedKYC(kyc);
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
			<Dialog
				open={selectedKYC !== null}
				onClose={() => {
					setSelectedKYC(null);
				}}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle>
					{selectedKYC?.user.firstname} {selectedKYC?.user.lastname}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<table>
							<tr>
								<td className="min-width">Type</td>
								<td>{typeMessage(selectedKYC)}</td>
							</tr>
							<tr>
								<td>National Id</td>
								<td>{selectedKYC?.user.patient?.nationalId}</td>
							</tr>
							<tr>
								<td>First name</td>
								<td>{selectedKYC?.user.firstname}</td>
							</tr>
							<tr>
								<td>Last Name</td>
								<td>{selectedKYC?.user.lastname}</td>
							</tr>
							<tr>
								<td>Gender</td>
								<td>{selectedKYC?.user.patient?.gender}</td>
							</tr>
							<tr>
								<td>Birthdate</td>
								<td>{selectedKYC?.user.patient?.birthDate}</td>
							</tr>
							<tr>
								<td>Address</td>
								<td>{selectedKYC?.user.address}</td>
							</tr>
							<tr>
								<td>Phone Number</td>
								<td>{selectedKYC?.user.phone}</td>
							</tr>
							<tr>
								<td>National Id Image</td>
								<td>
									<img src={selectedKYC?.nationalIdImage} className="w-full" />
								</td>
							</tr>
							<tr>
								<td>Selfie Image</td>
								<td>
									<img src={selectedKYC?.selfieImage} className="w-full" />
								</td>
							</tr>
						</table>

						<div className="mt-15 text-right">
							<Button variant="contained" color="secondary" size="large" onClick={reject}>
								Reject
							</Button>
							<Button variant="contained" color="primary" size="large" onClick={approve}>
								Approve
							</Button>
						</div>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default KYC;
