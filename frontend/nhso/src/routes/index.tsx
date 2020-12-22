import React, { useContext, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import Signin from '../pages/Signin';
import ManageAccount from '../pages/ManageAccount';
import SiteHome from './../pages/SiteHome';
import ManageToken from './../pages/ManageToken';
import CreateToken from './../pages/CreateToken';
import CreateAccount from '../pages/CreateAccount';
import KYCConfirm from '../pages/KYCConfirm';
import KYC from '../pages/KYC';
import { PathContext } from '../App';
import RequireAuth from '../components/RequireAuth';

const Routes = () => {
	const location = useLocation();
	const { setPath } = useContext(PathContext);
	useEffect(() => {
		setPath(location.pathname);
	}, [setPath, location.pathname]);

	return (
		<div className="container">
			<Switch>
				<Route exact path="/" component={(props: any) => <RequireAuth {...props} Component={SiteHome} />} />
				<Route exact path="/signin" component={Signin} />
				<Route
					exact
					path="/account/create"
					component={(props: any) => <RequireAuth {...props} Component={CreateAccount} />}
				/>
				<Route
					exact
					path="/account"
					component={(props: any) => <RequireAuth {...props} Component={ManageAccount} />}
				/>
				<Route
					exact
					path="/token/create"
					component={(props: any) => <RequireAuth {...props} Component={CreateToken} />}
				/>
				<Route
					exact
					path="/token"
					component={(props: any) => <RequireAuth {...props} Component={ManageToken} />}
				/>
				<Route
					exact
					path="/kyc/:id"
					component={(props: any) => <RequireAuth {...props} Component={KYCConfirm} />}
				/>
				<Route exact path="/kyc" component={(props: any) => <RequireAuth {...props} Component={KYC} />} />
			</Switch>
		</div>
	);
};

export default Routes;
