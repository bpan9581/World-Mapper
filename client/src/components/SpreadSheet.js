import React, { useState, useEffect, Children } from 'react';
import { useParams } from 'react-router-dom';
import SpreadSheetEntries from './SpreadSheetEntries'
import * as mutations 					from '../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import * as queries from '../cache/queries'
import { Link } from 'react-router-dom';
import Delete from './modals/Delete'
import { EditItem_Transaction, Delete_Transaction, SortItems_Transaction } 				from '../utils/jsTPS';


const SpreadSheet = (props) => {
    const { _id } = useParams();
    let ancestorPath = [];
    let pathNames = []
    const [AddRegion] = useMutation(mutations.ADD_REGION);
    const [DeleteRegion] = useMutation(mutations.DELETE_REGION);
	const [UpdateRegion] = useMutation(mutations.UPDATE_REGION_FIELD);
    const [Sort] = useMutation(mutations.SORT);
    const [ReaddRegion] = useMutation(mutations.READD_REGION);
    const [showDelete, toggleShowDelete] 	= useState(false);
    const [toDelete, setDeleteRegion] = useState({})

    let regions = [];
    let test = [];
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_REGIONS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		regions = data.getAllRegions; 
	}

    const setShowDelete = (_id, index) => {
        setDeleteRegion({_id, index});
		toggleShowDelete(!showDelete)
	}

    const tpsUndo = async () => {
        console.log(props.tps.undoTransaction)
		const retVal = await props.tps.undoTransaction();
		refetch();
		return retVal;
	}


	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetch();
		return retVal;
	}


    const region = Object.values(regions).filter(region => region._id === _id);
    let name;
    region.forEach(e => name = e.name)
    let children;
    region.forEach(e => children = e.children )
    let parent;
    region.forEach(e => parent = e.parent)
    let path;
    region.forEach(e => path = e.path)

    const deleteRegion = async () => {
        let transaction = new Delete_Transaction(toDelete._id, toDelete.index, ReaddRegion, DeleteRegion );
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const setP = () => {
        props.setPath(ancestorPath, name);
    }

    const addNewSubRegion = async () => {
		const map = {
			_id: '',
			name: 'Untitled',
			owner: props.user._id,
			children: [],
		}
		const { data } = await AddRegion({ variables: {_id: _id, map: map }});
		map._id = data.addRegion;
		refetch();
    }

    const editItem = async (_id, field, value, preEdit) => {
        let transaction = new EditItem_Transaction(_id, field, preEdit, value, UpdateRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const elements = []
    let index = 0;
    if(children){
        for(var i = 0; i < children.length; i++){
            elements.push(regions.filter(x => x._id === children[i]).map( region => (<SpreadSheetEntries 
                region = {region} children = {children} setChildren = {props.setChildren(children)}
                 setShowDelete = {setShowDelete} setPath = {setP} deleteRegion = {deleteRegion} tps = {props.tps.clearAllTransactions()}
                 editItem = {editItem} index = {index} length = {children.length}/> )));
            index++;
        }
    }   

    const redirectPath = (e, index) => {
        const ancestor = Object.values(regions).filter(region => region._id === e);
        let name;
        ancestor.forEach(e => name = e.name)
        pathNames.push(name)
        let _id;
        ancestor.forEach(e => _id = e._id)
        if(index === path.length - 1){
            ancestorPath.push( <Link onClick = {props.tps.clearAllTransactions()} className = "disable-link" to = {`/maps/${_id}`} ><div>{name}</div></Link>)
        }
        else
        ancestorPath.push( <div className = "flex">
            <Link onClick = {props.tps.clearAllTransactions()} className = "disable-link" to = {`/maps/${_id}`}><div>{name}</div></Link>
            <div className = "whitespace"></div>
            <div>{'>'}</div>
            <div className = "whitespace"></div>
        </div>)
    }

    if(children){
        test = (children.map(e => regions.filter(element => element._id === e)[0]))
    }

    path && path.map((e, index) => redirectPath(e, index));
    
    const sort = (e) => {
        let op = e.target.id;
        children = children.slice();
        let prevChildren = children.slice();
        let direction = 0;
        if(test){
            for (let i = 0; i < test.length-1; i++){
                if(test[i + 1][op].toUpperCase() < test[i][op].toUpperCase()){
                    direction = 1;
                    break;
                }
            }
        }
        if(test){
            if(direction === 1) test.sort((a, b) => (a[op].toUpperCase() > b[op].toUpperCase()) ? 1: -1);
            else test.reverse();
        }
        children = test.map(e => e._id);
        let transaction = new SortItems_Transaction(_id, children, prevChildren, Sort);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

    useEffect(() => {refetch()}, [])

    return (
        <div className="spreadsheet-container">
            <div className="spreadsheet-top">
                <div className = "spreadsheet-button-container">
                    <i className="material-icons spreadsheet-buttons" onClick = {addNewSubRegion}>add</i>
                    <i className="material-icons spreadsheet-buttons" onClick = {tpsUndo}>undo</i>
                    <i className="material-icons spreadsheet-buttons" onClick = {tpsRedo}>redo</i>
                </div>
                <div className = "spreadsheet-region-name">
                    <>Region Name:</>
                    <div className = "name">{name}</div>
                </div>
            </div>
            <div className="spreadsheet-header">
                <div id = "name" className = "header-col size2" onClick = {sort}>Name</div>
                <div id = "capital" className = "header-col size2" onClick = {sort}>Capital</div>
                <div id = "leader" className = "header-col size2" onClick = {sort}>Leader</div>
                <div className = "header-col size1">Flag</div>
                <div className = "header-col size3">Landmarks</div>
            </div>
            <div className= "spreadsheet-body">
                {elements}               
            </div>
            <div className = "path">
            {ancestorPath}
            </div>
            <div>{showDelete && (<Delete _id = {toDelete} deleteRegion = {deleteRegion} showDelete = {showDelete} setShowDelete={setShowDelete} />)}</div>
        </div>
    )
}

export default SpreadSheet;