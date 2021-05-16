import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GET_DB_REGION, GET_DB_REGIONS } from '../cache/queries'
import * as mutations from '../cache/mutations';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import Landmark from './Landmark';
import { EditItem_Transaction, Change_Transaction } from '../utils/jsTPS';
import Change from './modals/Change'

const Regions = (props) => {
    const { _id } = useParams();
    const [UpdateRegionLandmark] = useMutation(mutations.UPDATE_REGION_LANDMARK);
    const [ChangeParent] = useMutation(mutations.CHANGE_PARENT);
    const [hasUndo, setUndo] 				= useState(false);
	const [hasRedo, setRedo]				= useState(false);
    const [showChange, toggleShowChange] 	= useState(false);

    const clickDisabled = () => { };

    const tpsUndo = async () => {

		const retVal = await props.tps.undoTransaction();
        setUndo(retVal[1]);
		setRedo(retVal[2]);
		refetch();
		return retVal;
	}


	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
        setUndo(retVal[1]);
		setRedo(retVal[2]);
		refetch();
		return retVal;
	}

    const clearAllTransactions = () => {
        setRedo(false);
        setUndo(false)
        props.clearAllTransactions();
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

    let path;
    let ancestorPath = [];
    let pathNames = []

    let maps = [];
    let region = [];
    let subregions = [];
    let parentId;
    const { data, refetch } = useQuery(GET_DB_REGION, { variables: { _id: _id } });
    if (data) {
        region = data.getRegionById;
        parentId = data.getRegionById.parent;
        path = region.path;
    }

    const { loading: loading1, error: error1, data: data1, refetch: refetch1 } = useQuery(GET_DB_REGIONS);
    if (loading1) { console.log(loading1, 'loading'); }
    if (error1) { console.log(error1, 'error'); }
    if (data1) {
        maps = data1.getAllRegions;
    }


    let inputValue = "Add New Landmark";
    let length = region.children ? region.children.length : 0;


    let children = props.children;
    let index = children.toString().indexOf(_id) / 25;
    let prevButtonStyle = index === 0 ? "material-icons viewer-buttons-disabled" : "material-icons viewer-buttons"
    let nextButtonStyle = index === children.length - 1 ? "material-icons viewer-buttons-disabled" : "material-icons viewer-buttons"

    const addItem = async () => {
        let input = document.getElementById("landmark-box")
        let value = input.value;
        if (value !== "") {
            input.value = "";
            let landmark = region.landmark;
            let preEdit = landmark;
            let newLandmark = [];
            landmark.map(x => newLandmark.push(x))
            newLandmark.push(value)
            let transaction = new EditItem_Transaction(_id, 'landmark', preEdit, newLandmark, UpdateRegionLandmark);
            props.tps.addTransaction(transaction);
            tpsRedo();
        }
    }

    const setShowChange = async (id) => {
		toggleShowChange(!showChange)
        let transaction = new Change_Transaction(_id, id, parentId, ChangeParent);
        props.tps.addTransaction(transaction);
        tpsRedo();
	}

    const setShowChange1 = () => {
        toggleShowChange(!showChange)
    }

    const editItem = async (index, edit, preEdit) => {
        let landmark = region.landmark;
        let newLandmark = [];
        landmark.map(x => newLandmark.push(x))
        newLandmark[index] = edit;

        let transaction = new EditItem_Transaction(_id, 'landmark', preEdit, newLandmark, UpdateRegionLandmark);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    const deleteLandmark = async (itemToDelete, item) => {
        let landmark = region.landmark;
        let newLandmark = [];
        landmark.map(x => newLandmark.push(x))
        newLandmark.splice(itemToDelete, 1)

        let transaction = new EditItem_Transaction(_id, 'landmark', landmark, newLandmark, UpdateRegionLandmark);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    const redirectPath = (e, index) => {
        const ancestor = Object.values(maps).filter(region => region._id === e);
        let name;
        ancestor.forEach(e => name = e.name)
        pathNames.push(name)
        let _id;
        ancestor.forEach(e => _id = e._id)
        if(index === path.length - 1){
            ancestorPath.push( <Link onClick = {clearAllTransactions}  className = "disable-link" to = {`/maps/${_id}`} ><div>{name}</div></Link>)
        }
        else
        ancestorPath.push( <div className = "flex">
            <Link onClick = {clearAllTransactions}  className = "disable-link" to = {`/maps/${_id}`}><div>{name}</div></Link>
            <div className = "whitespace"></div>
            <div>{'>'}</div>
            <div className = "whitespace"></div>
        </div>)
    }

    path && path.map((e, index) => redirectPath(e, index));

    maps.forEach(x => {if (x.path.includes(_id)) x.landmark.forEach(y => subregions.push(y + " - " + x.name + ''))})
    let check = false;
    try {
        let src = require(`./images/${pathNames.join('/')}/${region.name} Flag.png`);
        if (src) check = true;
    } catch (error) {
        console.log(error)
    }

    return (
        <div className="region-viewer-container">
            <div className = "top-right">
                <div className = "flex white">
                    <i className={hasUndo ? "material-icons spreadsheet-buttons" : "material-icons undo-redo-disabled"} onClick = {hasUndo ? tpsUndo : clickDisabled}>undo</i>
                    <div className = "whitespace"></div>
                    <i className={hasRedo ? "material-icons spreadsheet-buttons" : "material-icons undo-redo-disabled"} onClick = {hasRedo ? tpsRedo : clickDisabled}>redo</i>
                </div>
                {check ? <img className="stock-photo" src={require(`./images/${pathNames.join('/')}/${region.name} Flag.png`)} /> :
                <img className="stock-photo" src={require('./images/stock-photo.png')} />}
            </div>
        
            <div className="region-viewer-text">
                <div className="region-viewer-text-values">
                    <div>Region Name:</div>
                    <div className = "whitespace"></div>
                    <div>{region.name}</div> 
                </div>
                <div className="region-viewer-text-values">
                    <div>Parent Region:</div>
                    <div className = "whitespace"></div>
                    <Link onClick = {clearAllTransactions} to={`/maps/${parentId}`}>{pathNames[pathNames.length - 1]}</Link>
                    <div className = "whitespace"></div>
                    <i className="material-icons spreadsheet-buttons" onClick = {setShowChange1}>edit</i>
                </div>
                <div className="region-viewer-text-values">
                    <div>Region Capital:</div>
                    <div className = "whitespace"></div>
                    <div>{region.capital}</div>
                </div>
                <div className="region-viewer-text-values">
                    <div>Region Leader:</div>
                    <div className = "whitespace"></div>
                    <div>{region.leader}</div>
                </div>
                <div className="region-viewer-text-values">
                    <div># of Sub Regions:</div>
                    <div className = "whitespace"></div>
                    <div>{length}</div>
                </div>
            </div>
            <div className="region-viewer-landmark-container">
                <div className="region-viewer-landmark-header">
                    <div>Region Landmarks</div>
                </div>
                <div className="region-viewer-landmark-body">
                    {region.landmark && region.landmark.map((x, index) => <Landmark x={x} index={index} editItem={editItem} deleteLandmark={deleteLandmark} />)}
                    <div>{subregions && subregions.map(x => <div className = "landmark-text2 landmark-text-container">{x}</div>)}</div>
                </div>
                <div className="region-viewer-landmark-adder">
                    <div className="landmark-adder" onClick={addItem}>+</div>
                    <input id="landmark-box" className="new-landmark" />
                </div>
            </div>
            <div className="absolute-sister">
                {index === 0 ? <i className={`${prevButtonStyle}`}>arrow_back</i> :
                    <Link to={`/maps/${children[index - 1]}/region-viewer`} onClick = {clearAllTransactions}  className={`${prevButtonStyle}`}>arrow_back</Link>}
                <div className="whitespace"></div>
                {index === children.length - 1 ? <i className={`${nextButtonStyle}`}>arrow_forward</i> :
                    <Link to={`/maps/${children[index + 1]}/region-viewer`}  onClick = {clearAllTransactions} className={`${nextButtonStyle}`}>arrow_forward</Link>}
            </div>
            <div className="path">
                {ancestorPath}
            </div>
            <Change showChange = {showChange} parent = {parentId} id = {region._id} path = {path} maps = {maps} setShowChange1 = {setShowChange1} setShowChange={setShowChange}  />
        </div>
    )
}

export default Regions;