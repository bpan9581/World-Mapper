import React, { useState } from 'react';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Map from './components/Maps'
import * as queries from './cache/queries';
import { jsTPS } from './utils/jsTPS';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { set } from 'mongoose';
import SpreadSheet from './components/SpreadSheet';
import Regions from './components/Regions'

import { useMutation, useQuery } 		from '@apollo/client';

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

	return (
		<Router>
			<div>
				<Header fetchUser={refetch} user={user}/>
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
				</Switch>
			</div>
		</Router>
	);
}

export default App;