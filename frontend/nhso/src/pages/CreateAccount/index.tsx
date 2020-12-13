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
    const [role, setRole] = React.useState('Admin');
    const [state, setState] = React.useState({
        name: '',
        type: '',
        rule: [],
        quantity: '',
        expired: '',
        detail: '',
        transfer: false,
    });

    const handleRoleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setRole(event.target.value)
      };

    const handleDateChange = () => {
        setState(state)
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
                                value={role}
                                onChange={handleRoleChange}
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
                            <TextField id="outlined-firstname-input" label="Firstname" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Surname
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField id="outlined-surname-input" label="Surname" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Address
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField id="outlined-address-input" label="Address" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Phone Number
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField id="outlined-phone-input" label="Phone Number" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Username
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField id="outlined-username-input" label="Username" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Password
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField id="outlined-password-input" label="Password" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Confirm Password
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField id="outlined-confirm-password-input" label="Confirm Password" variant="outlined" fullWidth/>
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
                            <Button variant="contained" color="primary" size="large">
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