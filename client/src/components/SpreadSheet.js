import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SpreadSheetEntries from './SpreadSheetEntries'
import * as mutations 					from '../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import * as queries from '../cache/queries'


const SpreadSheet = (props) => {
    const { _id } = useParams();
    const [AddRegion] = useMutation(mutations.ADD_REGION);
    const [DeleteRegion] = useMutation(mutations.DELETE_REGION);
	const [UpdateRegion] = useMutation(mutations.UPDATE_REGION_FIELD);

    let regions = [];
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_REGIONS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		regions = data.getAllRegions; 
	}


    const region = Object.values(regions).filter(region => region._id === _id);
    let name;
    region.forEach(e => name = e.name )
    let children;
    region.forEach(e => children = e.children )

    const deleteRegion = (_id) => {
        DeleteRegion({ variables: { _id: _id}, refetchQueries: [{ query: queries.GET_DB_REGIONS }]});
        refetch();
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

    const elements = []
    if(children){
        for(var i = 0; i < children.length; i++){
            elements.push(regions.filter(x => x._id === children[i]).map( region => (<SpreadSheetEntries region = {region} deleteRegion = {deleteRegion}/> )));
        }
    }   

    return (
        <div className="spreadsheet-container">
            <div className="spreadsheet-top">
                <div className = "spreadsheet-button-container">
                    <i className="material-icons spreadsheet-buttons" onClick = {addNewSubRegion}>add</i>
                    <i className="material-icons spreadsheet-buttons">undo</i>
                    <i className="material-icons spreadsheet-buttons">redo</i>
                </div>
                <div className = "spreadsheet-region-name">
                    <>Region Name:</>
                    <div className = "name">{name}</div>
                </div>
            </div>
            <div className="spreadsheet-header">
                <div className = "header-col size2">
                    <div className = "center">Name</div>
                    <i className="material-icons">expand_more</i>
                </div>
                <div className = "header-col size2">
                    <div>Capital</div>
                    <i className="material-icons">expand_more</i>
                </div>
                <div className = "header-col size2">
                    <div>Leader</div>
                    <i className="material-icons">expand_more</i>
                </div>
                <div className = "header-col size1">
                    <div>Flag</div>
                    <i className="material-icons">expand_more</i>
                </div>
                <div className = "header-col size3">
                    <div>Landmarks</div>
                    <i className="material-icons">expand_more</i>
                </div>
            </div>
            <div className= "spreadsheet-body">
                {elements}               
            </div>
        </div>
    )
}

export default SpreadSheet;