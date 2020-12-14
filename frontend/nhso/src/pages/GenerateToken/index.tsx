import React, { useState } from 'react';
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
import { useHistory } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

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
        rule: "",
        quantity: '',
        expired: Date(),
        detail: '',
        transfer: true,
    });
    const [confirm, setConfirm] = useState(false);
    const [history] = useState(useHistory());
    
    const handleCheckChange = (props: string)=>(event: { target: { checked: any; }; }) => {
        setToken({...token, [props]: event.target.checked})
    };
    const handleInputChange = (props: any)=>(event: { target: { value: any; }; }) => {
        setToken({...token, [props]:event.target.value});
    };
    const generateToken = () => {
        console.log(token)
    };
    function cancelGenerateToken(){
        //history.push('/token-list')
    }

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
                            <Typography variant="h5" gutterBottom align="left">
                                Token's name
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                                id="outlined-token-name-input" 
                                label="Name" 
                                variant="outlined"
                                value={token.name}
                                onChange={handleInputChange("name")}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Token's type
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="type-native-helper">Type</InputLabel>
                                <NativeSelect
                                    value={token.type}
                                    onChange={handleInputChange("type")}
                                    variant="outlined"
                                    inputProps={{
                                        name: 'type',
                                        id: 'type-native-helper',
                                    }}>
                                    <option value={'Normal'}>Normal</option>
                                    <option value={'Special'}>Special</option>
                                </NativeSelect>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left" display="inline">
                                Rule
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="rule-native-helper">Rule</InputLabel>
                                <NativeSelect
                                    value={token.rule}
                                    onChange={handleInputChange("rule")}
                                    variant="outlined"
                                    inputProps={{
                                        name: 'rule',
                                        id: 'rule-native-helper',
                                    }}>
                                    <option value={'admin'}>Admin</option>
                                    <option value={'hospital'}>Hospital</option>
                                </NativeSelect>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Quantity
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                                id="outlined-token-quantity-input" 
                                label="Quantity" 
                                variant="outlined" 
                                value={token.quantity}
                                onChange={handleInputChange("quantity")}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Expired date
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
								type="date"
								onChange={handleInputChange("expired")}
							/>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Detail
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                                id="outlined-token-detail-input" 
                                label="Detail" 
                                variant="outlined" 
                                value={token.detail}
                                onChange={handleInputChange("detail")}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Transfer after generating
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                        <FormControlLabel
                            control={
                            <Checkbox
                                checked={token.transfer}
                                onChange={handleCheckChange("tranfer")}
                                name="checkedB"
                                color="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                            }
                            label="Yes"
                        />
                        </Grid>
                    </Grid>
                </div>
                <div className="mt-15">
                    <Grid container spacing={2}>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={2}>
                            <Button
                                onClick={cancelGenerateToken}
                                color="primary" 
                                size="large"
                            >
                                    Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button 
                                onClick={() => {
                                    setConfirm(true);
                                }}  
                                variant="contained" 
                                color="primary" 
                                size="large"
                            >
                                Generate
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Dialog
				open={confirm}
				keepMounted
				onClose={() => {
					setConfirm(false);
				}}
			>
				<DialogContent>
					<DialogContentText>
						<h1>Confirm to generate token?</h1>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setConfirm(false);
						}}
						variant="contained"
						color="primary"
					>
						NO
					</Button>
					<Button onClick={generateToken} variant="contained" color="secondary">
						YES
					</Button>
				</DialogActions>
			</Dialog>
        </>
    );
});
export default GenerateToken;