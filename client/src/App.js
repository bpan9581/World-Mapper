import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Map from './components/Maps'
import * as queries from './cache/queries';
import { jsTPS } from './utils/jsTPS';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import SpreadSheet from './components/SpreadSheet';
import Regions from './components/Regions';
import Account from './components/Account';

import { useMutation, useQuery } 		from '@apollo/client';
import { use } from 'passport';

const App = () => {
	let user = null;
	let transactionStack = new jsTPS();

	const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

	if (error) { console.log(error); }
	if (loading) { console.log(loading); }
	if (data) {
		let { getCurrentUser } = data;
		if (getCurrentUser !== null) { user = getCurrentUser; }
	}
	let check = user !== null;
	const [regions, setRegions] = useState({})

	const sendRegions = (e) => {
		setRegions(e);
	}

	let name, firstName, lastName, email, _id;
	if(user) {
		name = user.firstName + " " + user.lastName;
		firstName = user.firstName;
		lastName = user.lastName;
		email = user.email;
		_id = user._id;
	}

	useEffect(() => {refetch()}, [])

	return (
		<Router>
			<div>
				<Header fetchUser={refetch} user = {user} name = {name}/>
				<Redirect exact from="/" to={ {pathname: "/welcome"} } />
				{check ? <Redirect exact from="/welcome" to={ {pathname: "/maps"} } /> : <div></div>}
				{!check ? <Redirect exact from="/" to={ {pathname: "/welcome"} } /> : <div></div>}
				<Switch>
					<Route path="/welcome" component={Welcome} />
					<Route path = "/maps" exact render = {
						() =>
						<Map 
							fetchUser = {refetch}
							user = {user} maps = {sendRegions}
						/>
					}/>
					<Route path = "/maps/:_id" exact><SpreadSheet  user = {user} regions = {regions}/></Route>
					<Route path = "/maps/:_id/region-viewer"><Regions/></Route>
					<Route path = "/account"><Account firstName = {firstName} 
						lastName = {lastName} email = {email} _id = {_id}
					/></Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;