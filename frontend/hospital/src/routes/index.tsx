import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { PathContext } from '../App';
import RequireAuth from '../components/RequireAuth';
import Pin from '../pages/Pin';
import Scanner from '../pages/Scanner';
import Signin from '../pages/Signin';
import SiteHome from './../pages/SiteHome';

type IsActive = {
	isActive: boolean;
};

const Routes = () => {
	const location = useLocation();
	const { setPath } = useContext(PathContext);
	useEffect(() => {
		setPath(location.pathname);
	}, [setPath, location.pathname]);

	const [history] = useState(useHistory());
	useEffect(() => {
		axios.get<IsActive>('/keypair/is-active').then(({ data }) => {
			if (!data.isActive) {
				history.push('/pin');
			}
		});
	}, []);

	return (
		<div className="container">
			<Switch>
				<Route exact path="/" component={(props: any) => <RequireAuth {...props} Component={SiteHome} />} />
				<Route exact path="/signin" component={Signin} />
				<Route exact path="/pin" component={Pin} />
				<Route
					exact
					path="/scanner"
					component={(props: any) => <RequireAuth {...props} Component={Scanner} />}
				/>
			</Switch>
		</div>
	);
};

export default Routes;
