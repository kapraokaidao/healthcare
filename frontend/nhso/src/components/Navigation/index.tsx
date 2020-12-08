import React, { useCallback, useContext, useState } from 'react';
import { AuthStoreContext } from '../../stores';
import { observer } from 'mobx-react-lite';
import './style.scss';
import home from './../../images/home-icon.png';
import manageToken from './../../images/manage-token.png';
import manageAccount from './../../images/manage-account.png';
import kyc from './../../images/KYC.png';
import account from './../../images/account.png';

const Navigation = observer(() => {
	const authStore = useContext(AuthStoreContext);
	const [showMenu, setShowMenu] = useState(false);
	const handleButton = useCallback(() => {
		setShowMenu(!showMenu);
	}, [showMenu]);

	return (
		<>
			<div className="navigation px-4">
				<div>
					<button onClick={handleButton}>☰</button>
					<span className="ml-8">Home</span>
				</div>
				<div className="ml-auto">
					<div className="flex items-center">
						<span className="mr-3">xx {authStore.user.firstname}</span>
						<img src={account} className="h-full mr-3" />
						<button className="signout-btn">Sign Out</button>
					</div>
				</div>
			</div>
			{showMenu && (
				<div className="menu shadow-lg">
					<div>
						<img src={home} />
						<span>Home</span>
					</div>
					<div>
						<img src={manageToken} />
						<span>Manage Token</span>
					</div>
					<div>
						<img src={manageAccount} />
						<span>Manage Account</span>
					</div>
					<div>
						<img src={kyc} />
						<span>KYC</span>
					</div>
				</div>
			)}
		</>
	);
});

export default Navigation;
