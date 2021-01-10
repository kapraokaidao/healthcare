import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TitleContext } from '../../App';
import { BalanceDetail } from '../../types';
import './style.scss';

const Wallet = () => {
	const { setTitle } = useContext(TitleContext);
	useEffect(() => {
		setTitle('Manage Balance');
	}, [setTitle]);
	const [balance, setBalance] = useState<BalanceDetail[]>([]);
	const [selectedBalance, setSelectedBalance] = useState<BalanceDetail>();
	const [refetch, setRefetch] = useState(false);
	const [open, setOpen] = useState(false);
	const [pin, setPin] = useState('');
	const [amount, setAmount] = useState('');

	useEffect(() => {
		axios
			.get('/healthcare-token/balance', {
				params: {
					page: 1,
					pageSize: 1000,
				},
			})
			.then(({ data }) => {
				setBalance(data.data);
			});
	}, [refetch]);

	const withdrawToken = useCallback(async () => {
		await axios.post('/healthcare-token/withdraw', {
			serviceId: selectedBalance?.healthcareToken.id,
			pin,
			amount,
		});
		setRefetch(!refetch);
	}, [selectedBalance, amount, pin, refetch]);

	return (
		<>
			<h1>Wallet</h1>
			<Table className="table-wallet">
				<TableHead>
					<TableRow>
						<TableCell>
							<strong>Name</strong>
						</TableCell>
						<TableCell>
							<strong>Balance</strong>
						</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{balance.map((b) => {
						return (
							<TableRow key={`balance.${b.healthcareToken.name}`}>
								<TableCell>{b.healthcareToken.name}</TableCell>
								<TableCell>{b.balance}</TableCell>
								<TableCell>
									<Button
										variant="contained"
										color="primary"
										onClick={() => {
											setSelectedBalance(b);
											setOpen(true);
										}}
									>
										Withdrawn
									</Button>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			<Dialog
				open={open}
				fullWidth
				maxWidth="sm"
				onClose={() => {
					setOpen(false);
					setPin('');
				}}
			>
				<DialogTitle>Withdraw</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{selectedBalance && (
							<>
								<table className="w-full">
									<tr>
										<td>Name</td>
										<td>{selectedBalance.healthcareToken.name}</td>
									</tr>
									<tr>
										<td>Description</td>
										<td>{selectedBalance.healthcareToken.description}</td>
									</tr>
									<tr>
										<td>Balance</td>
										<td>{selectedBalance.balance}</td>
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
								<div className="mt-15">
									<TextField
										label="Amount"
										variant="outlined"
										value={amount}
										onChange={(e) => {
											const regex = /([0-9]+)|(^$)/i;
											if (
												regex.test(e.target.value) &&
												Number(e.target.value) <= selectedBalance.balance
											) {
												setAmount(e.target.value);
											}
										}}
										fullWidth
									/>
								</div>
								<div className="align-right mt-15">
									<Button
										onClick={async () => {
											await withdrawToken();
											setOpen(false);
											setPin('');
										}}
										variant="contained"
										color="secondary"
										size="large"
									>
										Withdraw Token
									</Button>
								</div>
							</>
						)}
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Wallet;
