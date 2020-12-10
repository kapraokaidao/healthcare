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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

const rows = [{ firstname: 'Thanawat', role: 'Admin' }];

const AccountList = () => {
	return (
		<>
			<Grid container spacing={3}>
				<Grid item xs={3}>
					<h1>Account List</h1>
				</Grid>
				<Grid item xs>
					<TextField id="outlined-search" label="Search field" type="search" variant="outlined" />
				</Grid>
				<Grid>
					<div className="height-full center">
						<IconButton color="primary">
							<AddIcon fontSize="large" />
						</IconButton>
					</div>
				</Grid>
			</Grid>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Firstname</TableCell>
							<TableCell align="right">Role</TableCell>
							<TableCell align="right"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<TableRow key={row.firstname}>
								<TableCell component="th" scope="row">
									{row.firstname}
								</TableCell>
								<TableCell align="right">{row.role}</TableCell>
								<TableCell align="right">
									<Button variant="contained" color="primary">
										Detail
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default AccountList;
