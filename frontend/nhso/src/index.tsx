import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import './css/index.css';
import App from './App';

Sentry.init({
	dsn: process.env.REACT_APP_SENTRY_DSN,
	enabled: process.env.REACT_APP_SENTRY_ENABLE === 'true'
});

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);
