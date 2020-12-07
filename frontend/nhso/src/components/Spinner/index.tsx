import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import './style.scss';
import axios from 'axios';

axios.interceptors.request.use(
	(config) => {
		document.getElementById('spinner')?.classList.add('show-spinner');
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	(response) => {
		document.getElementById('spinner')?.classList.remove('show-spinner');
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);

const Spinner = () => {
	return (
		<>
			<div id="spinner" className="wrapper-spinner">
				<ClipLoader size={150} color={'#ffffff'} loading={true} />
			</div>
		</>
	);
};

export default Spinner;
