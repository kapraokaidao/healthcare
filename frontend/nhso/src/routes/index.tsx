import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Signin from '../pages/Signin';
import SiteHome from './../pages/SiteHome';

const Routes = () => {
	return (
		<div className="container">
			<Switch>
				<Route exact path="/" component={SiteHome} />
				<Route exact path="/signin" component={Signin} />
			</Switch>
		</div>
	);
};

export default Routes;
