import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import QrReader from 'react-qr-reader';
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
	const [openQR, setOpenQR] = useState(false);
	const scanPatient = useCallback((data: string | null) => {
		if (data) {
			const qr = JSON.parse(data);
			if (qr.userId && qr.serviceId) {
				setUserId(qr.userId);
				setServiceId(qr.serviceId);
				setOpenQR(false);
			}
		}
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
	const [openGiveSpecialToken, setOpenGiveSpecialToken] = useState(false);
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

	const [openRequestRedeem, setOpenRequestRedeem] = useState(false);
	const [amount, setAmount] = useState('1');
	const [pollingId, setPollingId] = useState(0);
	const requestRedeem = useCallback(async () => {
		if (userId && serviceId) {
			const {
				data: { id },
			} = await axios.post<{ id: number }>('/healthcare-token/redeem-request', {
				userId,
				serviceId,
				pin,
				amount,
			});
			setPollingId(id);
		}
	}, [userId, serviceId, amount, pin]);

	const [timer, setTimer] = useState<NodeJS.Timeout>();
	useEffect(() => {
		if (pollingId) {
			const timer = setInterval(async () => {
				const {
					data: { isConfirmed },
				} = await axios.get<{ isConfirmed: boolean }>('/healthcare-token/redeem-check', {
					params: {
						id: pollingId,
					},
				});
				if (isConfirmed) {
					setPollingId(0);
					clearInterval(timer);
					setUserId(0);
					setServiceId(0);
					setScan(null);
					setSpecialToken(null);
				}
			}, 5000);
			setTimer(timer);
		}
	}, [pollingId]);

	const cancelRequestRedeem = useCallback(async () => {
		if (pollingId) {
			await axios.delete('/healthcare-token/redeem-request', {
				params: { id: pollingId },
			});
			setPollingId(0);
			setUserId(0);
			setServiceId(0);
			setScan(null);
			setSpecialToken(null);
			if (timer) clearInterval(timer);
		}
	}, [pollingId, timer]);

	return (
		<>
			<h1>Scan Patient Info</h1>
			<div>
				<div className="center">
					<Button
						onClick={() => {
							setOpenQR(true);
						}}
						variant="contained"
						color="primary"
						size="large"
					>
						Scan
					</Button>
				</div>
				{openQR && (
					<QrReader
						className="qr-image-wrapper"
						showViewFinder={false}
						delay={300}
						onError={(e) => {
							console.log(e);
						}}
						onScan={scanPatient}
						style={{ width: '100%' }}
					/>
				)}
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
									<Button
										onClick={() => {
											setOpenRequestRedeem(true);
										}}
										variant="contained"
										color="primary"
										size="large"
									>
										Request Redeem
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
									<TableCell>Service Name</TableCell>
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
														setOpenGiveSpecialToken(true);
													}}
													variant="contained"
													color="primary"
													size="small"
												>
													Give Service
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
				open={openGiveSpecialToken}
				fullWidth
				maxWidth="sm"
				onClose={() => {
					setOpenGiveSpecialToken(false);
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
						<div className="mt-15">
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
								fullWidth
							/>
						</div>
						<div className="align-right mt-15">
							<Button
								onClick={async () => {
									await giveSpecialToken();

									setOpenGiveSpecialToken(false);
									setPin('');
								}}
								variant="contained"
								color="secondary"
								size="large"
							>
								Give Service
							</Button>
						</div>
					</DialogContentText>
				</DialogContent>
			</Dialog>
			<Dialog
				open={openRequestRedeem}
				fullWidth
				maxWidth="sm"
				onClose={() => {
					setOpenRequestRedeem(false);
					setPin('');
					setAmount('1');
				}}
			>
				<DialogTitle>Request Redeem Service</DialogTitle>
				<DialogContent>
					<DialogContentText>
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
						<div className="mt-15">
							<TextField
								label="Amount"
								variant="outlined"
								value={amount}
								onChange={(e) => {
									const regex = /^([0-9]){0,6}$/i;
									if (regex.test(e.target.value)) {
										setAmount(e.target.value);
									}
								}}
								className="mt-15"
								fullWidth
							/>
						</div>
						<div className="mt-15">
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
								fullWidth
							/>
						</div>
						<div className="align-right mt-15">
							<Button
								onClick={async () => {
									await requestRedeem();

									setOpenRequestRedeem(false);
									setPin('');
									setAmount('1');
								}}
								variant="contained"
								color="secondary"
								size="large"
							>
								Request Redeem Service
							</Button>
						</div>
					</DialogContentText>
				</DialogContent>
			</Dialog>
			<Dialog open={pollingId > 0} fullWidth maxWidth="sm">
				<DialogTitle>Waiting Patient Enter the PIN</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<div className="center">
							<CircularProgress />
						</div>
						<div className="align-right mt-15">
							<Button onClick={cancelRequestRedeem} variant="contained" color="secondary" size="large">
								Cancel Request Redeem
							</Button>
						</div>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Scanner;
