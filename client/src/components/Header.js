import React, { useState, useEffect } 	from 'react';
import Logo 							from './navbar/Logo';
import NavbarOptions 					from './navbar/NavbarOptions';
import Login 							from './modals/Login';
import CreateAccount 					from './modals/CreateAccount';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { Link } from 'react-router-dom';

import WInput from 'wt-frontend/build/components/winput/WInput';
import { set } from 'mongoose';


const Homescreen = (props) => {

	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);

	// const [hasUndo, setUndo] 				= useState(props.tps.hasTransactionToUndo);



	// console.log(hasUndo)

	// const move = async (index) =>{
	// 	const{data} = await SortI({ variables: { todolists: todolists, index: index }, refetchQueries: [{ query: GET_DB_TODOS }] });
	// }


	const auth = props.user === null ? false : true;

	
	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};




	return (
		<div>
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<Link to = {`/maps`}>
							<Logo className='logo' />
						</Link>
					</ul>
					<ul>Hello</ul>
					<ul>Hello</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
						/>
					</ul>
				</WNavbar>
			</WLHeader>


			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} showCreate = {showCreate} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} showLogin = {showLogin} setShowLogin={setShowLogin} />)
			}
		</div> 
	);
};

export default Homescreen;