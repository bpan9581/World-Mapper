import React, { useState } 			from 'react';
import Homescreen 		from './components/homescreen/Homescreen';
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { set } from 'mongoose';
 
const App = () => {
	let user = null;
    let transactionStack = new jsTPS();
	
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }
	const test = transactionStack.hasTransactionToUndo();
	const test2 = transactionStack.hasTransactionToRedo();
	const [hasUndo, setUndo] = useState(test);
	const [hasRedo, setRedo] = useState(test2);
	let updateUndo = () => {
		console.log(transactionStack.hasTransactionToUndo())
		setUndo(transactionStack.hasTransactionToUndo());
		return hasUndo;
	}
	let updateRedo = () => {
		setRedo(transactionStack.hasTransactionToRedo());
		return hasRedo;
	}

	return(
		<BrowserRouter>
			<Switch>
				<Redirect exact from="/" to={ {pathname: "/home"} } />
				<Route 
					path="/home" 
					name="home" 
					render={() => 
						<Homescreen tps={transactionStack} fetchUser={refetch} user={user} hasUndo = {hasUndo}
						setUndo = {updateUndo}
						hasRedo = {hasRedo} setRedo = {updateRedo}/>
					} 
				/>
				<Route/>
			</Switch>
		</BrowserRouter>
	);
}

export default App;