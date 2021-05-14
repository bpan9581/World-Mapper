import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SpreadSheetEntries = (props) => {
    let region = props.region;

    let landmarkCheck = region.landmark.length ;

    const deleteRegion = () => {
        props.setShowDelete(region._id, props.index);

    }

    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'Untitled';
        const prevName = region.name;
        props.editItem(region._id, 'name', newName, prevName);
    };

    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : 'None';
        const prevCapital = region.capital;
        props.editItem(region._id, 'capital', newCapital, prevCapital);
    };

    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : 'None';
        const prevLeader = region.leader;
        props.editItem(region._id, 'leader', newLeader, prevLeader);
    };

    
    const  handleKeyPress = (event) =>{
        switch(event.keyCode){
            case 37: 
                if(editingCapital) {
                    event.target.blur();
                    toggleNameEdit(true);
                }
                else if(editingLeader){
                    event.target.blur();
                    toggleCapitalEdit(true);
                }
            break;
            case 39:
                if(editingName) {
                    event.target.blur();
                    toggleCapitalEdit(true);
                }
                else if(editingCapital) {
                    event.target.blur();
                    toggleLeaderEdit(true);
                }
                break;
            case 38:
                if(editingName) {
                    if(props.index !== 0){
                        let check = "nameInput" + (props.index - 1) + "";
                        let test = document.getElementById(check)
                        test.click();
                    }
                }
                else if(editingCapital) {
                    if(props.index !== 0){
                        let check = "capitalInput" + (props.index - 1) + "";
                        let test = document.getElementById(check)
                        test.click();
                    }
                }
                else if(editingLeader){
                    if(props.index !== 0){
                        let check = "leaderInput" + (props.index - 1) + "";
                        let test = document.getElementById(check)
                        test.click();
                    }
                }
                break;    
            case 40:
                if(editingName) {
                    if(props.index !== props.length - 1){
                        let check = "nameInput" + (props.index + 1) + "";
                        let test = document.getElementById(check)
                        test.click();
                    }
                }
                else if(editingCapital) {
                    if(props.index !== props.length - 1){
                        let check = "capitalInput" + (props.index + 1) + "";
                        let test = document.getElementById(check)
                        test.click();
                    }
                }
                else if(editingLeader){
                    if(props.index !== props.length - 1){
                        let check = "leaderInput" + (props.index + 1) + "";
                        let test = document.getElementById(check)
                        test.click();
                    }
                }
                break;    
            default: break;
        }
    };
    let nameId = "nameInput" + props.index + "";
    let capitalId = "capitalInput" + props.index + "";
    let leaderId = "leaderInput" + props.index + "";

    return (
        <div className="spreadsheet-entry-items">
            <div className="material-icons spreadsheet-entry-item size5" onClick={deleteRegion}>close</div>
            <div className="spreadsheet-entry-item spreadsheet-entry-item1 size4" >
                {editingName ?
                    <input  onBlur={handleNameEdit} autoFocus={true} defaultValue={region.name} type='text' onKeyDown={handleKeyPress}/>
                    : <Link  to={`/maps/${region._id}`}  >{region.name}</Link>}
            </div>
            <i id = {nameId} className="material-icons spreadsheet-entry-item size5" onClick={() => toggleNameEdit(!editingName)}>edit</i>
            <div className="spreadsheet-entry-item size7" >
                {editingCapital ?
                    <input onBlur={handleCapitalEdit} autoFocus={true} defaultValue={region.capital} type='text' onKeyDown={handleKeyPress} />
                    : <div id = {capitalId} onClick={toggleCapitalEdit}>{region.capital}</div>}</div>
            <div className="spreadsheet-entry-item size7">{
                editingLeader ?
                    <input onBlur={handleLeaderEdit} autoFocus={true} defaultValue={region.leader} type='text' onKeyDown={handleKeyPress}/>
                    : <div  id = {leaderId} onClick={toggleLeaderEdit}>{region.leader}</div>}</div>
            <i className="spreadsheet-entry-item material-icons size1">image</i>
            <Link onClick = {props.tps} onClick = {props.setPath} to={`/maps/${region._id}/region-viewer`} className="spreadsheet-entry-item size8">
                {landmarkCheck > 0 ?  <div className="spreadsheet-entry-text">{region.landmark.join(", ")}</div> : <div>None</div>}
            </Link>
            <div>
        </div>
        </div>
    )
}

export default SpreadSheetEntries;