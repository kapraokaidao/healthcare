import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const rows = [{ tokenName: 'Influenza vacine', type: 'Special', quantity: 1000000, own: 900000 }];

const TokenList = () => {
	return (
		<>
			<Grid container spacing={3}>
				<Grid item xs={3}>
					<h1>Token List</h1>
				</Grid>
				<Grid item xs>
					cc
				</Grid>
			</Grid>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Token Name</TableCell>
							<TableCell align="right">Type</TableCell>
							<TableCell align="right">Quantity</TableCell>
							<TableCell align="right">Own</TableCell>
							<TableCell align="right"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<TableRow key={row.tokenName}>
								<TableCell component="th" scope="row">
									{row.tokenName}
								</TableCell>
								<TableCell align="right">{row.type}</TableCell>
								<TableCell align="right">{row.quantity}</TableCell>
								<TableCell align="right">{row.own}</TableCell>
								<TableCell align="right">button</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default TokenList;
