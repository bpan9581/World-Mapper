import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SpreadSheetEntries = (props) => {
    let region = props.region;
    console.log(region.landmark)

    let landmarkCheck = region.landmark.length ;

    const deleteRegion = () => {
        props.setShowDelete(region._id);

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
                if(editingName) {
                    event.target.blur();
                }
                else if(editingCapital) {
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
                else if(editingLeader){
                    event.target.blur();
                }
                break;
            default: break;
        }
    };

    return (
        <div className="spreadsheet-entry-items">
            <div className="material-icons spreadsheet-entry-item size5" onClick={deleteRegion}>close</div>
            <div className="spreadsheet-entry-item spreadsheet-entry-item1 size4" >
                {editingName ?
                    <input id = "nameInput" onBlur={handleNameEdit} autoFocus={true} defaultValue={region.name} type='text' onKeyDown={handleKeyPress}/>
                    : <Link to={`/maps/${region._id}`}  >{region.name}</Link>}
            </div>
            <i className="material-icons spreadsheet-entry-item size5" onClick={() => toggleNameEdit(!editingName)}>edit</i>
            <div className="spreadsheet-entry-item size7" >
                {editingCapital ?
                    <input id = "capitalInput" onBlur={handleCapitalEdit} autoFocus={true} defaultValue={region.capital} type='text' onKeyDown={handleKeyPress} />
                    : <div onClick={toggleCapitalEdit}>{region.capital}</div>}</div>
            <div className="spreadsheet-entry-item size7">{
                editingLeader ?
                    <input id = "leaderInput" onBlur={handleLeaderEdit} autoFocus={true} defaultValue={region.leader} type='text' onKeyDown={handleKeyPress}/>
                    : <div onClick={toggleLeaderEdit}>{region.leader}</div>}</div>
            <i className="spreadsheet-entry-item material-icons size1">image</i>
            <Link onClick = {props.setPath} to={`/maps/${region._id}/region-viewer`} className="spreadsheet-entry-item size8">
                {landmarkCheck > 0 ?  <div className="spreadsheet-entry-text">{region.landmark.join(", ")}</div> : <div>None</div>}
            </Link>
            <div>
        </div>
        </div>
    )
}

export default SpreadSheetEntries;