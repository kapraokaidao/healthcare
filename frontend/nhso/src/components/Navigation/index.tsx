import React, { useContext } from 'react';
import { AuthStoreContext } from '../../stores';
import { observer } from 'mobx-react-lite';

const Navigation = observer(() => {
	const authStore = useContext(AuthStoreContext);

	return <div>navigation {authStore.user.firstname}</div>;
});

export default Navigation;
