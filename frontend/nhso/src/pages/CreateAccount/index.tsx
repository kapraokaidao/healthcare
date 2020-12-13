import React from 'react';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

const CreateAccount = observer(() => {
    const classes = useStyles();
    const [account, setAccount] = React.useState({
        role:"Admin",
        firstname:"",
        surname:"",
        address:"",
        phone:"",
        username:"",
        password:"",
        confirm:""
    });
    
    const createAccount = () => {
        console.log(account);
    };

    const handleInputChange = (props: any)=>(event: { target: { value: any; }; }) => {
        setAccount({...account, [props]:event.target.value});
    };

    return (
        <>
            <div className="sitehome">
                <div className="mt-15">
                    <Typography variant="h2" gutterBottom align="left">
						Create Account
					</Typography>
                </div>
                <div className="mt-15">
                    <Grid container spacing={2}>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Role
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="role-native-helper">Role</InputLabel>
                                <NativeSelect
                                    value={account.role}
                                    onChange={handleInputChange("role")}
                                    variant="outlined"
                                    inputProps={{
                                        name: 'type',
                                        id: 'role-native-helper',
                                    }}
                                    >
                                    <option value={'Admin'}>Admin</option>
                                    <option value={'Hospital'}>Hospital</option>
                                </NativeSelect>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Firstname
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField 
                                id="outlined-firstname-input" 
                                label="Firstname" 
                                variant="outlined"
                                value={account.firstname}
                                onChange={handleInputChange("firstname")}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Surname
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField 
                                id="outlined-surname-input" 
                                label="Surname" 
                                variant="outlined"
                                value={account.surname}
                                onChange={handleInputChange("surname")}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Address
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField 
                                id="outlined-address-input" 
                                label="Address" 
                                variant="outlined" 
                                value={account.address}
                                onChange={handleInputChange("address")}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Phone Number
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField 
                                id="outlined-phone-input" 
                                label="Phone Number" 
                                variant="outlined" 
                                value={account.phone}
                                onChange={handleInputChange("phone")}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Username
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField 
                                id="outlined-username-input" 
                                label="Username" 
                                variant="outlined" 
                                value={account.username}
                                onChange={handleInputChange("username")}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Password
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField 
                                id="outlined-password-input" 
                                label="Password" 
                                variant="outlined" 
                                value={account.password}
                                onChange={handleInputChange("password")}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Confirm Password
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField 
                                id="outlined-confirm-password-input" 
                                label="Confirm Password" 
                                variant="outlined" 
                                value={account.confirm}
                                onChange={handleInputChange("confirm")}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </div>
                <div className="mt-15">
                    <Grid container spacing={0}>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={2}>
                            <Button color="primary" size="large">
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button onClick={createAccount} variant="contained" color="primary" size="large">
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
});
export default CreateAccount;