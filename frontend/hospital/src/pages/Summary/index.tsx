import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { TitleContext } from '../../App';
import { HistoryTransaction } from '../../types';

function TabPanel(props: { [x: string]: any; children: any; value: any; index: any }) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index: number) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	};
}

const Summary = observer(() => {
	const { setTitle } = useContext(TitleContext);
	const [value, setValue] = useState(0);
	const [debits, setDebits] = useState<HistoryTransaction[]>([]);
	const [credits, setCredits] = useState<HistoryTransaction[]>([]);
	const [selectedStartDate, setSelectedStartDate] = useState({
		checked: false,
		date: new Date(),
	});
	const [selectedEndDate, setSelectedEndDate] = useState({
		checked: false,
		date: new Date(),
	});

	useEffect(() => {
		setTitle('Summary');
	}, [setTitle]);

	const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
		setValue(newValue);
	};

	useEffect(() => {
		(async () => {
			const filter: any = {};
			if (selectedStartDate.checked) filter['startDate'] = selectedStartDate.date.toISOString().split('T')[0];
			if (selectedEndDate.checked) filter['endDate'] = selectedEndDate.date.toISOString().split('T')[0];
			const { data: dataDebits } = await axios.post('/transaction/search/group-by-service', {
				type: 'Debit',
				...filter,
			});
			setDebits(dataDebits);
			const { data: dataCredits } = await axios.post('/transaction/search/group-by-service', {
				type: 'Credit',
				...filter,
			});
			setCredits(dataCredits);
		})();
	}, [selectedStartDate, selectedEndDate]);

	return (
		<>
			<h1>Summary</h1>
			<AppBar position="static">
				<Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered>
					<Tab label="Receiving Summary" {...a11yProps(0)} />
					<Tab label="Giving Summary" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			<table>
				<tr>
					<td>Start Date</td>
					<td>
						<Checkbox
							checked={selectedStartDate.checked}
							onChange={(e) => {
								setSelectedStartDate({
									date: selectedStartDate.date,
									checked: e.target.checked,
								});
							}}
							color="primary"
						/>
					</td>
					<td>
						<TextField
							type="date"
							defaultValue={selectedStartDate.date.toISOString().split('T')[0]}
							onChange={(e) => {
								setSelectedStartDate({
									date: new Date(e.target.value),
									checked: selectedStartDate.checked,
								});
							}}
						/>
					</td>
				</tr>
				<tr>
					<td>End Date</td>
					<td>
						<Checkbox
							checked={selectedEndDate.checked}
							onChange={(e) => {
								setSelectedEndDate({
									date: selectedEndDate.date,
									checked: e.target.checked,
								});
							}}
							name="checkedB"
							color="primary"
						/>
					</td>
					<td>
						<TextField
							type="date"
							defaultValue={selectedEndDate.date.toISOString().split('T')[0]}
							onChange={(e) => {
								setSelectedEndDate({
									date: new Date(e.target.value),
									checked: selectedEndDate.checked,
								});
							}}
						/>
					</td>
				</tr>
			</table>

			<TabPanel value={value} index={0}>
				<Table className="table-history">
					<TableHead>
						<TableRow>
							<TableCell>Healthcare</TableCell>
							<TableCell>Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{debits.map((debit) => {
							return (
								<TableRow>
									<TableCell>{debit.name}</TableCell>
									<TableCell>{debit.amount}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<Table className="table-history">
					<TableHead>
						<TableRow>
							<TableCell>Healthcare</TableCell>
							<TableCell>Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{credits.map((credit) => {
							return (
								<TableRow>
									<TableCell>{credit.name}</TableCell>
									<TableCell>{credit.amount}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TabPanel>
		</>
	);
});

export default Summary;
