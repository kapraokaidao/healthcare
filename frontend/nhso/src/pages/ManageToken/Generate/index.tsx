import React from 'react';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import { delay } from 'lodash';

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
    const [type, setType] = React.useState('Normal');
    const [state, setState] = React.useState({
        name: '',
        type: '',
        rule: [],
        quantity: '',
        expired: '',
        detail: '',
        transfer: false,
    });

    const handleTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setType(event.target.value)
        console.log(event.target.value)
        setTimeout(() => {  console.log(type); }, 2000);
      };

    const handleDateChange = () => {
        setState(state)
      };

    const handleTransferChange = () => {
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
                                value={type}
                                onChange={handleTypeChange}
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
                            <Typography variant="h5" gutterBottom align="left" display="inline">
                                Rule
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="rule-native-helper">Rule</InputLabel>
                                <NativeSelect
                                value={state.rule}
                                onChange={handleTypeChange}
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
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={4} container alignItems="flex-end">
                            <Typography variant="h5" gutterBottom align="left">
                                Detail
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="outlined-token-detail-input" label="Detail" variant="outlined" fullWidth/>
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
                                checked={state.transfer}
                                onChange={handleTransferChange}
                                name="checkedB"
                                color="primary"
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
                            <Button color="primary" size="large">
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" color="primary" size="large">
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