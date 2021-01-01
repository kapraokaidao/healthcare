import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TitleContext } from '../../App';
import { TokenDetail, User } from '../../types';
import './style.scss';

type ScanPatient = {
	balance: number;
	user: User;
	healthcareToken: TokenDetail;
};

const Scanner = () => {
	const { setTitle } = useContext(TitleContext);
	useEffect(() => {
		setTitle('Scanner');
	}, [setTitle]);

	const [userId, setUserId] = useState(0);
	const [serviceId, setServiceId] = useState(0);
	const scanPatient = useCallback(async () => {
		setUserId(230);
		setServiceId(318);
	}, []);

	const [scan, setScan] = useState<ScanPatient | null>(null);
	useEffect(() => {
		if (userId && serviceId) {
			axios
				.get<ScanPatient>('/healthcare-token/verify', {
					params: {
						userId,
						serviceId,
					},
				})
				.then(({ data }) => setScan(data));
		}
	}, [userId, serviceId]);

	const [specialToken, setSpecialToken] = useState<TokenDetail[] | null>(null);
	useEffect(() => {
		if (userId) {
			axios
				.get<TokenDetail[]>(`/healthcare-token/special-token/valid/${userId}`)
				.then(({ data }) => setSpecialToken(data));
		}
	}, [userId]);

	const [selectedGiveSpecialToken, setSelectedGiveSpecialToken] = useState<TokenDetail | null>(null);
	const [open, setOpen] = useState(false);
	const [pin, setPin] = useState('');
	const giveSpecialToken = useCallback(async () => {
		if (selectedGiveSpecialToken) {
			await axios.post('/healthcare-token/special-token/request', {
				userId: userId,
				serviceId: selectedGiveSpecialToken.id,
				pin,
			});
		}
	}, [userId, pin, selectedGiveSpecialToken]);

	const requestToken = useCallback(() => {
		console.log('request token');
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
						<h2>Patient Info</h2>
						{scan?.user && (
							<table className="w-full">
								<tr>
									<td>National Id</td>
									<td>{scan?.user.patient?.nationalId}</td>
								</tr>
								<tr>
									<td>Firstname</td>
									<td>{scan?.user.firstname}</td>
								</tr>
								<tr>
									<td>Lastname</td>
									<td>{scan?.user.lastname}</td>
								</tr>
								<tr>
									<td>Gender</td>
									<td>{scan?.user.patient?.gender}</td>
								</tr>
								<tr>
									<td>Birth Date</td>
									<td>{scan?.user.patient?.birthDate}</td>
								</tr>
								<tr>
									<td colSpan={2}>
										<img src={scan?.user.patient?.selfieImage} className="w-full" />
									</td>
								</tr>
							</table>
						)}
					</div>

					<div>
						<h2>Current Balance: {scan?.balance}</h2>
						<hr />
						<h2>Service Info</h2>
						{scan?.healthcareToken && (
							<>
								<table className="w-full">
									<tr>
										<td>Service Name</td>
										<td>{scan?.healthcareToken.name}</td>
									</tr>
									<tr>
										<td>Description</td>
										<td>{scan?.healthcareToken.description}</td>
									</tr>
									<tr>
										<td>Age Range</td>
										<td>
											{scan?.healthcareToken.startAge} - {scan?.healthcareToken.endAge}
										</td>
									</tr>
									<tr>
										<td>Gender</td>
										<td>{scan?.healthcareToken.gender}</td>
									</tr>
								</table>
								<hr />
								<div className="align-right">
									<Button onClick={requestToken} variant="contained" color="secondary" size="large">
										Request Token
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
				{specialToken && (
					<TableContainer component={Paper} className="mt-15">
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Token Name</TableCell>
									<TableCell align="right">Age Range</TableCell>
									<TableCell align="right">Gender</TableCell>
									<TableCell align="right">Description</TableCell>
									<TableCell align="right"></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{specialToken?.map((token) => {
									return (
										<TableRow key={`${token.id}special`}>
											<TableCell component="th" scope="row">
												{token.name}
											</TableCell>
											<TableCell align="right">
												{token.startAge} - {token.endAge}
											</TableCell>
											<TableCell align="right">{token.gender}</TableCell>
											<TableCell align="right">{token.description}</TableCell>
											<TableCell align="right">
												<Button
													onClick={() => {
														setSelectedGiveSpecialToken(token);
														setOpen(true);
													}}
													variant="contained"
													color="primary"
													size="small"
												>
													Give token
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</div>
			<Dialog
				open={open}
				fullWidth
				maxWidth="sm"
				onClose={() => {
					setOpen(false);
					setPin('');
				}}
			>
				<DialogTitle>ENTER YOUR PIN</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<table className="w-full">
							<tr>
								<td>Service Name</td>
								<td>{selectedGiveSpecialToken?.name}</td>
							</tr>
							<tr>
								<td>Description</td>
								<td>{selectedGiveSpecialToken?.description}</td>
							</tr>
							<tr>
								<td>Age Range</td>
								<td>
									{selectedGiveSpecialToken?.startAge} - {selectedGiveSpecialToken?.endAge}
								</td>
							</tr>
							<tr>
								<td>Gender</td>
								<td>{selectedGiveSpecialToken?.gender}</td>
							</tr>
						</table>
						<TextField
							label="6 Digit PINs"
							variant="outlined"
							value={pin}
							onChange={(e) => {
								const regex = /^([0-9]){0,6}$/i;
								if (regex.test(e.target.value)) {
									setPin(e.target.value);
								}
							}}
							className="mt-15"
							fullWidth
						/>
						<div className="align-right mt-15">
							<Button
								onClick={async () => {
									await giveSpecialToken();
									setPin('');
									setOpen(false);
								}}
								variant="contained"
								color="primary"
								size="large"
							>
								Give This Token
							</Button>
						</div>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Scanner;
