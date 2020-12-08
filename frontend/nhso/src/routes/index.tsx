import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SiteHome from './../pages/SiteHome';

const Routes = () => {
	return (
		<div className="container">
			<Switch>
				<Route exact path="/" component={SiteHome} />
			</Switch>
		</div>
	);
};

export default Routes;
