import React, { useEffect, useState } from 'react';
import nhso from '../../images/nhso.png';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { User } from '../../types';

const SiteHome = () =>  {
	const [user, setUser] = useState<User>();
	const getUsers = async () => {
		const loginUser = await axios.get('/user/me');
		setUser(loginUser.data as User);
	   };
	useEffect(() => {
		getUsers();
	}, []);

	return (
		<>
			<div className="sitehome">
				<div>
					<div className="center">
						<img src={nhso} />
					</div>
					<div className="mt-15">
						<Typography variant="h2" gutterBottom align="center">
							Username : {user?.username}
						</Typography>
					</div>
					<div className="mt-15">
						<Box border={1} width={800} height={350}>
							<Typography variant="h3" gutterBottom align="center">
								Info
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={3} container alignItems="flex-end">
									<Typography variant="h5" gutterBottom align="left">
										Firstname
									</Typography>
								</Grid>
								<Grid item xs={8}>
									<Typography variant="h6" gutterBottom align="left">
										{user?.firstname}
									</Typography>
								</Grid>
								<Grid item xs={3} container alignItems="flex-end">
									<Typography variant="h5" gutterBottom align="left">
										Surname
									</Typography>
								</Grid>
								<Grid item xs={8}>
									<Typography variant="h6" gutterBottom align="left">
										{user?.surname}
									</Typography>
								</Grid>
								<Grid item xs={3} container alignItems="flex-end">
									<Typography variant="h5" gutterBottom align="left">
										Address
									</Typography>
								</Grid>
								<Grid item xs={8}>
									<Typography variant="h6" gutterBottom align="left">
										{user?.address}
									</Typography>
								</Grid>
								<Grid item xs={3} container alignItems="flex-end">
									<Typography variant="h5" gutterBottom align="left">
										Phone
									</Typography>
								</Grid>
								<Grid item xs={8}>
									<Typography variant="h6" gutterBottom align="left">
										{user?.phone}
									</Typography>
								</Grid>
								<Grid item xs={3} container alignItems="flex-end">
									<Typography variant="h5" gutterBottom align="left">
										Role
									</Typography>
								</Grid>
								<Grid item xs={8}>
									<Typography variant="h6" gutterBottom align="left">
										{user?.role}
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</div>
				</div>
			</div>
		</>
	);
};

export default SiteHome;
