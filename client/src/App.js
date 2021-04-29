import React, { useState } from 'react';
import Header from './components/Header';
import Welcome from './components/Welcome';
import { useQuery } from '@apollo/client';
import * as queries from './cache/queries';
import { jsTPS } from './utils/jsTPS';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { set } from 'mongoose';

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

	return (
		<Router>
			<div>
				<Header fetchUser={refetch} user={user} />
				<Redirect exact from="/" to={ {pathname: "/welcome"} } />
				{check ? <Redirect exact from="/welcome" to={ {pathname: "/maps"} } /> : <div></div>}
				{!check ? <Redirect from="/" to={ {pathname: "/welcome"} } /> : <div></div>}
				<Switch>
					<Route path="/welcome" component={Welcome} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;