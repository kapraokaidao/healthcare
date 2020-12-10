import React, { useCallback, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import './style.scss';
import axios from 'axios';

axios.interceptors.request.use(
	(config) => {
		document.getElementById('spinner')?.classList.add('overlay');
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	(response) => {
		document.getElementById('spinner')?.classList.remove('overlay');
		return response;
	},
	(error) => {
		document.getElementById('spinner')?.classList.remove('overlay');
		return Promise.reject(error);
	}
);

const Spinner = () => {
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		axios.interceptors.response.use(undefined, (error) => {
			document.getElementById('spinner')?.classList.remove('overlay');
			document.getElementById('dialog')?.classList.add('overlay');
			const error_list = [];
			if ('errors' in error) {
				for (const key in error.errors) {
					error_list.push(error.errors[key].join(', '));
				}
			}
			setErrors([...errors, error.message].concat(error_list));
			return Promise.reject(error);
		});
	}, [errors]);

	const refresh = useCallback(() => {
		window.location.reload(false);
	}, []);

	return (
		<>
			<div id="spinner" className="wrapper-spinner">
				<ClipLoader size={150} color={'#ffffff'} loading={true} />
			</div>
			<div id="dialog" className="wrapper-dialog">
				<div>
					<p>There are errors</p>
					<ul>
						{errors.map((error) => {
							return <li key="error">{error}</li>;
						})}
					</ul>
					<button onClick={refresh} className="reload-btn">
						Reload Page
					</button>
				</div>
			</div>
		</>
	);
};

export default Spinner;