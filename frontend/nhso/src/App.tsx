import React, { Context, createContext, Dispatch, SetStateAction, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';
import Routes from './routes';
import { authStore, AuthStoreContext } from './stores';
import Spinner from './components/Spinner';

export const PathContext = createContext({
	path: '/',
	setPath: () => {},
} as {
	path: string;
	setPath: Dispatch<SetStateAction<string>>;
});

function App() {
	const [path, setPath] = useState('/');

	return (
		<AuthStoreContext.Provider value={authStore}>
			<PathContext.Provider value={{ path, setPath }}>
				<Router>
					<Spinner />
					<Navigation />
					<Routes />
				</Router>
			</PathContext.Provider>
		</AuthStoreContext.Provider>
	);
}

export default App;
