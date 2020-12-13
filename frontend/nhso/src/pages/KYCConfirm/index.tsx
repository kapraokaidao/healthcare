import React from 'react';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import taan1 from '../../images/taan1.png';
import taan2 from '../../images/taan2.png';
import './style.scss';

const KYCConfirm = observer(() =>  {
	const [user, setUser] = React.useState({
		firstname:'Thanawat',
        surname:'Jierawatanakanok',
        gender:'Male',
        birthdate:'18-08-1998',
        idnumber:'1-1xxx-xxxxx-xx-x',
		address:'Home',
		phone:'08x-xxx-xxxx'
    });
	
	return (
		<>
			<div className="sitehome">
                <div className="mt-15">
                    <Button variant="contained" color="default" size="large">
                        {'<'} Back
                    </Button>
                </div>
                <div className="mt-15">
                    <Typography variant="h3" gutterBottom align="left">
                        {user.firstname}  {user.surname}
					</Typography>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={4} container alignItems="flex-end">
                        <Typography variant="h5" gutterBottom align="left">
                            Firstname
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6" gutterBottom align="left">
                            {user.firstname}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} container alignItems="flex-end">
                        <Typography variant="h5" gutterBottom align="left">
                            Surname
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6" gutterBottom align="left">
                            {user.surname}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} container alignItems="flex-end">
                        <Typography variant="h5" gutterBottom align="left">
                            Gender
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6" gutterBottom align="left">
                            {user.gender}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} container alignItems="flex-end">
                        <Typography variant="h5" gutterBottom align="left">
                            Birthdate
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6" gutterBottom align="left">
                            {user.birthdate}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} container alignItems="flex-end">
                        <Typography variant="h5" gutterBottom align="left">
                            ID Number
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6" gutterBottom align="left">
                            {user.idnumber}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} container alignItems="flex-end">
                        <Typography variant="h5" gutterBottom align="left">
                            Address
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6" gutterBottom align="left">
                            {user.address}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} container alignItems="flex-end">
                        <Typography variant="h5" gutterBottom align="left">
                            Phone Number
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6" gutterBottom align="left">
                            {user.phone}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container alignItems="flex-end">
                        <Typography variant="h5" gutterBottom align="left">
                            Image
                        </Typography>
                    </Grid>
                </Grid>
                <div className="center">
                    <img className="photo" src={taan1} />
                </div>
                <div className="center">
                    <img className="photo" src={taan2} />
                </div>
                <div className="mt-15">
                    <Grid container spacing={0}>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" color="secondary" size="large">
                                Delete
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" color="primary" size="large">
                                Confirm
                            </Button>
                        </Grid>
                    </Grid>
                </div>
			</div>
		</>
	);
});

export default KYCConfirm;
