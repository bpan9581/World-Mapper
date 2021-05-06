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

    let test = {};
    test = props.activeRegion;

    let regions = [];
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_REGIONS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		regions = data.getAllRegions; 
	}

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
        console.log(test)
		const { data } = await AddRegion({ variables: {_id: _id, map: map }});
		map._id = data.addRegion;
		refetch();
    }

    const editItem = async (_id, field, value, preEdit) => {
        UpdateRegion({ variables: { _id: _id, field: field, value: value}, refetchQueries: [{ query: queries.GET_DB_REGIONS }]});
		refetch();
    }

    const elements = []
    if(test.children){
        for(var i = 0; i < test.children.length; i++){
            elements.push(regions.filter(x => x._id === test.children[i]).map( region => (<SpreadSheetEntries region = {region} children = {test.children} setChildren = {props.setChildren(test.children)} deleteRegion = {deleteRegion} editItem = {editItem}/> )));
        }
    }   
    
    useEffect(() => {refetch()}, [])

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
                    <div className = "name">{test.name}</div>
                </div>
            </div>
            <div className="spreadsheet-header">
                <div className = "header-col size2">Name</div>
                <div className = "header-col size2">Capital</div>
                <div className = "header-col size2">Leader</div>
                <div className = "header-col size1">Flag</div>
                <div className = "header-col size3">Landmarks</div>
            </div>
            <div className= "spreadsheet-body">
                {elements}               
            </div>
            <div>{test.parent ? <div>{test.parent}</div> : <div></div>}</div>
        </div>
    )
}

export default SpreadSheet;