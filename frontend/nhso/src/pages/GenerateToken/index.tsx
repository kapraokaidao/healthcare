import React from 'react';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

const GenerateToken = observer(() => {
	const classes = useStyles();
	const [token, setToken] = React.useState({
		name: '',
		type: 'Normal',
		rule: '',
		quantity: '',
		expired: Date(),
		detail: '',
		transfer: true,
	});
	const handleCheckChange = (event: { target: { checked: any } }) => {
		setToken({ ...token, ['transfer']: event.target.checked });
	};
	const handleInputChange = (props: any) => (event: { target: { value: any } }) => {
		setToken({ ...token, [props]: event.target.value });
	};
	const generateToken = () => {
		console.log(token);
	};

	return (
		<>
			<div className="sitehome">
				<div className="mt-15">
					<Typography variant="h2" gutterBottom align="left">
						Generate Token
					</Typography>
				</div>
				<div className="mt-15">
					<Grid container spacing={2}>
						<Grid item xs={4} container alignItems="flex-end">
							<Typography variant="h6" gutterBottom align="left">
								Token's name
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<TextField
								id="outlined-token-name-input"
								label="Name"
								variant="outlined"
								value={token.name}
								onChange={handleInputChange('name')}
								fullWidth
							/>
						</Grid>
						<Grid item xs={4} container alignItems="flex-end">
							<Typography variant="h6" gutterBottom align="left">
								Token's type
							</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormControl className={classes.formControl}>
								<InputLabel htmlFor="type-native-helper">Type</InputLabel>
								<NativeSelect
									value={token.type}
									onChange={handleInputChange('type')}
									variant="outlined"
									inputProps={{
										name: 'type',
										id: 'type-native-helper',
									}}
								>
									<option value={'Normal'}>Normal</option>
									<option value={'Special'}>Special</option>
								</NativeSelect>
							</FormControl>
						</Grid>
						<Grid item xs={4} container alignItems="flex-end">
							<Typography variant="h6" gutterBottom align="left" display="inline">
								Rule
							</Typography>
						</Grid>
						<Grid item xs={8}>
							Rule
						</Grid>
						<Grid item xs={4} container alignItems="flex-end">
							<Typography variant="h6" gutterBottom align="left">
								Quantity
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<TextField
								id="outlined-token-quantity-input"
								label="Quantity"
								variant="outlined"
								value={token.quantity}
								onChange={handleInputChange('quantity')}
								fullWidth
							/>
						</Grid>
						<Grid item xs={4} container alignItems="flex-end">
							<Typography variant="h6" gutterBottom align="left">
								Expired date
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Input type="date" onChange={handleInputChange('expired')} />
						</Grid>
						<Grid item xs={4} container alignItems="flex-end">
							<Typography variant="h6" gutterBottom align="left">
								Detail
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<TextField
								id="outlined-token-detail-input"
								label="Detail"
								variant="outlined"
								value={token.detail}
								onChange={handleInputChange('detail')}
								fullWidth
							/>
						</Grid>
						{/* <Grid item xs={4} container alignItems="flex-end">
							<Typography variant="h6" gutterBottom align="left">
								Transfer after generating
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<FormControlLabel
								control={
									<Checkbox
										checked={token.transfer}
										onChange={handleCheckChange}
										name="checkedB"
										color="primary"
										inputProps={{ 'aria-label': 'primary checkbox' }}
									/>
								}
								label="Yes"
							/>
						</Grid> */}
					</Grid>
				</div>
				<div className="mt-15">
					<Grid container spacing={2}>
						<Grid item xs={8}></Grid>
						<Grid item xs={2}>
							<Button color="primary" size="large">
								Cancel
							</Button>
						</Grid>
						<Grid item xs={2}>
							<Button onClick={generateToken} variant="contained" color="primary" size="large">
								Generate
							</Button>
						</Grid>
					</Grid>
				</div>
			</div>
		</>
	);
});
export default GenerateToken;
