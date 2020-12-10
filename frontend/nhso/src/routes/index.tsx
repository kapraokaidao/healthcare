import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Signin from '../pages/Signin';
import AccountList from '../pages/AccountList';
import SiteHome from './../pages/SiteHome';

const Routes = () => {
	return (
		<div className="container">
			<Switch>
				<Route exact path="/" component={SiteHome} />
				<Route exact path="/signin" component={Signin} />
				<Route exact path="/account-list" component={AccountList} />
			</Switch>
		</div>
	);
};

export default Routes;
