import { Observer } from 'mobx-react-lite';
import React from 'react';
import { observer } from 'mobx-react-lite';
import Button from '@material-ui/core/Button';

const TokenList = observer(() => {
	return (
    <>
        <div className="center mt-15">
			<Button variant="contained" color="primary" size="large">
				+
			</Button>
		</div>
    </>
    );
});
export default TokenList;