import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import {GET_DB_REGION} from '../cache/queries'
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } 		from '@apollo/client';

const Regions = () => {
    const { _id } = useParams();
    let region = [];
    const { loading, error, data, refetch } = useQuery(GET_DB_REGION, { variables: {_id: _id} });
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		region = data.getRegionById; 
	}
    console.log(region)
    let inputValue = "Add New Landmark";

    return(
        <div className = "region-viewer-container">
            <img className = "stock-photo" src = {require('./images/stock-photo.png')}/>
            <div className = "region-viewer-text">
                <div>Region Name:</div>
                <div>Hello</div>
                <div>Parent Region:</div>
                <div>Hello</div>
                <div>Region Capital:</div>
                <div>Hello</div>
                <div>Region Leader:</div>
                <div>Hello</div>
                <div># of Sub Regions:</div>
                <div>Hello</div>
            </div>
            <div className = "region-viewer-landmark-container">
                <div className = "region-viewer-landmark-header">
                    <div>Region Landmarks</div>
                </div>
                <div className = "region-viewer-landmark-body">
                    <div>Hello</div>
                </div>
                <div className = "region-viewer-landmark-adder">
                    <div className = "landmark-adder">+</div>
                    <input className = "new-landmark"/>
                </div>
            </div>
        </div>
    )
}

export default Regions;