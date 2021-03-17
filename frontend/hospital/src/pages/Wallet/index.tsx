import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { TitleContext } from '../../App';
import { BalanceDetail } from '../../types';
import './style.scss';

const Wallet = () => {
	const { setTitle } = useContext(TitleContext);
	useEffect(() => {
		setTitle('Wallet');
	}, [setTitle]);
	const [balance, setBalance] = useState<BalanceDetail[]>([]);
	const [refetch, setRefetch] = useState(false);
	const [pin, setPin] = useState('');

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

	const [amount, setAmount] = useState<any>({});
	const setAmountCallBack = (serviceId: number, value: number) => {
		amount[serviceId] = value;
		setAmount(amount);
	};

	const withdrawToken = () => {
		const withdrawItems = [];
		for (const serviceId in amount) {
			if (amount[serviceId] > 0) {
				withdrawItems.push({
					serviceId,
					amount: amount[serviceId],
				});
			}
		}
		axios
			.post('/bill', {
				pin,
				withdrawItems,
			})
			.then(() => setRefetch(!refetch));
	};

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
									<Input
										type="number"
										onChange={(e) => {
											setAmountCallBack(b.healthcareToken.id, Number(e.target.value));
										}}
									/>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

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
			<Button onClick={withdrawToken} variant="contained" color="primary" size="large" fullWidth>
				Withdraw
			</Button>
		</>
	);
};

export default Wallet;
