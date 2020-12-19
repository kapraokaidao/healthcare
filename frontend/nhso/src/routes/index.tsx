import React, { useContext, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import Signin from '../pages/Signin';
import AccountList from '../pages/AccountList';
import SiteHome from './../pages/SiteHome';
import ManageToken from './../pages/ManageToken';
import CreateToken from './../pages/CreateToken';
import CreateAccount from '../pages/CreateAccount';
import KYCConfirm from '../pages/KYCConfirm';
import KYC from '../pages/KYC';
import { PathContext } from '../App';

const Routes = () => {
	const location = useLocation();
	const { setPath } = useContext(PathContext);
	useEffect(() => {
		setPath(location.pathname);
	}, [location.pathname]);

	return (
		<div className="container">
			<Switch>
				<Route exact path="/" component={SiteHome} />
				<Route exact path="/signin" component={Signin} />
				<Route exact path="/account/create" component={CreateAccount} />
				<Route exact path="/account" component={AccountList} />
				<Route exact path="/token/create" component={CreateToken} />
				<Route exact path="/token" component={ManageToken} />
				<Route exact path="/kyc/:id" component={KYCConfirm} />
				<Route exact path="/kyc" component={KYC} />
			</Switch>
		</div>
	);
};

export default Routes;
