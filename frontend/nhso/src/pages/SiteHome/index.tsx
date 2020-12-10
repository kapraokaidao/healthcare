import React from 'react';
import { observer } from 'mobx-react-lite';
import nhso from '../../images/nhso.png';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

//Mock up data of user
const user = { username:'nhso', firstname:'Thanadol', surname:'Rungjitwaranon', address:'home', phone:'08x-xxx-xxxx', role:'admin'}

const SiteHome = observer(() =>  {
	return (
		<>
		<div className="sitehome">
			<div>
				<div className="center">
					<img src={nhso} />
				</div>
				<div className="mt-15">
					<Typography variant="h2" gutterBottom align="center">
						Username : {user.username}
					</Typography>
				</div>
				<div>
					<Box border={1} width={800} height={350}>
						<Typography variant="h2" gutterBottom align="center">
							Info
						</Typography>
						<Typography variant="h5" gutterBottom align="left">
							Firstname : {user.firstname}
						</Typography>
						<Typography variant="h5" gutterBottom align="left">
							Surname : {user.surname}
						</Typography>
						<Typography variant="h5" gutterBottom align="left">
							Address : {user.address}
						</Typography>
						<Typography variant="h5" gutterBottom align="left">
							Phone : {user.phone}
						</Typography>
						<Typography variant="h5" gutterBottom align="left">
							Role : {user.role}
						</Typography>
					</Box>
				</div>
			</div>
		</div>
		</>
	);
});

export default SiteHome;
