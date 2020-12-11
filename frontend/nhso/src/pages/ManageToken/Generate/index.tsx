import React from 'react';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import { KeyboardDatePicker } from '@material-ui/pickers';

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
    const [state, setState] = React.useState({
        name: '',
        type: '',
        rule: [],
        quantity: '',
        expired: '',
        detail: '',
        transfer: false,
    });

    const handleDateChange = () => {
        setState(state)
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
                            <Typography variant="h5" gutterBottom align="left">
                                Token's name
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="outlined-token-name-input" label="Name" variant="outlined" fullWidth/>
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
                                value={state.type}
                                variant="outlined"
                                inputProps={{
                                    name: 'type',
                                    id: 'type-native-helper',
                                }}
                                >
                                <option aria-label="None" value="" />
                                <option value={'admin'}>Admin</option>
                                <option value={'hospital'}>Hospital</option>
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
                                value={state.rule}
                                variant="outlined"
                                inputProps={{
                                    name: 'rule',
                                    id: 'rule-native-helper',
                                }}
                                >
                                <option aria-label="None" value="" />
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
                            <TextField id="outlined-token-quantity-input" label="Quantity" variant="outlined" fullWidth/>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Expired date
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                        <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        value={state.expired}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        />
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Detail
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="outlined-token-detail-input" label="Detail" variant="outlined" fullWidth/>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
});
export default GenerateToken;