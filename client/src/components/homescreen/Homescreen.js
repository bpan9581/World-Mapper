import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import MainContents 					from '../main/MainContents';
import SidebarContents 					from '../sidebar/SidebarContents';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction,
	SortItems_Transaction } 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';
import { set } from 'mongoose';


const Homescreen = (props) => {

	let todolists 							= [];
	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [hasUndo, setUndo] 				= useState(false);
	const [hasRedo, setRedo]				= useState(false);
	// const [hasUndo, setUndo] 				= useState(props.tps.hasTransactionToUndo);

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);
	const [SortItems]				= useMutation(mutations.SORT_ITEMS);
	const[MoveTop] 					= useMutation(mutations.MOVE_TOP);


	// console.log(hasUndo)

	// const move = async (index) =>{
	// 	const{data} = await SortI({ variables: { todolists: todolists, index: index }, refetchQueries: [{ query: GET_DB_TODOS }] });
	// }

	const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		todolists = data.getAllTodos; 
		let newTodo = todolists.indexOf(activeList);
		if(newTodo !== -1){
			// move(newTodo)
		}
	}

	const auth = props.user === null ? false : true;

	const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			todolists = data.getAllTodos;
	
			if (activeList._id) {
				let tempID = activeList._id;
				let list = todolists.find(list => list._id === tempID);
				setActiveList(list);

			}
		}
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		setUndo(retVal[1]);
		setRedo(retVal[2]);
		console.log(retVal[0]);
		refetchTodos(refetch);
		return retVal[0];
	}


	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		setUndo(retVal[1]);
		setRedo(retVal[2]);
		console.log(hasUndo);
		refetchTodos(refetch);
		return retVal[0];
	}

	const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === 'z'){
            if(hasUndo)tpsUndo();	
		}		
		if (event.ctrlKey && event.key === 'y'){
			if(hasRedo) tpsRedo();
		}		
    }
	useEffect(
		() => {document.addEventListener('keydown', handleKeyDown);
		return() => document.removeEventListener('keydown', handleKeyDown)}
		)

	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const addItem = async () => {
		let list = activeList;
		const items = list.items;
		const lastID = items.length * Math.floor(Math.random() * 1000) + 1;
		const newItem = {
			_id: '',
			id: lastID,
			description: 'No Description',
			due_date: 'No Date',
			assigned_to: "Not Assigned",
			completed: false
		};
		let opcode = 1;
		let itemID = newItem._id;
		let listID = activeList._id;
		let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};


	const deleteItem = async (item, index) => {
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		let itemToDelete = {
			_id: item._id,
			id: item.id,
			description: item.description,
			due_date: item.due_date,
			assigned_to: item.assigned_to,
			completed: item.completed
		}
		let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const editItem = async (itemID, field, value, prev) => {
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeList._id;
		let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const createNewList = async () => {
		const length = todolists.length
		const id = length >= 1 ? todolists[length - 1].id + Math.floor((Math.random() * 1000) + 1) : 1;
		const list = {
			_id: '',
			id: id,
			name: 'Untitled',
			owner: props.user._id,
			items: [],
		}
		const { data } = await AddTodolist({ variables: { todolist: list }});
		list._id = data.addTodolist;
		for(let i = 0; i< todolists.length; i++){
			const {data} = await MoveTop({variables: {_id: todolists[i]._id}});
		}
		setUndo(false);
		setRedo(false);
		setActiveList(list);
		refetch();
		props.tps.clearAllTransactions();
	};


	const deleteList = async (_id) => {
		DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
		refetch();
		setActiveList({});
	};

	const updateListField = async (_id, field, value, prev) => {
		let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const handleSetActive = async (id) => {
		const todo = todolists.find(todo => todo.id === id || todo._id === id);
		let objectId = todo._id;
		for(let i = 0; i< todolists.length; i++){
			if(todolists[i]._id !== objectId){
				const {data} = await MoveTop({variables: {_id: todolists[i]._id}});
			}
		}
		setUndo(false);
		setRedo(false);
		refetch();
		setActiveList(todo);
		props.tps.clearAllTransactions();
	};

	const clearActiveList = () => {
		setUndo(false);
		setRedo(false);
		setActiveList({});
		props.tps.clearAllTransactions();
	}

	
	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(!showDelete)
		props.tps.clearAllTransactions();
	}

	const sort = async (op) => {
		let todolist = activeList.items;
		let direction = 0;
		for(let i = 0; i < todolist.length - 1; i++){
			if(todolist[i][op] > todolist[i+1][op]){
				direction = 1;
				break;
			}
		}
		const test = {
			items: todolist
		}
		let transaction = new SortItems_Transaction(activeList._id, direction, op, SortItems, activeList);
		props.tps.addTransaction(transaction);
		tpsRedo();
		// const { data } = await SortItems({ variables: { _id: activeList._id, direction: direction, op: op, items: test }});
		refetchTodos(refetch);
	}



	return (
		<WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							refetchTodos={refetch} setActiveList={setActiveList}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLSide side="left">
				<WSidebar>
					{
						activeList ?
							<SidebarContents
								todolists={todolists} activeid={activeList.id} auth={auth}
								handleSetActive={handleSetActive} createNewList={createNewList}
								updateListField={updateListField}
							/>
							:
							<></>
					}
				</WSidebar>
			</WLSide>
			<WLMain>
				{
					activeList ? 
							<div className="container-secondary">
								<MainContents
									addItem={addItem} deleteItem={deleteItem}
									editItem={editItem} reorderItem={reorderItem}
									setShowDelete={setShowDelete}
									activeList={activeList} setActiveList={clearActiveList}
									undo={tpsUndo} redo={tpsRedo}
									sort = {sort} 	
									hasRedo = {hasRedo}
									hasUndo = {hasUndo}					
								/>
							</div>
						:
							<div className="container-secondary" />
				}

			</WLMain>

			{
				showDelete && (<Delete deleteList={deleteList} activeid={activeList._id} showDelete = {showDelete} setShowDelete={setShowDelete} />)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} showCreate = {showCreate} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} showLogin = {showLogin} refetchTodos={refetch}setShowLogin={setShowLogin} />)
			}

		</WLayout>
	);
};

export default Homescreen;