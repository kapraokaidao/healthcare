import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { observer } from "mobx-react-lite";
import React, {useCallback, useContext, useEffect, useState } from "react";
import { TitleContext } from "../../App";
import { BalanceDetail } from "../../types";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Pagination from '@material-ui/lab/Pagination';
import './style.scss';
import { Dialog, TextField } from "@material-ui/core";

const Balance = observer(() => {
    const { setTitle } = useContext(TitleContext);
	useEffect(() => {
		setTitle('Manage Balance');
	}, [setTitle]);
	const [pageCount, setPageCount] = useState(1);
	const [page, setPage] = useState(1);
	const [balance, setBalance] = useState<BalanceDetail[]>([]);
	const [withdrawn, setWithdrawn] = useState<BalanceDetail[]>([]);
	const [open, setOpen] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [fetchData, setFetchData] = useState(false);
	const [pin, setPin] = useState("");

	useEffect(() => {
		axios.get('/healthcare-token/balance', {
			params: {
				page,
				pageSize: 20,
			},
		}).then(({ data }) => {
			setBalance(data.data)
			setPage(data.page);
			setPageCount(data.pageCount);
		});
	}, [page, fetchData]);

	useEffect(() => {
		axios.get('/healthcare-token/balance', {
			params: {
				page: 0,
				pageSize: 0,
			},
		}).then(({ data }) => {
			setWithdrawn(data.data)
		});
	}, []);

	const handleClose = () => {
		setOpen(false);
	};

	const handleConfirm = () => {
		setConfirm(false);
	};

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const withdrawnToken = useCallback(async () => {
		axios.post('/healthcare-token/withdraw',{
			pin : pin,
			destinationPublicKey : "GABBELJSL5WXRGMYOYHFKJ74MRRIQELNVDDTZC7TYHZ5Y44T7YWYXJ4V"
		});
		setFetchData(true)
		handleClose()
	}, []);

	const body = (
		<>
			<h1>Bill</h1>
			<div style={{ height: 700, width: '100%' }}>
				<Table className="table-pin">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Balance</TableCell>
							<TableCell>Price</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{withdrawn.map((w) => {
							return (
								<TableRow>
									<TableCell>{w.healthcareToken.name}</TableCell>
									<TableCell>{w.balance}</TableCell>
									<TableCell>{w.balance * 5} bahts</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
			<div className="mt-20 text-right">
				<Button
					className="button-pin"
					variant="contained" 
					color="primary" 
					size="large" 
					onClick={(e)=>{
						setConfirm(true);
					}}
				>
					Withdrawn
				</Button>
				<Button
					className="button-pin"
					variant="contained" 
					color="secondary" 
					size="large" 
					onClick={()=>{
						handleClose()
					}}
				>
					Cancel
				</Button>
			</div>
			<Dialog
				open={confirm}
				onClose={handleConfirm}
				fullWidth={true} 
        		maxWidth={'xs'}
        		aria-labelledby="simple-modal-title"
        		aria-describedby="simple-modal-description"
			>
				<h1> Please enter the pin. </h1>
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
					/>
					<></>
					<Button
						variant="contained" 
						color="primary" 
						size="large" 
						onClick={withdrawnToken}
					>
					Confirm
					</Button>
					<Button
						variant="contained" 
						color="secondary" 
						size="large" 
						onClick={()=>{
							handleConfirm()
						}}
					>
					Cancel
					</Button>
				</div>

			</Dialog>
		</>
	);

    return(
        <>
			<Grid container spacing={3}>
				<Grid item xs>
					<h1>Manage Balance</h1>
				</Grid>
				<Grid>
					<div className="height-full center">
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								setOpen(true)
							}}
						>
							Withdrawn
						</Button>
					</div>
				</Grid>
			</Grid>
			<div style={{ height: 700, width: '100%' }}>
				<Table className="table-pin">
					<TableHead>
						<TableRow>
							<TableCell align='center'>Name</TableCell>
							<TableCell align='center'>Balance</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{balance.map((b) => {
							return (
								<TableRow>
									<TableCell align='center'>{b.healthcareToken.name}</TableCell>
									<TableCell align='center'>{b.balance}</TableCell>
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
				onClose={handleClose}
				fullWidth={true} 
        		maxWidth={'sm'}
        		aria-labelledby="simple-modal-title"
        		aria-describedby="simple-modal-description"
			>
				{body}
			</Dialog>
        </>
    );

})

export default Balance;