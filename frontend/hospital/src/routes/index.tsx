import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { PathContext } from '../App';
import RequireAuth from '../components/RequireAuth';
import ChangePassword from '../pages/ChangePassword';
import ChangePin from '../pages/ChangePin';
import Pin from '../pages/Pin';
import Scanner from '../pages/Scanner';
import Signin from '../pages/Signin';
import { AuthStoreContext } from '../stores';
import SiteHome from './../pages/SiteHome';
import Balance from '../pages/ManageBalance';
import LogHistory from '../pages/History';

type IsActive = {
	isActive: boolean;
};

const Routes = () => {
	const location = useLocation();
	const { setPath } = useContext(PathContext);
	const authStore = useContext(AuthStoreContext);
	useEffect(() => {
		setPath(location.pathname);
	}, [setPath, location.pathname]);

	const [history] = useState(useHistory());
	useEffect(() => {
		if (authStore.isSignin) {
			axios.get<IsActive>('/keypair/is-active').then(({ data }) => {
				if (!data.isActive) {
					history.push('/pin');
				}
			});
		}
	}, [authStore.isSignin]);

	return (
		<div className="container">
			<Switch>
				<Route exact path="/" component={(props: any) => <RequireAuth {...props} Component={SiteHome} />} />
				<Route exact path="/signin" component={Signin} />
				<Route
					exact
					path="/password/change"
					component={(props: any) => <RequireAuth {...props} Component={ChangePassword} />}
				/>
				<Route
					exact
					path="/pin/change"
					component={(props: any) => <RequireAuth {...props} Component={ChangePin} />}
				/>
				<Route exact path="/pin" component={(props: any) => <RequireAuth {...props} Component={Pin} />} />
				<Route
					exact
					path="/scanner"
					component={(props: any) => <RequireAuth {...props} Component={Scanner} />}
				/>
				<Route 
					exact 
					path="/balance" 
					component={(props: any) => <RequireAuth {...props} Component={Balance} />} 
				/>
				<Route 
					exact 
					path="/history" 
					component={(props: any) => <RequireAuth {...props} Component={LogHistory} />} 
				/>
			</Switch>
		</div>
	);
};

export default Routes;
