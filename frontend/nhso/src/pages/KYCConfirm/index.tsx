import React, { useCallback, useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import './style.scss';
import { User } from '../../types';
import { useHistory } from 'react-router-dom';

type Props = {
	match: {
		params: {
			id: string;
		};
	};
};

const KYCConfirm = (props: Props) => {
	const [userId] = useState(props.match.params.id);
	const [user, setUser] = useState<User>();
	const [history] = useState(useHistory());

	useEffect(() => {
		axios.get(`/user/${userId}`).then(({ data }) => {
			setUser(data);
		});
	}, [userId]);

	const back = useCallback(() => {
		history.push('/kyc');
	}, [history]);

	const approve = useCallback(() => {
		console.log('approve', userId);
	}, [userId]);

	const reject = useCallback(() => {
		console.log('reject', userId);
	}, [userId]);

	return (
		<>
			<div className="sitehome">
				<div className="mt-15">
					<Button variant="contained" color="default" size="large" onClick={back}>
						{'<'} Back
					</Button>
				</div>
				<div className="mt-15">
					<Typography variant="h3" gutterBottom align="left">
						{user?.firstname} {user?.surname}
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
							{user?.firstname}
						</Typography>
					</Grid>
					<Grid item xs={4} container alignItems="flex-end">
						<Typography variant="h5" gutterBottom align="left">
							Surname
						</Typography>
					</Grid>
					<Grid item xs={8}>
						<Typography variant="h6" gutterBottom align="left">
							{user?.surname}
						</Typography>
					</Grid>
					<Grid item xs={4} container alignItems="flex-end">
						<Typography variant="h5" gutterBottom align="left">
							Gender
						</Typography>
					</Grid>
					<Grid item xs={8}>
						<Typography variant="h6" gutterBottom align="left">
							{user?.patient?.gender}
						</Typography>
					</Grid>
					<Grid item xs={4} container alignItems="flex-end">
						<Typography variant="h5" gutterBottom align="left">
							Birthdate
						</Typography>
					</Grid>
					<Grid item xs={8}>
						<Typography variant="h6" gutterBottom align="left">
							{user?.patient?.birthDate}
						</Typography>
					</Grid>
					<Grid item xs={4} container alignItems="flex-end">
						<Typography variant="h5" gutterBottom align="left">
							National Id
						</Typography>
					</Grid>
					<Grid item xs={8}>
						<Typography variant="h6" gutterBottom align="left">
							{user?.patient?.nationalId}
						</Typography>
					</Grid>
					<Grid item xs={4} container alignItems="flex-end">
						<Typography variant="h5" gutterBottom align="left">
							Address
						</Typography>
					</Grid>
					<Grid item xs={8}>
						<Typography variant="h6" gutterBottom align="left">
							{user?.address}
						</Typography>
					</Grid>
					<Grid item xs={4} container alignItems="flex-end">
						<Typography variant="h5" gutterBottom align="left">
							Phone Number
						</Typography>
					</Grid>
					<Grid item xs={8}>
						<Typography variant="h6" gutterBottom align="left">
							{user?.phone}
						</Typography>
					</Grid>
					<Grid item xs={4} container alignItems="flex-end">
						<Typography variant="h5" gutterBottom align="left">
							National Id Image
						</Typography>
					</Grid>
					<Grid item xs={8}>
						<img className="photo" src={user?.patient?.nationalIdImage} />
					</Grid>
					<Grid item xs={4} container alignItems="flex-end">
						<Typography variant="h5" gutterBottom align="left">
							Selfie Image
						</Typography>
					</Grid>
					<Grid item xs={8}>
						<img className="photo" src={user?.patient?.selfieImage} />
					</Grid>
				</Grid>
				<div className="mt-15">
					<Grid container spacing={0}>
						<Grid item xs={8}></Grid>
						<Grid item xs={2}>
							<Button variant="contained" color="secondary" size="large" onClick={reject}>
								Reject
							</Button>
						</Grid>
						<Grid item xs={2}>
							<Button variant="contained" color="primary" size="large" onClick={approve}>
								Approve
							</Button>
						</Grid>
					</Grid>
				</div>
			</div>
		</>
	);
};

export default KYCConfirm;
