import { Observer } from 'mobx-react-lite';
import React from 'react';
import { observer } from 'mobx-react-lite';
import Button from '@material-ui/core/Button';
import {Redirect} from 'react-router-dom';

const TokenList = observer(() => {
	
	const addToken = (event: any) => {
		if(true){
			return  <Redirect  to="/generate-token" />
		}
	 }
	
	return (
    <>
        <div className="center mt-15">
			<Button onClick={addToken} variant="contained" color="primary" size="large">
				+
			</Button>
		</div>
    </>
    );
});
export default TokenList;