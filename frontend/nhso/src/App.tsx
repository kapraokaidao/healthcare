import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';
import Routes from './routes';
import { authStore, AuthStoreContext } from './stores';
import Spinner from './components/Spinner';

function App() {
	return (
		<AuthStoreContext.Provider value={authStore}>
			<Router>
				<Spinner />
				<Navigation />
				<Routes />
			</Router>
		</AuthStoreContext.Provider>
	);
}

export default App;
