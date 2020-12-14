import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Signin from '../pages/Signin';
import AccountList from '../pages/AccountList';
import SiteHome from './../pages/SiteHome';
import GenerateToken from '../pages/GenerateToken';
import CreateAccount from '../pages/CreateAccount';
import KYCConfirm from '../pages/KYCConfirm';

const Routes = () => {
	return (
		<div className="container">
			<Switch>
				<Route exact path="/home" component={SiteHome} />
				<Route exact path="/signin" component={Signin} />
				<Route exact path="/account-list" component={AccountList} />
				<Route exact path="/generate-token" component={GenerateToken} />
				<Route exact path="/create-account" component={CreateAccount} />
				<Route exact path="/KYC-confirm" component={KYCConfirm} />
			</Switch>
		</div>
	);
};

export default Routes;
