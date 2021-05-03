import React, { useState, useEffect } from 'react';
import * as mutations 					from '../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { Link } from 'react-router-dom';

const SpreadSheetEntries = (props) => {
    const [DeleteRegion] = useMutation(mutations.DELETE_REGION);
	const [UpdateRegion] = useMutation(mutations.UPDATE_REGION_FIELD);


    let region = props.region;

    let landmarkCheck = region.landmark === [];

    const deleteRegion = () => {
        props.deleteRegion(region._id);

    }

    return(
        <div className = "spreadsheet-entry-items">
            <div className = "spreadsheet-entry-item size5" onClick = {deleteRegion}>X</div>
            <Link to = {`/maps/${region._id}`} className = "spreadsheet-entry-item spreadsheet-entry-item1 size4" >
                <div>{region.name}</div>
            </Link>
            <i className="material-icons spreadsheet-entry-item size5">edit</i>
            <div className = "spreadsheet-entry-item size7" >{region.capital}</div>
            <div className = "spreadsheet-entry-item size7">{region.leader}</div>
            <i className="spreadsheet-entry-item material-icons size6">image</i>
            {!landmarkCheck ? <div className = "spreadsheet-entry-item size8">None</div> :
                <div className = "spreadsheet-entry-item size8">{region.landmark}</div>}
        </div>
    )
}

export default SpreadSheetEntries;