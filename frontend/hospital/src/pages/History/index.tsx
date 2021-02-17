import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { TitleContext } from '../../App';
import Credit from './Credit';
import Debit from './Debit';

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

function a11yProps(index: number) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	};
}

const History = observer(() => {
	const { setTitle } = useContext(TitleContext);
	const [value, setValue] = useState(0);
	useEffect(() => {
		setTitle('Summary');
	}, [setTitle]);

	const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
		setValue(newValue);
	};

	return (
		<>
			<h1>History</h1>
			<AppBar position="static">
				<Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered>
					<Tab label="Receiving history" {...a11yProps(0)} />
					<Tab label="Giving history" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<Debit />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<Credit />
			</TabPanel>
		</>
	);
});

export default History;
