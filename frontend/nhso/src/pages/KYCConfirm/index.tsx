import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import taan1 from '../../images/taan1.png';
import taan2 from '../../images/taan2.png';
import './style.scss';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { KYCUser } from '../../types';
import TextField from '@material-ui/core/TextField';

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
    const [userKYC, setUserKYC] = React.useState<KYCUser>({
        approve: false,
        mistake: ""
    });
    const [choose, setChoose] = useState<number>(0);
    const [history] = useState(useHistory());
    
    const handleMistakeChange = (props: string)=>(event: { target: { value: any; }; }) =>{
        setUserKYC({...userKYC, [props]:event.target.value})
    };
    const handleButtonClick = (check: string) =>{
        if(check === "Approve"){
            setChoose(2)
        }
        if(check === "Reject"){
            setChoose(1)
        }
    };
    const backKYC = () =>{
        //history.push('/KYC-list')
    };
    const approveKYC = async() =>{
        // setUserKYC({
        //     approve: true, 
        //     mistake: ""
        // });
        // await axios.post('/user/confirm', userKYC);
        // history.push('/KYC-list');
    };
    const rejectKYC = async() =>{
        // setUserKYC({...userKYC, ["approve"]:false});
        // await axios.post('/user/reject', userKYC);
        //history.push('/KYC-list')
    };

	return (
		<>
			<div className="sitehome">
                <div className="mt-15">
                    <Button onClick={backKYC} variant="contained" color="default" size="large">
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
                            <Button 
                                onClick= {()=>{
                                    handleButtonClick("Reject")
                                }} 
                                variant="contained" 
                                color="secondary" 
                                size="large"
                            >
                                Reject
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button 
                                onClick={()=>{
                                    handleButtonClick("Approve")
                                }} 
                                variant="contained" 
                                color="primary" 
                                size="large"
                            >
                                Approve
                            </Button>
                        </Grid>
                    </Grid>
                </div>
			</div>
            <Dialog
				open={2 === choose}
				keepMounted
				onClose={() => {
					setChoose(0);
				}}
			>
				<DialogContent>
					<DialogContentText>
						<h1>Confirm to approve this person?</h1>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setChoose(0);
						}}
						variant="contained"
						color="primary"
					>
						NO
					</Button>
					<Button onClick={approveKYC} variant="contained" color="secondary">
						YES
					</Button>
				</DialogActions>
			</Dialog>
            <Dialog
				open={1 === choose}
				keepMounted
				onClose={() => {
					setChoose(0);
				}}
			>
				<DialogContent>
					<DialogContentText>
						<h1>Describe what's wrong with this KYC?</h1>
					</DialogContentText>
				</DialogContent>
                <TextField 
                    id="outlined-mistake-input" 
                    label="Message" 
                    variant="outlined"
                    value={userKYC.mistake}
                    onChange={handleMistakeChange("mistake")}
                />
				<DialogActions>
					<Button
						onClick={() => {
							setChoose(0);
						}}
						variant="contained"
						color="primary"
					>
						NO
					</Button>
					<Button onClick={rejectKYC} variant="contained" color="secondary">
						YES
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
});

export default KYCConfirm;
